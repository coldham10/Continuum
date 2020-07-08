import React from "react";
import { StyleSheet } from "react-native";
import { CalendarList } from "react-native-calendars";
import AsyncStorage from "@react-native-community/async-storage";

export default class OverviewCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { positiveData: [], negativeData: [] };
  }

  componentDidMount() {
    //Load saved data for this list from local storage
    // TODO: how to know when dirty?
    this._asyncRequest = AsyncStorage.getItem(this.props.positiveDataKey).then(
      (jsonValue) => {
        this._asyncRequest = null;
        this.setState({
          positiveData: jsonValue !== null ? JSON.parse(jsonValue) : [],
        });
      }
    );
    this._asyncRequest = AsyncStorage.getItem(this.props.negativeDataKey).then(
      (jsonValue) => {
        this._asyncRequest = null;
        this.setState({
          negativeData: jsonValue !== null ? JSON.parse(jsonValue) : [],
        });
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    return (
      <CalendarList
        minDate={this.getMinDate()}
        maxDate={new Date(2021, 6, 18)}
        horizontal={true}
        pagingEnabled={true}
        firstDay={1}
      />
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
}
