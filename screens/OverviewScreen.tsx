import * as React from "react";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "../components/Themed";
import OverviewCalendar from "../components/OverviewCalendar";
import OverviewModal from "../components/OverviewModal";

export default class OverviewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveData: [],
      negativeData: [],
      modalVisible: false,
      dataByDate: {},
    };
  }

  componentDidMount() {
    //Load saved data for this list from local storage
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this._asyncRequest = AsyncStorage.getItem("positiveList").then(
        (jsonValue) => {
          this._asyncRequest = null;
          this.setState(
            {
              positiveData: jsonValue !== null ? JSON.parse(jsonValue) : [],
            },
            () => this.byDate()
          );
        }
      );
      this._asyncRequest = AsyncStorage.getItem("negativeList").then(
        (jsonValue) => {
          this._asyncRequest = null;
          this.setState(
            {
              negativeData: jsonValue !== null ? JSON.parse(jsonValue) : [],
            },
            () => this.byDate()
          );
        }
      );
      this.setState({ modalVisible: false });
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
            dataByDate={this.state.dataByDate}
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.status}>
            <View style={styles.statusLine}>
              <Ionicons
                name="md-checkmark-circle-outline"
                style={{ fontSize: 15 }}
              />
              <Text style={styles.statusTxt}>
                {this.state.positiveData.reduce(
                  (acc, item) => (acc = acc + (item.selected ? 1 : 0)),
                  0
                ) || "No"}{" "}
                positive habits selected
              </Text>
            </View>
            <View style={styles.statusLine}>
              <Ionicons
                name="md-close-circle-outline"
                style={{ fontSize: 15 }}
              />
              <Text style={styles.statusTxt}>
                {this.state.negativeData.reduce(
                  (acc, item) => (acc = acc + (item.selected ? 1 : 0)),
                  0
                ) || "No"}{" "}
                negative habits selected
              </Text>
            </View>
          </View>
          <View style={styles.edit}>
            <Ionicons
              name="md-create"
              style={styles.icon}
              onPress={() => this.setState({ modalVisible: true })}
            />
          </View>
        </View>
        <OverviewModal
          visible={this.state.modalVisible}
          close={() => this.setState({ modalVisible: false })}
          positiveData={this.state.positiveData}
          negativeData={this.state.negativeData}
          toggleSelected={(id) => this.toggleSelected(id)}
        />
      </View>
    );
  }

  toggleSelected(id) {
    let dataCopy;
    if (this.state.positiveData.filter((habit) => habit.id === id).length > 0) {
      //Positive
      dataCopy = this.state.positiveData.map((habit) => {
        let newHabit = { ...habit };
        if (habit.id === id) {
          newHabit.selected = !habit.selected;
        }
        return newHabit;
      });
      this.setState({ positiveData: dataCopy }, () => this.byDate());
      this.storeData("positiveList", dataCopy);
    } else {
      //Negative
      dataCopy = this.state.negativeData.map((habit) => {
        let newHabit = { ...habit };
        if (habit.id === id) {
          newHabit.selected = !habit.selected;
        }
        return newHabit;
      });
      this.setState({ negativeData: dataCopy }, () => this.byDate());
      this.storeData("negativeList", dataCopy);
    }
  }

  byDate() {
    let dataByDate = {};
    let dateString = (date) =>
      new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
    this.state.positiveData.forEach((pHabit) => {
      let date = new Date(pHabit.timeStamp);
      pHabit.histValues.forEach((val) => {
        if (typeof dataByDate[dateString(date)] === "undefined") {
          dataByDate[dateString(date)] = [];
        }
        dataByDate[dateString(date)].push({
          id: pHabit.id,
          status: Math.max(0, (val - 1) / (pHabit.parameters.max - 1)),
          data: pHabit,
        });
        date.setDate(date.getDate() + 1);
      });
    });
    this.state.negativeData.forEach((nHabit) => {
      let date = new Date(nHabit.timeStamp);
      nHabit.histValues.forEach((val) => {
        if (typeof dataByDate[dateString(date)] === "undefined") {
          dataByDate[dateString(date)] = [];
        }
        dataByDate[dateString(date)].push({
          id: nHabit.id,
          status: val,
          data: nHabit,
        });
        date.setDate(date.getDate() + 1);
      });
    });
    this.setState({ dataByDate: dataByDate });
  }

  async storeData(key, data) {
    //Local storage on device
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
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
