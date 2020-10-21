import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import OverviewScreen from '../screens/OverviewScreen';
import PositiveScreen from '../screens/PositiveScreen';
import NegativeScreen from '../screens/NegativeScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../utils/Colors';

const BTNav = createBottomTabNavigator();

export default function Navigator() {
  return (
    <BTNav.Navigator>
      <BTNav.Screen
        name="Positive"
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-add" color={color} size={size} />
          ),
        }}
        component={PositiveScreen}
      />
      <BTNav.Screen
        name="Negative"
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-remove" color={color} size={size} />
          ),
        }}
        component={NegativeScreen}
      />
      <BTNav.Screen
        name="Overview"
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="calendar-o" color={color} size={size} />
          ),
        }}
        component={OverviewScreen}
      />
    </BTNav.Navigator>
  );
}
