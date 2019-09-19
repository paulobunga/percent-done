import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
  TabRouter,
  createNavigator,
} from 'react-navigation';
import Storybook from './storybook';
import { colors, fonts } from './src/theme';
import {
  SettingsScreen,
  TomorrowScreen,
  StatsScreen, GoalsScreen, TimetableScreen,
} from './src/screens';
import { Image, YellowBox } from 'react-native';
import { Icons } from './assets';
import { HeaderButton, TabNavigationView } from './src/components';
import { combineReducers, createStore } from 'redux';
import { goalsReducer } from './src/store/goals/reducers';
import { Provider } from 'react-redux';
import { timetableEntriesReducer } from './src/store/timetableEntries/reducers';
import { createGoal, createStoreState, createTimetableEntry } from './src/factories';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AddGoalScreen } from './src/screens/AddGoalScreen';

YellowBox.ignoreWarnings(['Warning: Async Storage has been extracted from']);
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps is deprecated']);
YellowBox.ignoreWarnings(['Warning: componentWillMount is deprecated']);

// export default Storybook;

const router = TabRouter(
  {
    Goals: GoalsScreen,
    Timetable: TimetableScreen,
  },
  {
    initialRouteName: 'Goals',
  },
);

const TodayTabsNavigator = createNavigator(
  TabNavigationView,
  router,
  {},
);

const TodayStack = createStackNavigator({
    AddGoal: AddGoalScreen,
    Today: TodayTabsNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: colors.offWhite,
      },
      headerTitleStyle: {
        fontFamily: fonts.semibold,
        fontWeight: '600',
        color: colors.offBlack,
        fontSize: 14,
        textTransform: 'uppercase',
      },
      headerRight: (
        <HeaderButton title='Add Goal' primary onPress={() => navigation.navigate('AddGoal')} />
      ),
      title: 'Today',
    }),
    mode: 'modal',
  },
);

const TomorrowStack = createStackNavigator({
  Tomorrow: TomorrowScreen,
});

const StatsStack = createStackNavigator({
  Stats: StatsScreen,
});

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

const AppNavigator = createBottomTabNavigator(
  {
    Today: TodayStack,
    Tomorrow: TomorrowStack,
    Stats: StatsStack,
    Settings: SettingsStack,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;

        return <Image source={getTabIcon(routeName, focused)} />;
      },
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
    }),
    tabBarOptions: {
      activeTintColor: colors.orange,
      inactiveTintColor: colors.lightGray,
      labelStyle: {
        fontFamily: fonts.semibold,
        fontSize: 12,
        marginTop: 4,
        marginBottom: -2,
      },
      style: {
        height: 60,
        paddingVertical: 8,
      },
    },
  },
);

const AppContainer = createAppContainer(AppNavigator);

const today = new Date();
const incompleteGoal = createGoal({
  title: 'Work on PercentDone',
  durationInSeconds: 1 * 60 * 60,
  chainLength: 23,
  color: colors.orange,
  isTimeTracked: true,
}, [today]);
const completedGoal = createGoal({
  title: 'Read',
  durationInSeconds: 0,
  isTimeTracked: false,
  chainLength: 10,
  color: colors.blue,
}, [today]);
const timetableEntry = createTimetableEntry({
  goalId: incompleteGoal.id,
  startHour: 10,
  durationInMin: 30,
  startDate: today,
});
const timetableEntry2 = createTimetableEntry({
  goalId: completedGoal.id,
  startHour: 10,
  durationInMin: 0,
  startDate: today,
});
const seedData = createStoreState({
  goals: [incompleteGoal, completedGoal],
  timetableEntries: [timetableEntry, timetableEntry2],
});

const rootReducer = combineReducers({
  goals: goalsReducer,
  timetableEntries: timetableEntriesReducer,
});
const store = createStore(rootReducer, seedData, composeWithDevTools());

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

function getTabIcon(routeName: string, focused: boolean) {
  switch (routeName) {
    case 'Today':
      return focused ? Icons.todayActive : Icons.todayInactive;
    case 'Tomorrow':
      return focused ? Icons.tomorrowActive : Icons.tomorrowInactive;
    case 'Stats':
      return focused ? Icons.statsActive : Icons.statsInactive;
    case 'Settings':
      return focused ? Icons.settingsActive : Icons.settingsInactive;
  }

  return null;
}
