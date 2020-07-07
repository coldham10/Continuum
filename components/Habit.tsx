import * as React from "react";
import { StyleSheet, TouchableHighlight } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";

export default class Habit extends React.Component {
  constructor(props) {
    super(props);
    this.refresh();
    console.log(props.status);
  }

  render() {
    return (
      <View style={{ ...statusColors(this.props.status), ...styles.habit }}>
        {this.props.activity[this.props.activity.length - 1] ? (
          <Ionicons
            name="md-checkmark-circle-outline"
            style={{ ...statusColors(this.props.status), ...styles.checkbox }}
            onPress={() => this.toggleTodayActivity()}
          />
        ) : (
          <FontAwesome
            name="circle-thin"
            style={{
              ...statusColors(this.props.status),
              ...styles.checkbox,
              fontSize: 28,
            }}
            onPress={() => this.toggleTodayActivity()}
          />
        )}
        <TouchableHighlight
          activeOpacity={0.99}
          style={styles.highlight}
          onPress={() => this.toggleTodayActivity()}
        >
          <Text style={{ ...statusColors(this.props.status), ...styles.title }}>
            {this.props.title}
          </Text>
        </TouchableHighlight>
        <Ionicons
          name="md-create"
          style={{ ...statusColors(this.props.status), ...styles.icon }}
          onPress={() => console.log(this.props)}
        />
        <Ionicons
          name="ios-trash"
          style={{ ...statusColors(this.props.status), ...styles.icon }}
          onPress={() => this.props.deleteItem()}
        />
      </View>
    );
  }

  toggleTodayActivity() {
    let newActivity = [...this.props.activity];
    newActivity[newActivity.length - 1] =
      this.props.activity[this.props.activity.length - 1] ^ 1; //bitwise xor toggles between 0 and 1
    let newHist = this.rewriteHistory([...newActivity], this.props.parameters);
    this.props.updateItem({ activity: newActivity, histValues: newHist });
  }

  refresh() {
    //Checks activity is up to date, extend activity and historical function as necessary
    let daysOld = Math.floor(
      (new Date() - this.props.timeStamp) / (1000 * 60 * 60 * 24) //Full days since morning of creation
    );
    if (daysOld + 1 > this.props.activity.length) {
      let newActivity = [...this.props.activity];
      while (newActivity.length < daysOld + 1) {
        newActivity.push(0); //Assume hasnt been done
      }
      this.props.updateItem({ activity: newActivity });
    }
    if (daysOld + 1 > this.props.histValues.length) {
      let newHist = this.rewriteHistory(
        [...this.props.activity],
        this.props.parameters
      );
      this.props.updateItem({ histValues: newHist });
    }
  }

  rewriteHistory(activity, params) {
    let newHistory = [];
    for (let i = 0; i < activity.length; i++) {
      let lastVal = i > 0 ? newHistory[i - 1] : 0;
      newHistory.push(lastVal * params.r + activity[i] * params.a); //Habit function. Each day is last day * r (<1), then optionally adding a if activity performed
    }
    return newHistory;
  }
}

function statusColors(status) {
  //status is based on the habit function, with a maximum value of 1, minimum value less than 0
  //status = (currentValue - threshold)/(maxValue - threshold)
  //A negative status therefore indicates slipping below the threshold
  if (status > 0) {
    return {
      backgroundColor:
        "rgb(" +
        Math.max(0, Math.round(255 * (1 - 2 * status))) +
        "," +
        Math.round(55 + (1 - status) * 200) +
        "," +
        Math.round(200 + 55 * (1 - status)) +
        ")",
      color:
        "rgb(" +
        Math.round(200 * (1 - status) + (status < 0.6 ? -70 : 160)) +
        "," +
        Math.round(200 * (1 - status) + (status < 0.6 ? -70 : 160)) +
        "," +
        Math.round(200 * (1 - status) + (status < 0.6 ? -70 : 160)) +
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
  highlight: {
    flex: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  icon: {
    fontSize: 30,
    flex: 1,
    margin: 5,
  },
  checkbox: { fontSize: 30, flex: 1, margin: 5, paddingRight: 3 },
});
