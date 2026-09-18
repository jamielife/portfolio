import React from 'react';
import { createNavigatorFactory, useNavigationBuilder } from '@react-navigation/native';
import { DrawerView } from '@react-navigation/drawer';
import HistoryDrawerRouter from './HistoryDrawerRouter';

function HistoryDrawerNavigator({
  id, initialRouteName, children, screenListeners, screenOptions,
  defaultStatus = 'closed', ...rest
}) {
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder(
    HistoryDrawerRouter,
    { id, initialRouteName, defaultStatus, children, screenListeners, screenOptions }
  );

  return (
    <NavigationContent>
      <DrawerView {...rest} defaultStatus={defaultStatus}
        state={state} descriptors={descriptors} navigation={navigation} />
    </NavigationContent>
  );
}

export default createNavigatorFactory(HistoryDrawerNavigator);
