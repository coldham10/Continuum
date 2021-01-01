/*Full page modal (on navigation stack) that allows the details of one single
 *habit to be edited*/

import React from 'react';
import {
  StyleSheet,
  TextInput,
  Keyboard,
  Platform,
  TouchableOpacity,
  ActionSheetIOS,
  Text,
  View,
  ScrollView,
} from 'react-native';
import * as Haptics from '../../utils/Haptics';
import {Picker} from '@react-native-community/picker';
import {connect} from 'react-redux';
import {Colors} from '../../utils/Constants';
import {rToFormDays, raToLossDays} from '../../utils/Functions';

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardUp: false,
      title: props.title,
      parameters: props.parameters,
    };
  }

  componentDidMount() {
    Keyboard.addListener('keyboardDidShow', () =>
      this.setState({keyboardUp: true}),
    );
    Keyboard.addListener('keyboardDidHide', () =>
      this.setState({keyboardUp: false}),
    );

    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Haptics.impact();
            this.save();
          }}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.cancel();
          }}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      ),
    });
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }

  render() {
    return (
      <ScrollView
        style={{
          ...styles.modalView,
          marginBottom: this.state.keyboardUp && Platform.OS !== 'ios' ? 5 : 50,
        }}
        contentContainerstyle={{
          alignItems: 'center',
        }}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{'Editing: ' + this.state.title}</Text>
          <View style={styles.body}>
            <View style={styles.inputPair}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={this.state.title === 'New Habit' ? '' : this.state.title}
                onChangeText={(title) => this.setState({title: title})}
                clearButtonMode="always"
              />
            </View>
            <View style={styles.inputPair}>
              <Text style={styles.label}>Habit Formation Time</Text>
              <View style={styles.input}>
                {Platform.OS !== 'ios' ? (
                  <Picker
                    style={styles.picker}
                    selectedValue={
                      this.props.route.params.positive
                        ? rToFormDays(this.state.parameters.r) //Convert from r parameter to number of habit formation days
                        : this.state.parameters.k
                    }
                    onValueChange={(val) => {
                      this.setState((prevState) => {
                        return this.props.route.params.positive
                          ? {
                              parameters: this.daysToParams(
                                val,
                                raToLossDays(
                                  prevState.parameters.r,
                                  prevState.parameters.a,
                                ),
                              ),
                            }
                          : {parameters: {k: val}};
                      });
                    }}>
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
                            'Cancel',
                            '1 Day',
                            '2 Days',
                            '3 Days',
                            '4 Days',
                            '5 Days',
                            '6 Days',
                            '7 Days (Default)',
                            '8 Days',
                            '9 Days',
                            '10 Days',
                            '11 Days',
                            '12 Days',
                            '13 Days',
                            '14 Days',
                            '15 Days',
                          ],
                          cancelButtonIndex: 0,
                        },
                        (btnIdx) => {
                          if (btnIdx !== 0) {
                            this.setState((prevState) => {
                              return {
                                parameters: this.props.route.params.positive
                                  ? this.daysToParams(
                                      btnIdx,
                                      raToLossDays(
                                        prevState.parameters.r,
                                        prevState.parameters.a,
                                      ),
                                    )
                                  : {k: btnIdx},
                              };
                            });
                          }
                        },
                      )
                    }>
                    <Text style={styles.IOSpicker}>
                      {this.props.route.params.positive
                        ? rToFormDays(this.state.parameters.r) //Convert from r parameter to number of habit formation days
                        : this.state.parameters.k}{' '}
                      Days
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View>
                <Text style={styles.subtext}>
                  Number of days it will take to get into the habit
                </Text>
              </View>
            </View>
            {this.props.route.params.positive ? (
              <View style={styles.inputPair}>
                <Text style={styles.label}>Habit Loss Time</Text>
                <View style={styles.input}>
                  {Platform.OS !== 'ios' ? (
                    <Picker
                      style={styles.picker}
                      selectedValue={raToLossDays(
                        this.state.parameters.r,
                        this.state.parameters.a,
                      )}
                      onValueChange={(val) =>
                        this.setState((prevState) => {
                          return {
                            parameters: this.daysToParams(
                              rToFormDays(prevState.parameters.r),
                              val,
                            ),
                          };
                        })
                      }>
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
                              'Cancel',
                              '1 Day',
                              '2 Days',
                              '3 Days (Default)',
                              '4 Days',
                              '5 Days',
                              '6 Days',
                              '7 Days',
                              '8 Days',
                              '9 Days',
                              '10 Days',
                            ],
                            cancelButtonIndex: 0,
                          },
                          (btnIdx) => {
                            if (btnIdx !== 0) {
                              this.setState((prevState) => {
                                return {
                                  parameters: this.daysToParams(
                                    rToFormDays(this.state.parameters.r),
                                    btnIdx,
                                  ),
                                };
                              });
                            }
                          },
                        )
                      }>
                      <Text style={styles.IOSpicker}>
                        {raToLossDays(
                          this.state.parameters.r,
                          this.state.parameters.a,
                        )}{' '}
                        Days
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  <Text style={styles.subtext}>
                    Number of days it will take to get out of the habit
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    );
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
    return {r: r, a: a, max: max};
  }

  save() {
    this.props.storeData(this.state.title, this.state.parameters);
    this.navigateBack();
  }

  cancel() {
    if (this.props.route.params.new) {
      this.props.pop();
    }
    this.navigateBack();
  }

  navigateBack() {
    let lastPage = this.props.route.params.positive
      ? 'PositiveScreen'
      : 'NegativeScreen';
    this.props.navigation.navigate(lastPage);
  }
}

const mapStateToProps = (state, ownProps) => {
  let list = ownProps.route.params.positive
    ? state.positiveList
    : state.negativeList;
  let index;
  let id;
  if (ownProps.route.params.id !== -1) {
    index = list.findIndex((h) => h.id === ownProps.route.params.id);
    id = ownProps.route.params.id;
  } else {
    //If -1, edit last in list
    index = list.length - 1;
    id = index >= 0 ? list[index].id : undefined;
  }

  return index >= 0
    ? {title: list[index].title, parameters: list[index].parameters, id: id}
    : {
        title: '',
        parameters: {r: 0.7966, a: 0.4027, max: 1.9797, k: 7},
        id: id,
      };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let prefix = ownProps.route.params.positive ? 'positive/' : 'negative/';
  return {
    storeData: (title, params) =>
      dispatch({
        type: prefix + 'edit',
        payload: {id: ownProps.route.params.id, title: title, params: params},
      }),
    pop: () =>
      dispatch({
        type: prefix + 'remove',
        payload: ownProps.route.params.id,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditModal);

const styles = StyleSheet.create({
  modalView: {
    marginTop: 20,
  },
  modalContent: {
    margin: 22,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    flex: 1,
    padding: 10,
  },
  body: {
    marginTop: 10,
    flex: 6,
    padding: 5,
    justifyContent: 'space-evenly',
  },
  inputPair: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: '90%',
    marginTop: 5,
    marginBottom: 15,
  },
  label: {
    fontSize: 20,
    padding: 2,
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    padding: 2,
    marginBottom: 10,
    borderRadius: 2,
    borderWidth: 1,
    minWidth: '100%',
  },
  subtext: {
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 14,
    color: '#686868',
  },
  picker: {
    minWidth: '100%',
    fontSize: 15,
    height: 24,
  },
  IOSpicker: {
    minWidth: '100%',
    fontSize: 15,
    height: 24,
    marginLeft: 5,
  },
  button: {
    padding: 15,
  },
  buttonText: {
    fontSize: 16.5,
    color: Colors.tint,
  },
});
