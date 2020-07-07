import * as React from "react";
import { StyleSheet } from "react-native";
import OverviewCalendar from "../components/OverviewCalendar";

import { Text, View } from "../components/Themed";

export default function OverviewScreen() {
  return (
    <View style={styles.container}>
      <OverviewCalendar
        positiveDataKey="positiveList"
        negativeDataKey="negativeList"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
