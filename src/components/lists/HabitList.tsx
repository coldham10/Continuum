/*The core of both positivelist and negativelist pages. Holds various Habit
 *objects and shows today's activity and progress for each.*/

import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
  FlatList,
} from 'react-native';

import {connect} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as Haptics from '../../utils/Haptics';

import Habit from './Habit';
import DeleteConfirmModal from './DeleteConfirmModal';
import {Colors, maxFreeHabits} from '../../utils/Constants';

const threshold = 1;

class HabitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toDelete: null};
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{backgroundColor: '#0000', flexDirection: 'row'}}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#aaa8"
            style={{borderRadius: 10}}
            onPress={() => {
              this.props.navigation.navigate('SettingsScreen');
            }}>
            <Ionicons
              style={{margin: 5, marginRight: 10}}
              name="md-settings"
              size={24}
              color="black"
            />
          </TouchableHighlight>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#aaa8"
            style={{borderRadius: 10}}
            onPress={() => {
              this.props.navigation.navigate('HabitHelp');
            }}>
            <Icon
              style={{margin: 5, marginRight: 10}}
              name="question-circle-o"
              size={24}
              color="black"
            />
          </TouchableHighlight>
        </View>
      ),
    });
  }

  render() {
    var addBtn = (
      <TouchableOpacity
        style={styles.add}
        activeOpacity={0.8}
        onPress={() => {
          Haptics.impact();
          if (!this.props.premium && this.props.data.length >= maxFreeHabits) {
            this.props.navigation.navigate('GetPremium', {
              reason: 'Adding more than ' + maxFreeHabits + ' habits',
            });
          } else {
            this.props.addItem();
            this.props.navigation.navigate('EditModal', {
              positive: this.props.positive,
              id: -1,
              new: true,
            });
          }
        }}>
        <Ionicons name="ios-add" color={'black'} size={45} />
      </TouchableOpacity>
    );
    return (
      <>
        <FlatList
          data={this.props.data}
          style={styles.scroll}
          contentContainerStyle={styles.container}
          renderItem={({item, index}) => {
            return (
              <Habit
                positive={this.props.positive}
                getStreak={this.getStreak.bind(this, index)}
                status={
                  this.props.positive
                    ? this.positiveStatus(
                        item.histValues[item.histValues.length - 1],
                        item.parameters.max,
                        threshold,
                      )
                    : 1 -
                      Math.exp((-1 * this.getStreak(index)) / item.parameters.k)
                }
                openEditor={() =>
                  this.props.navigation.navigate('EditModal', {
                    positive: this.props.positive,
                    id: item.id,
                    new: false,
                  })
                }
                deleteItem={this.setState.bind(this, {toDelete: item.id})}
                {...item}
              />
            );
          }}
          keyExtractor={(item) => 'id' + item.id}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{fontSize: 15}}>No habits added yet</Text>
            </View>
          }
          ListFooterComponent={addBtn}
          ListFooterComponentStyle={styles.footer}
        />
        <DeleteConfirmModal
          visible={this.state.toDelete !== null}
          id={this.state.toDelete}
          positive={this.props.positive}
          close={() => this.setState({toDelete: null})}
        />
      </>
    );
  }

  getStreak(idx) {
    let activity = [...this.props.data[idx].activity];
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

  positiveStatus(lastVal, max, thresh) {
    //Calculate status/momentum for a positive habits
    return (
      0.1 * Math.min(1, lastVal / thresh) + //up to 10% until hit threshold
      0.9 * Math.max(0, (lastVal - thresh) / (max - thresh))
    ); //90% of status is fraction of way between threshold and max value (= steady state)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    premium: state.settings.premium,
    data: ownProps.positive ? state.positiveList : state.negativeList,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let prefix = ownProps.positive ? 'positive/' : 'negative/';
  return {
    addItem: () => dispatch({type: prefix + 'add'}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HabitList);

const styles = StyleSheet.create({
  scroll: {
    minWidth: '100%',
    paddingTop: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    margin: 80,
    marginBottom: 90,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: Colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    margin: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#eee6',
  },
});
