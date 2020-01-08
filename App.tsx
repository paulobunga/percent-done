import React, { FunctionComponent, useEffect, useState } from 'react';
import Storybook from './storybook';
import { Platform, UIManager, View, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationService } from './src/utilities';
import { AppContainer } from './src/navigators/AppContainer';
import configureStore from './src/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import { setCurrentDate } from './src/store/settings/actions';

YellowBox.ignoreWarnings(['Warning:']);
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
YellowBox.ignoreWarnings(['Story with id']);

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// export default Storybook;

const { store, persistor } = configureStore();

const App: FunctionComponent = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const { id, startTimestamp } = store.getState().goals.trackedGoal;

    if (id != null && startTimestamp != null) {
      NavigationService.navigate('TrackGoal', {});
    }
  }, [loaded]);

  useEffect(() => {
    store.dispatch(setCurrentDate(new Date()));
  }, []);

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
export default App;
