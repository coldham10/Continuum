import * as React from "react";
import { StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { Text, View, FlatList } from "../components/Themed";
import Habit from "./Habit";
import EditModal from "./EditModal";

const threshold = 1;

export default class HabitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editing: null };
  }

  componentDidMount() {
    //Load saved data for this list from local storage
    this._asyncRequest = AsyncStorage.getItem(this.props.dataKey).then(
      (jsonValue) => {
        this._asyncRequest = null;
        this.setState({
          data: jsonValue !== null ? JSON.parse(jsonValue) : [],
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
    var addBtn = (
      <Button
        title="Add New Habit"
        onPress={() => this.addItem("New Habit", 1)}
      />
    );
    return (
      <>
        <FlatList
          data={this.state.data}
          style={styles.scroll}
          contentContainerStyle={styles.container}
          renderItem={({ item, index }) => (
            <Habit
              deleteItem={this.deleteItem.bind(this, index)}
              updateItem={this.updateItem.bind(this, index)}
              {...item}
              status={
                (item.histValues[item.histValues.length - 1] - threshold) /
                (item.parameters.max - threshold)
              } //status is fraction of way between threshold and max value (= steady state)
            />
          )}
          keyExtractor={(item) => "id" + item.id}
          ListEmptyComponent={<Text>No habits added yet</Text>}
          ListFooterComponent={addBtn}
          ListFooterComponentStyle={styles.add}
        />
        <EditModal
          editing={this.state.editing}
          data={this.state.data}
          close={() => this.setState({ editing: null })}
          updateItem={(idx, data) => this.updateItem(idx, data)}
        />
      </>
    );
  }

  addItem(title, fulfilled) {
    this.setState((prevState) => {
      let dataCopy = [...prevState.data];
      let rightNow = new Date();
      let today = new Date(
        rightNow.getFullYear(),
        rightNow.getMonth(),
        rightNow.getDate()
      ); //Set to 00:00 of day created so that new days clock over at midnight
      dataCopy.push({
        id: dataCopy.length,
        title: title,
        timeStamp: today.getTime(),
        parameters: { r: 0.5, a: 2, max: 4 }, //For geometric habit function
        histValues: [], //habit-function vales at end of day every day since timeStamp
        activity: [0], //Binary array since timeStamp day, 0="not done", 1="done"
      });
      this.storeData(dataCopy);
      return { data: dataCopy, editing: prevState.data.length };
    });
  }

  updateItem(idx, data) {
    //update habit idx by overwiting key-value pairs in 'data'
    this.setState((prevState) => {
      let dataCopy = [...prevState.data];
      dataCopy[idx] = Object.assign({}, prevState.data[idx], data);
      this.storeData(dataCopy);
      return { data: dataCopy };
    });
  }

  deleteItem(idx) {
    this.setState((prevState) => {
      let dataCopy = prevState.data.filter((a, i) => i !== idx); //Remove element to delete
      this.storeData(dataCopy);
      return { data: dataCopy };
    });
  }

  async storeData(data) {
    //Local storage on device
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(this.props.dataKey, jsonValue);
    } catch (e) {
      console.log(e);
    }
  }
}

const styles = StyleSheet.create({
  scroll: {
    minWidth: "100%",
    paddingTop: 10,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    margin: 20,
    borderRadius: 20,
  },
});
