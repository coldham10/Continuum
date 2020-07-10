import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { Text, View } from "../components/Themed";

export default class Habit extends React.Component {
  constructor(props) {
    super(props);
    this.refresh();
  }

  render() {
    return (
      <TouchableOpacity
        style={{ ...statusColors(this.props.status), ...styles.habitHL }}
        activeOpacity={0.9}
        onPress={() => this.toggleTodayActivity()}
      >
        <View style={{ ...statusColors(this.props.status), ...styles.habit }}>
          <View
            style={{ ...statusColors(this.props.status), ...styles.topRow }}
          >
            {this.props.activity[this.props.activity.length - 1] ? (
              <Ionicons
                name={
                  this.props.positive
                    ? "md-checkmark-circle-outline"
                    : "md-close-circle-outline"
                }
                style={{
                  ...statusColors(this.props.status),
                  ...styles.checkbox,
                }}
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
            <View style={styles.highlight}>
              <Text
                style={{ ...statusColors(this.props.status), ...styles.title }}
              >
                {this.props.title}
              </Text>
            </View>
            <Ionicons
              name="md-create"
              style={{ ...statusColors(this.props.status), ...styles.icon }}
              onPress={() => {
                this.props.openEditor();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <Ionicons
              name="ios-trash"
              style={{ ...statusColors(this.props.status), ...styles.icon }}
              onPress={() => {
                this.props.deleteItem();
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning
                );
              }}
            />
          </View>

          <View
            style={{
              ...statusColors(this.props.status),
              ...styles.bottomRow,
            }}
          >
            <Text
              style={{
                ...statusColors(this.props.status),
                ...styles.subText,
              }}
            >
              {"Momentum: " +
                Math.max(0, Math.round(100 * this.props.status)) +
                "%"}
            </Text>
            <Text
              style={{
                ...statusColors(this.props.status),
                ...styles.subText,
              }}
            >
              {"Streak: " + this.props.getStreak() + " days"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  toggleTodayActivity() {
    let newActivity = [...this.props.activity];
    newActivity[newActivity.length - 1] =
      this.props.activity[this.props.activity.length - 1] ^ 1; //bitwise xor toggles between 0 and 1
    let newHist = this.rewriteHistory([...newActivity], this.props.parameters);
    this.props.updateItem({ activity: newActivity, histValues: newHist });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  refresh() {
    let timemachine = 0; //XXX

    //Checks activity is up to date, extend activity and historical function as necessary
    let daysOld =
      Math.floor(
        (new Date() - this.props.timeStamp) / (1000 * 60 * 60 * 24) //Full days since morning of creation
      ) + timemachine;
    let newActivity = [...this.props.activity];
    let newHist = [...this.props.histValues];
    if (daysOld + 1 > this.props.activity.length) {
      while (newActivity.length < daysOld + 1) {
        newActivity.push(0); //Assume hasnt been done
      }
    }
    if (daysOld + 1 > this.props.histValues.length) {
      newHist = this.rewriteHistory(newActivity, this.props.parameters);
    }
    this.props.updateItem({ activity: newActivity, histValues: newHist });
  }

  rewriteHistory(activity, params) {
    let newHistory = [];
    if (this.props.positive) {
      for (let i = 0; i < activity.length; i++) {
        let lastVal = i > 0 ? newHistory[i - 1] : 0;
        newHistory.push(lastVal * params.r + activity[i] * params.a); //Habit function. Each day is last day * r (<1), then optionally adding a if activity performed
      }
    } else {
      let streak = 0;
      for (let i = 0; i < activity.length; i++) {
        streak = activity[i] ? streak + 1 : 0;
        newHistory.push(1 - Math.exp((-1 * streak) / params.k)); //Asymtotically approaches 1
      }
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
  habitHL: {
    height: 80,
    width: "90%",
    margin: 10,
    borderRadius: 5,
  },
  habit: {
    flex: 1,
    width: "100%",
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#0000",
  },
  topRow: {
    width: "100%",
    padding: 3,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 2,
    flexDirection: "row",
  },
  bottomHL: {
    flex: 1,
    width: "100%",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
    width: "100%",
    padding: 3,
  },
  highlight: {
    flex: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subText: {
    fontSize: 14,
  },
  icon: {
    fontSize: 30,
    flex: 1,
    padding: 5,
    paddingLeft: 10,
  },
  checkbox: {
    fontSize: 30,
    flex: 1,
    margin: 5,
    paddingRight: 3,
  },
});
