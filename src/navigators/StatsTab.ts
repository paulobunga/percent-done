import { StatsScreen, TimeMachineScreen } from '../screens';
import { createStackNavigator } from 'react-navigation-stack';
import { headerConfig } from './headerConfig';
import { createNavigator, TabRouter } from 'react-navigation';
import { TabNavigationView } from '../components';

const router = TabRouter(
  {
    Stats: StatsScreen,
    TimeMachine: {
      screen: TimeMachineScreen,
      navigationOptions: {
        tabBarLabel: 'Time Machine',
      },
    },
  },
  {
    initialRouteName: 'Stats',
  },
);

/**
 * Tabs within the "Stats" tab.
 **/
const TabsNavigator = createNavigator(
  TabNavigationView,
  router,
  {},
);

export const StatsTab = createStackNavigator({
    StatsTab: TabsNavigator,
  },
  {
    navigationOptions: {
      tabBarLabel: 'Stats',
    },
    defaultNavigationOptions: {
      ...headerConfig,
      title: 'Stats',
    },
  },
);
