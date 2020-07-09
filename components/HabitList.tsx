import * as React from "react";
import { StyleSheet, Button, TouchableHighlight } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import { FontAwesome } from "@expo/vector-icons";

import { Text, View, FlatList } from "../components/Themed";
import Habit from "./Habit";
import EditModal from "./EditModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import HabitHelpModal from "./HabitHelpModal";

const threshold = 1;

export default class HabitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], editing: null, toDelete: null, help: false };
  }

  componentDidMount() {
    //Load saved data for this list from local storage every time focused upon
    this._unsubscribe = this.props.navigation.addListener("focus", () => {
      this._asyncRequest = AsyncStorage.getItem(this.props.dataKey).then(
        (jsonValue) => {
          this._asyncRequest = null;
          this.setState({
            data: jsonValue !== null ? JSON.parse(jsonValue) : [],
          });
        }
      );
    });
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ backgroundColor: "#0000" }}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#aaa8"
            style={{ borderRadius: 10 }}
            onPress={() => this.setState({ help: true })}
          >
            <FontAwesome
              style={{ margin: 5 }}
              name="question-circle-o"
              size={24}
              color="black"
            />
          </TouchableHighlight>
        </View>
      ),
    });
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    var addBtn = (
      <Button title="Add New Habit" onPress={() => this.addItem("New Habit")} />
    );
    return (
      <>
        <FlatList
          data={this.state.data}
          style={styles.scroll}
          contentContainerStyle={styles.container}
          renderItem={({ item, index }) => {
            return (
              <Habit
                positive={this.props.positive}
                deleteItem={this.setState.bind(this, { toDelete: index })}
                updateItem={this.updateItem.bind(this, index)}
                getStreak={this.getStreak.bind(this, index)}
                status={
                  this.props.positive
                    ? (item.histValues[item.histValues.length - 1] -
                        threshold) /
                      (item.parameters.max - threshold) //status is fraction of way between threshold and max value (= steady state)
                    : 1 -
                      Math.exp((-1 * this.getStreak(index)) / item.parameters.k)
                }
                openEditor={() => this.setState({ editing: index })}
                {...item}
              />
            );
          }}
          keyExtractor={(item) => "id" + item.id}
          ListEmptyComponent={<Text>No habits added yet</Text>}
          ListFooterComponent={addBtn}
          ListFooterComponentStyle={styles.add}
        />
        <EditModal
          positive={this.props.positive}
          editing={this.state.editing}
          data={this.state.data}
          close={() => this.setState({ editing: null })}
          updateItem={(idx, data) => this.updateItem(idx, data)}
        />
        <DeleteConfirmModal
          visible={this.state.toDelete !== null}
          confirm={() => this.deleteItem(this.state.toDelete)}
          close={() => this.setState({ toDelete: null })}
        />
        <HabitHelpModal
          visible={this.state.help}
          close={() => this.setState({ help: false })}
        />
      </>
    );
  }

  addItem(title) {
    this.setState((prevState) => {
      let dataCopy = [...prevState.data];
      let rightNow = new Date();
      let today = new Date(
        rightNow.getFullYear(),
        rightNow.getMonth(),
        rightNow.getDate()
      ); //Set to 00:00 of day created so that new days clock over at midnight
      dataCopy.push({
        positive: this.props.positive,
        id: Date.now() % 1000000, //Random enough, only to keep FlatList happy
        title: title,
        timeStamp: today.getTime(),
        parameters: this.props.positive
          ? { r: 0.7966, a: 0.4027, max: 1.9797 } //For geometric habit function (+ve)
          : { k: 7 }, //For exponential momentum function (-ve)
        histValues: [], //habit-function vales at end of day every day since timeStamp
        activity: [0], //Binary array since timeStamp day, 0="not done", 1="done"
        selected: false, //Is selected in overview pane?
      });
      this.storeData(dataCopy);
      return { data: dataCopy, editing: prevState.data.length };
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  getStreak(idx) {
    let activity = [...this.state.data[idx].activity];
    let streak = 0;
    while (activity.length > 0) {
      if (activity.pop() === 1) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
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
