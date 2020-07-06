import * as React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function Habit({ title, fulfilled }) {
  return (
    <View style={{ ...fulfilledColors(fulfilled), ...styles.habit }}>
      <Text style={{ ...fulfilledColors(fulfilled), ...styles.title }}>
        {title}
      </Text>
    </View>
  );
}

function fulfilledColors(fulfilled) {
  if (fulfilled > 0) {
    return {
      backgroundColor:
        "rgb(" +
        Math.max(0, Math.round(255 * (1 - 2 * fulfilled))) +
        "," +
        Math.round(55 + (1 - fulfilled) * 200) +
        "," +
        Math.round(200 + 55 * (1 - fulfilled)) +
        ")",
      color:
        "rgb(" +
        Math.round(200 * (1 - fulfilled) + (fulfilled < 0.6 ? -70 : 160)) +
        "," +
        Math.round(200 * (1 - fulfilled) + (fulfilled < 0.6 ? -70 : 160)) +
        "," +
        Math.round(200 * (1 - fulfilled) + (fulfilled < 0.6 ? -70 : 160)) +
        ")",
    };
  } else {
    return { backgroundColor: "#eee", color: "#000" };
  }
}

const styles = StyleSheet.create({
  habit: {
    height: 60,
    minWidth: "90%",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10,
  },
});
