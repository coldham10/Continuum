import * as React from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";
import OverviewCalendar from "../components/OverviewCalendar";

export default class OverviewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveData: [],
      negativeData: [],
      positiveSelected: [],
      negativeSelected: [],
    };
  }

  componentDidMount() {
    //Load saved data for this list from local storage
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      console.log("focused overview");
      this._asyncRequest = AsyncStorage.getItem("positiveList").then(
        (jsonValue) => {
          this._asyncRequest = null;
          this.setState({
            positiveData: jsonValue !== null ? JSON.parse(jsonValue) : [],
          });
        }
      );
      this._asyncRequest = AsyncStorage.getItem("negativeList").then(
        (jsonValue) => {
          this._asyncRequest = null;
          this.setState({
            negativeData: jsonValue !== null ? JSON.parse(jsonValue) : [],
          });
        }
      );
    });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
    this._unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.calendar}>
          <OverviewCalendar
            minDate={this.getMinDate()}
            maxDate={this.getMaxDate()}
            positiveData={this.state.positiveData}
            negativeData={this.state.negativeData}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.status}>
            <View style={styles.statusLine}>
              <Ionicons
                name="md-checkmark-circle-outline"
                style={{ fontSize: 15 }}
              />
              <Text style={styles.statusTxt}>x positive habits selected</Text>
            </View>
            <View style={styles.statusLine}>
              <Ionicons
                name="md-close-circle-outline"
                style={{ fontSize: 15 }}
              />
              <Text style={styles.statusTxt}>y negative habits selected</Text>
            </View>
          </View>
          <View style={styles.edit}>
            <Ionicons
              name="md-create"
              style={styles.icon}
              onPress={() => console.log("m")}
            />
          </View>
        </View>
      </View>
    );
  }

  getMinDate() {
    let minNeg =
      this.state.negativeData.length > 0
        ? Math.min(...this.state.negativeData.map((item) => item.timeStamp))
        : new Date().getTime();
    let minPos =
      this.state.positiveData.length > 0
        ? Math.min(...this.state.positiveData.map((item) => item.timeStamp))
        : new Date().getTime();
    let returnDate = new Date(Math.min(minNeg, minPos));
    returnDate.setDate(1);
    return returnDate;
  }

  getMaxDate() {
    let d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  calendar: {
    minWidth: "100%",
    flex: 4,
    borderBottomWidth: 1,
    borderColor: "#eee",
    marginBottom: 3,
  },
  footer: {
    minWidth: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    flexDirection: "row",
  },
  status: {
    flex: 4,
    alignItems: "flex-start",
    marginLeft: 5,
  },
  statusLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  statusTxt: {
    fontSize: 15,
    marginLeft: 10,
  },
  edit: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 25,
    margin: 5,
  },
});
