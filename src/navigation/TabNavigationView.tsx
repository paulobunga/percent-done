import * as React from 'react';
import { FunctionComponent } from 'react';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { BackgroundView, TabBar } from '../components';

interface Props {
  navigation: NavigationScreenProp<NavigationState>,
}

export const TabNavigationView: FunctionComponent<Props> = ({ navigation }) => {
  const onTabChange = (newTabTitle: string) => {
    navigation.navigate(newTabTitle);
  };

  return (
    <BackgroundView>
      <TabBar navigationState={navigation.state} onTabChange={onTabChange} />
    </BackgroundView>
  );
};
