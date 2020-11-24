import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

import OverviewScreen from '../screens/OverviewScreen';
import PositiveScreen from '../screens/PositiveScreen';
import NegativeScreen from '../screens/NegativeScreen';

import HabitHelpModal from '../components/HabitHelpModal';
import OverviewHelpModal from '../components/OverviewHelpModal';
import EditModal from '../components/EditModal';
import DayModal from '../components/DayModal';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import {Colors} from '../utils/Constants';

//Start with one stack navigator per screen

const PositiveStack = createStackNavigator<PositiveParamList>();

function PositiveNavigator() {
  return (
    <PositiveStack.Navigator>
      <PositiveStack.Screen
        name="PositiveScreen"
        component={PositiveScreen}
        options={{
          headerTitle: 'Positive Habits',
          headerStyle: {
            backgroundColor: '#009BE4',
          },
        }}
      />
    </PositiveStack.Navigator>
  );
}

const NegativeStack = createStackNavigator<NegativeParamList>();

function NegativeNavigator() {
  return (
    <NegativeStack.Navigator>
      <NegativeStack.Screen
        name="NegativeScreen"
        component={NegativeScreen}
        options={{
          headerTitle: 'Negative Habits',
          headerStyle: {
            backgroundColor: '#009BE4',
          },
        }}
      />
    </NegativeStack.Navigator>
  );
}

const OverviewStack = createStackNavigator<OverviewParamList>();

function OverviewNavigator() {
  return (
    <OverviewStack.Navigator>
      <OverviewStack.Screen
        name="OverviewScreen"
        component={OverviewScreen}
        options={{
          headerTitle: 'Overview',
          headerStyle: {
            backgroundColor: '#009BE4',
          },
        }}
      />
    </OverviewStack.Navigator>
  );
}

//All stack navigators in one Tab navigator
const BTNav = createBottomTabNavigator();

function BTNavigator() {
  return (
    <BTNav.Navigator>
      <BTNav.Screen
        name="Positive"
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-add" color={color} size={size} />
          ),
        }}
        component={PositiveNavigator}
      />
      <BTNav.Screen
        name="Negative"
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-remove" color={color} size={size} />
          ),
        }}
        component={NegativeNavigator}
      />
      <BTNav.Screen
        name="Overview"
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="ios-calendar" color={color} size={size} />
          ),
        }}
        component={OverviewNavigator}
      />
    </BTNav.Navigator>
  );
}

const RootNav = createStackNavigator();

export default function RootNavigator() {
  return (
    <RootNav.Navigator>
      <RootNav.Screen
        name="BTNav"
        component={BTNavigator}
        options={{headerShown: false}}
      />
      <RootNav.Screen
        name="HabitHelp"
        component={HabitHelpModal}
        mode="modal"
        options={{
          headerTitle: 'Habit Help',
          headerStyle: {
            backgroundColor: '#eee',
            borderBottomWidth: 1,
            borderBottomColor: '#888',
          },
        }}
      />
      <RootNav.Screen
        name="OverviewHelp"
        component={OverviewHelpModal}
        mode="modal"
        options={{
          headerTitle: 'Overview Help',
          headerStyle: {
            backgroundColor: '#eee',
            borderBottomWidth: 1,
            borderBottomColor: '#888',
          },
        }}
      />
      <RootNav.Screen
        name="EditModal"
        component={EditModal}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#eee',
            borderBottomWidth: 1,
            borderBottomColor: '#888',
          },
        }}
      />
    </RootNav.Navigator>
  );
}
