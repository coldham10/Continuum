import * as React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";

export default function Habit({ title, fulfilled, deleteItem }) {
  return (
    <View style={{ ...fulfilledColors(fulfilled), ...styles.habit }}>
      <Text style={{ ...fulfilledColors(fulfilled), ...styles.title }}>
        {title}
      </Text>
      <Ionicons
        name="md-create"
        style={{ ...fulfilledColors(fulfilled), ...styles.icon }}
        onPress={() => console.log("pressed")}
      />
      <Ionicons
        name="ios-trash"
        style={{ ...fulfilledColors(fulfilled), ...styles.icon }}
        onPress={() => deleteItem()}
      />
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
    width: "90%",
    margin: 5,
    padding: 10,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 9,
  },
  icon: {
    fontSize: 30,
    flex: 1,
    margin: 5,
  },
});
