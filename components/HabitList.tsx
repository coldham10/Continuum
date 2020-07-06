import * as React from "react";
import { StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { Text, View, FlatList } from "../components/Themed";
import Habit from "./Habit";

export default class HabitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentDidMount() {
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
      <Button title="Add" onPress={() => this.addItem("New Habit", 0.9)} />
    );
    return (
      <FlatList
        data={this.state.data}
        style={styles.scroll}
        contentContainerStyle={styles.container}
        renderItem={({ item, index }) => (
          <Habit
            title={item.title}
            fulfilled={item.fulfilled}
            deleteItem={this.deleteItem.bind(this, index)}
          />
        )}
        keyExtractor={(item) => "id" + item.id}
        ListEmptyComponent={<Text>Hello, add plz</Text>}
        ListFooterComponent={addBtn}
        ListFooterComponentStyle={styles.add}
      />
    );
  }

  addItem(title, fulfilled) {
    let dataCopy = [...this.state.data];
    dataCopy.push({
      id: dataCopy.length,
      title: title,
      fulfilled: fulfilled,
    });
    this.setState({ data: dataCopy });
    this.storeData(dataCopy);
  }

  deleteItem(idx) {
    console.log(idx);
    this.storeData([]);
  }

  async storeData(data) {
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
  },
});
