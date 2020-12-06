/*The core of both positivelist and negativelist pages. Holds various Habit
 *objects and shows today's activity and progress for each.*/

import * as React from 'react';
import {
  StyleSheet,
  Button,
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

const threshold = 1;

class HabitList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toDelete: null};
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{backgroundColor: '#0000'}}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#aaa8"
            style={{borderRadius: 10}}
            onPress={() => {
              this.props.navigation.navigate('HabitHelp');
            }}>
            <Icon
              style={{margin: 5}}
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
      <Button
        title="Add New Habit"
        onPress={() => {
          Haptics.impact();
          this.props.addItem();
          this.props.navigation.navigate('EditModal', {
            positive: this.props.positive,
            id: -1,
            new: true,
          });
        }}
      />
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
          ListEmptyComponent={<Text>No habits added yet</Text>}
          ListFooterComponent={addBtn}
          ListFooterComponentStyle={styles.add}
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

const mapStateToProps = (state, ownProps) =>
  ownProps.positive ? {data: state.positiveList} : {data: state.negativeList};

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
  add: {
    margin: 20,
    borderRadius: 20,
  },
});
