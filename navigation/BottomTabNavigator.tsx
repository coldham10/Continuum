import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import PositiveScreen from "../screens/PositiveScreen";
import NegativeScreen from "../screens/NegativeScreen";
import OverviewScreen from "../screens/OverviewScreen";
import {
  BottomTabParamList,
  PositiveParamList,
  NegativeParamList,
  OverviewParamList,
} from "../types";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Positive"
      lazy={false}
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Positive"
        component={PositiveNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-add" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Negative"
        component={NegativeNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-remove" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Overview"
        component={OverviewNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-calendar" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const PositiveStack = createStackNavigator<PositiveParamList>();

function PositiveNavigator() {
  return (
    <PositiveStack.Navigator>
      <PositiveStack.Screen
        name="PositiveScreen"
        component={PositiveScreen}
        options={{
          headerTitle: "Positive Habits",
          headerStyle: {
            backgroundColor: "#009BE4",
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
          headerTitle: "Negative Habits",
          headerStyle: {
            backgroundColor: "#009BE4",
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
          headerTitle: "Overview",
          headerStyle: {
            backgroundColor: "#009BE4",
          },
        }}
      />
    </OverviewStack.Navigator>
  );
}
