import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View, ScrollView } from "../components/Themed";
import HabitList from "../components/HabitList";

export default function PositiveScreen() {
  return <HabitList dataKey="positiveList" />;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
