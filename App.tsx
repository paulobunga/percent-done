import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import Storybook from './storybook';
import { AppState, AppStateStatus, Platform, UIManager, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { momentWithDeviceLocale, NavigationService } from './src/utilities';
import { AppContainer } from './src/navigators/AppContainer';
import configureStore from './src/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { setCurrentDateTimestamp } from './src/store/settings/actions';
import { configureNotifications } from './src/utilities/configureNotifications';
import SplashScreen from 'react-native-splash-screen';
import { setStatusBarStyle } from './src/utilities/statusBar';

YellowBox.ignoreWarnings([
  'Warning:',
  'VirtualizedLists should never be nested',
  'Story with id',
  '`-[RCTRootView cancelTouches]`',
  'Require cycle:',
  'Starting Storybook v5.3.0',
]);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default Storybook;

const { store, persistor } = configureStore();
configureNotifications();

const App: FunctionComponent = () => {
  const appState = useRef(AppState.currentState);
  const [dayChangeTimeoutId, setDayChangeTimeoutId] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    updateCurrentDateAndSetTimeoutForTheNextDay();
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => AppState.removeEventListener('change', handleAppStateChange);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    setStatusBarStyle('dark');
    SplashScreen.hide();

    const state = store.getState();
    const { id, startTimestamp } = state.goals.trackedGoal;
    const { hasOnboarded } = state.settings;

    if (id != null && startTimestamp != null) {
      NavigationService.navigate('TrackGoal', {});
    }

    if (!hasOnboarded) {
      NavigationService.navigate('Onboarding', {});
    }
  }, [loaded]);

  const updateCurrentDateAndSetTimeoutForTheNextDay = () => {
    const currentTimestamp = Date.now();
    store.dispatch(setCurrentDateTimestamp(currentTimestamp));

    if (Platform.OS === 'ios') {
      clearTimeout(dayChangeTimeoutId);

      const msUntilTomorrow = +momentWithDeviceLocale(currentTimestamp)
        .add(1, 'day')
        .startOf('day')
        .subtract(currentTimestamp);

      setDayChangeTimeoutId(
        setTimeout(() => {
          updateCurrentDateAndSetTimeoutForTheNextDay();
        }, msUntilTomorrow),
      );
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      updateCurrentDateAndSetTimeoutForTheNextDay();
    }

    appState.current = nextAppState;
  };

  const handleFirstLoad = () => {
    setLoaded(true);
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <AppContainer ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}
                      onNavigationStateChange={handleFirstLoad} />
      </PersistGate>
    </Provider>
  );
};
// export default App;
