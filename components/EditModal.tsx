import React from "react";
import { StyleSheet, TouchableHighlight, TextInput } from "react-native";

import { Picker } from "@react-native-community/picker";

import { Text, View, Modal } from "../components/Themed";

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state =
      props.editing !== null
        ? {
            tempData: { ...this.props.data[this.props.editing] },
          }
        : { tempData: {} };
  }
  render() {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={this.props.editing !== null}
        onRequestClose={() => this.props.close()}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {"Habit: " + this.state.tempData.title}
            </Text>
            <View style={styles.body}>
              <View style={styles.inputPair}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  defaultValue={this.state.tempData.title}
                  onChangeText={(title) =>
                    this.setState((prevState) => ({
                      tempData: Object.assign({}, prevState.tempData, {
                        title: title,
                      }),
                    }))
                  }
                />
              </View>
              <View style={styles.inputPair}>
                <Text style={styles.label}>Habit Formation (Days)</Text>
                <Picker style={styles.input}>
                  <Picker.Item label="Java" value="java" />
                  <Picker.Item label="JavaScript" value="js" />
                </Picker>
              </View>
            </View>
            <View style={styles.footer}>
              <Text>placeholder</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalView: {
    marginLeft: "5%",
    marginTop: "5%",
    width: "90%",
    height: "90%",
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    margin: 20,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    flex: 1,
    padding: 10,
  },
  body: {
    flex: 6,
    padding: 5,
    justifyContent: "space-evenly",
  },
  inputPair: {
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: "90%",
  },
  label: {
    fontSize: 20,
    padding: 2,
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    padding: 2,
    borderRadius: 2,
    borderWidth: 1,
    minWidth: "90%",
  },
  footer: {
    flex: 1,
  },
});
