import * as React from 'react';
import {StyleSheet, TouchableHighlight, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import {connect} from 'react-redux';

import OverviewCalendar from '../components/overview/OverviewCalendar';
import OverviewModal from '../components/overview/OverviewModal';

class OverviewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  componentDidMount() {
    //Add help icon to top navigation pane
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{backgroundColor: '#0000'}}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#aaa8"
            style={{borderRadius: 10}}
            onPress={() => {
              this.props.navigation.navigate('OverviewHelp');
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
    return (
      <View style={styles.container}>
        <View style={styles.calendar}>
          <OverviewCalendar
            selectDay={(day) =>
              this.props.navigation.navigate('DayModal', {day: day})
            }
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.status}>
            <View style={styles.statusLine}>
              <Ionicons
                name="md-checkmark-circle-outline"
                style={{fontSize: 15}}
              />
              <Text style={styles.statusTxt}>
                {this.props.positiveData.every((item) => item.selected) &&
                this.props.positiveData.length > 0
                  ? 'All '
                  : ''}
                {this.props.positiveData.reduce(
                  (acc, item) => (acc = acc + (item.selected ? 1 : 0)),
                  0,
                ) || 'No'}{' '}
                positive habits displayed
              </Text>
            </View>
            <View style={styles.statusLine}>
              <Ionicons name="md-close-circle-outline" style={{fontSize: 15}} />
              <Text style={styles.statusTxt}>
                {this.props.negativeData.every((item) => item.selected) &&
                this.props.negativeData.length > 0
                  ? 'All '
                  : ''}
                {this.props.negativeData.reduce(
                  (acc, item) => (acc = acc + (item.selected ? 1 : 0)),
                  0,
                ) || 'No'}{' '}
                negative habits displayed
              </Text>
            </View>
          </View>
          <View style={styles.edit}>
            <Ionicons
              name="md-create"
              style={styles.icon}
              onPress={() => {
                this.setState({modalVisible: true});
              }}
            />
          </View>
        </View>
        <OverviewModal
          visible={this.state.modalVisible}
          close={() => this.setState({modalVisible: false})}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    positiveData: state.positiveList,
    negativeData: state.negativeList,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleSelected: (id) => dispatch({type: 'selection/toggle', payload: id}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  calendar: {
    minWidth: '100%',
    flex: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 3,
  },
  footer: {
    minWidth: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    flexDirection: 'row',
  },
  status: {
    flex: 4,
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 25,
    margin: 5,
  },
});
