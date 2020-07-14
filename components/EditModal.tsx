import React from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  Platform,
  TouchableOpacity,
  ActionSheetIOS,
} from "react-native";
import * as Haptics from "expo-haptics";

import { Picker } from "@react-native-community/picker";

import { Text, View, ScrollView } from "../components/Themed";
import Modal from "react-native-modal";

export default class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (this.props.editing !== prevProps.editing) {
      //reset state if editing different habit
      this.clearState();
    }
  }

  render() {
    if (this.props.editing === null) {
      return null;
    } else {
      let definedState = {};
      Object.keys(this.state)
        .filter((key) => this.state[key] !== undefined) //remove undefined state values left over from clearState
        .forEach((key) => (definedState[key] = this.state[key])); //Assign those values to a new object to merge back
      let mergedData = Object.assign(
        //Merge active changes into props data so always using up to date
        {},
        this.props.data[this.props.editing],
        definedState
      );
      return (
        <Modal
          isVisible={this.props.editing !== null}
          onBackButtonPress={() => this.props.close()}
          useNativeDriver={true}
          animationInTiming={500}
          animationOutTiming={500}
        >
          <ScrollView
            style={styles.modalView}
            contentContainerstyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.modalContent}>
              <Text style={styles.title}>{"Habit: " + mergedData.title}</Text>
              <View style={styles.body}>
                <View style={styles.inputPair}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={
                      mergedData.title === "New Habit" ? "" : mergedData.title
                    }
                    onChangeText={(title) => this.setState({ title: title })}
                    clearButtonMode="always"
                  />
                </View>
                <View style={styles.inputPair}>
                  <Text style={styles.label}>Habit Formation Time</Text>
                  <View style={styles.input}>
                    {Platform.OS !== "ios" ? (
                      <Picker
                        style={styles.picker}
                        selectedValue={
                          this.props.positive
                            ? this.rToFormDays(mergedData.parameters.r) //Convert from r parameter to number of habit formation days
                            : mergedData.parameters.k
                        }
                        onValueChange={(val) => {
                          this.setState({
                            parameters: this.props.positive
                              ? this.daysToParams(
                                  val,
                                  this.raToLossDays(
                                    mergedData.parameters.r,
                                    mergedData.parameters.a
                                  )
                                )
                              : { k: val },
                          });
                        }}
                      >
                        <Picker.Item label="1 Day" value={1} />
                        <Picker.Item label="2 Days" value={2} />
                        <Picker.Item label="3 Days" value={3} />
                        <Picker.Item label="4 Days" value={4} />
                        <Picker.Item label="5 Days" value={5} />
                        <Picker.Item label="6 Days" value={6} />
                        <Picker.Item label="7 Days (Default)" value={7} />
                        <Picker.Item label="8 Days" value={8} />
                        <Picker.Item label="9 Days" value={9} />
                        <Picker.Item label="10 Days" value={10} />
                        <Picker.Item label="11 Days" value={11} />
                        <Picker.Item label="12 Days" value={12} />
                        <Picker.Item label="13 Days" value={13} />
                        <Picker.Item label="14 Days" value={14} />
                        <Picker.Item label="15 Days" value={15} />
                      </Picker>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          ActionSheetIOS.showActionSheetWithOptions(
                            {
                              options: [
                                "Cancel",
                                "1 Day",
                                "2 Days",
                                "3 Days",
                                "4 Days",
                                "5 Days",
                                "6 Days",
                                "7 Days (Default)",
                                "8 Days",
                                "9 Days",
                                "10 Days",
                                "11 Days",
                                "12 Days",
                                "13 Days",
                                "14 Days",
                                "15 Days",
                              ],
                              cancelButtonIndex: 0,
                            },
                            (btnIdx) => {
                              if (btnIdx !== 0) {
                                this.setState({
                                  parameters: this.props.positive
                                    ? this.daysToParams(
                                        btnIdx,
                                        this.raToLossDays(
                                          mergedData.parameters.r,
                                          mergedData.parameters.a
                                        )
                                      )
                                    : { k: btnIdx },
                                });
                              }
                            }
                          )
                        }
                      >
                        <Text style={styles.IOSpicker}>
                          {this.props.positive
                            ? this.rToFormDays(mergedData.parameters.r) //Convert from r parameter to number of habit formation days
                            : mergedData.parameters.k}{" "}
                          Days
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                {this.props.positive ? (
                  <View style={styles.inputPair}>
                    <Text style={styles.label}>Habit Loss Time</Text>
                    <View style={styles.input}>
                      {Platform.OS !== "ios" ? (
                        <Picker
                          style={styles.picker}
                          selectedValue={this.raToLossDays(
                            mergedData.parameters.r,
                            mergedData.parameters.a
                          )}
                          onValueChange={(val) =>
                            this.setState({
                              parameters: this.daysToParams(
                                this.rToFormDays(mergedData.parameters.r),
                                val
                              ),
                            })
                          }
                        >
                          <Picker.Item label="1 Day" value={1} />
                          <Picker.Item label="2 Days" value={2} />
                          <Picker.Item label="3 Days (Default)" value={3} />
                          <Picker.Item label="4 Days" value={4} />
                          <Picker.Item label="5 Days" value={5} />
                          <Picker.Item label="6 Days" value={6} />
                          <Picker.Item label="7 Days" value={7} />
                          <Picker.Item label="8 Days" value={8} />
                          <Picker.Item label="9 Days" value={9} />
                          <Picker.Item label="10 Days" value={10} />
                        </Picker>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            ActionSheetIOS.showActionSheetWithOptions(
                              {
                                options: [
                                  "Cancel",
                                  "1 Day",
                                  "2 Days",
                                  "3 Days (Default)",
                                  "4 Days",
                                  "5 Days",
                                  "6 Days",
                                  "7 Days",
                                  "8 Days",
                                  "9 Days",
                                  "10 Days",
                                ],
                                cancelButtonIndex: 0,
                              },
                              (btnIdx) => {
                                if (btnIdx !== 0) {
                                  this.setState({
                                    parameters: this.daysToParams(
                                      this.rToFormDays(mergedData.parameters.r),
                                      btnIdx
                                    ),
                                  });
                                }
                              }
                            )
                          }
                        >
                          <Text style={styles.IOSpicker}>
                            {this.raToLossDays(
                              mergedData.parameters.r,
                              mergedData.parameters.a
                            )}{" "}
                            Days
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ) : null}
              </View>
              <View style={styles.footer}>
                <View style={styles.footerButton}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      this.clearState();
                      this.props.close();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  />
                </View>
                <View style={styles.footerButton}>
                  <Button
                    title="Save"
                    onPress={() => {
                      this.submitChanges();
                      this.props.close();
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Modal>
      );
    }
  }

  rToFormDays(r) {
    //From r value of geometric function to number of habit formation days
    return Math.round(Math.log(1 - r) / Math.log(r));
  }

  raToLossDays(r, a) {
    //Convert r & a values from habit function to Loss/dropoff days
    let fd = this.rToFormDays(r);
    let z = Math.log(a) / Math.log(r);
    return Math.round(fd - z);
  }

  //Convert from formation days and loss days to r, a and max parameter object
  daysToParams(formDays, lossDays) {
    //From number of habit formation days to r value of geometric function
    let r = [
      null,
      0.5,
      0.6181,
      0.6824,
      0.7245,
      0.7549,
      0.7781,
      0.7966,
      0.8117,
      0.8244,
      0.8351,
      0.8444,
      0.8526,
      0.8598,
      0.8662,
      0.872,
    ][formDays];

    let z = formDays - lossDays;
    let a = Math.pow(r, z);
    let max = a / (1 - r);
    return { r: r, a: a, max: max };
  }

  submitChanges() {
    let toPush = {};
    Object.keys(this.state)
      .filter((key) => this.state[key] !== undefined) //remove undefined state values left over from clearState
      .forEach((key) => (toPush[key] = this.state[key])); //Assign those values to a the new object
    if (this.state.parameters !== undefined) {
      //Parameters have been changed, ensure max value is correct
      let newParams = { ...this.state.parameters };
      newParams.max = newParams.a / (1 - newParams.r);
      toPush.parameters = newParams;
    }
    this.props.updateItem(this.props.editing, toPush);
    this.clearState();
  }

  clearState() {
    this.setState({ title: undefined, parameters: undefined });
  }
}

const styles = StyleSheet.create({
  modalView: {
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 5,
    borderWidth: 1,
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
    marginTop: 3,
    marginBottom: 10,
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
    minWidth: "100%",
  },
  picker: {
    minWidth: "100%",
    fontSize: 15,
    height: 24,
  },
  IOSpicker: {
    minWidth: "100%",
    fontSize: 15,
    height: 24,
    marginLeft: 5,
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  footerButton: {
    flex: 1,
    padding: 10,
  },
});
