import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View, ScrollView } from "../components/Themed";
import HabitList from "../components/HabitList";

export default function PositiveScreen(props) {
  return (
    <HabitList
      dataKey="positiveList"
      positive={true}
      navigation={props.navigation}
    />
  );
}
