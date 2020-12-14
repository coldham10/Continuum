/*Fullscreen summary of a historical day. The completion status of habits can be
 *retroactively toggled via the EditConfirmModal */

import React, {useState} from 'react';
import {
  StyleSheet,
  SectionList,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Platform,
  View,
  Text,
  FlatList,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import ViewPager from '@react-native-community/viewpager';
import * as Haptics from '../../utils/Haptics';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../utils/Constants';
import {displayPositiveMomentum} from '../../utils/Functions';
import EditConfirmModal from './EditConfirmModal';
import {StackActions} from '@react-navigation/native';

class DayModal extends React.Component {
  constructor(props) {
    super(props);
    this.windowWidth = Dimensions.get('window').width;
    this.state = {confirm: null};
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('Overview');
          }}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <ViewPager
            style={styles.carousel}
            initialPage={1}
            onPageSelected={(e) => {
              let newDate = new Date(
                this.props.day.year,
                this.props.day.month - 1,
                this.props.day.day - 1 + e.nativeEvent.position,
              );
              switch (e.nativeEvent.position) {
                case 0:
                case 2:
                  setTimeout(
                    () =>
                      this.props.navigation.dispatch(
                        StackActions.replace('DayModal', {
                          day: {
                            year: newDate.getFullYear(),
                            month: newDate.getMonth() + 1,
                            day: newDate.getDate(),
                            dateString:
                              '' +
                              newDate.getFullYear() +
                              '-' +
                              (newDate.getMonth() + 1) +
                              '-' +
                              newDate.getDate(),
                          },
                        }),
                      ),
                    150,
                  );
                  break;
              }
            }}>
            <View style={styles.page}>
              <View key="0" style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {this.props.day === null
                      ? ''
                      : 'Overview of ' +
                        new Date(
                          this.props.day.year,
                          this.props.day.month - 1,
                          this.props.day.day - 1,
                        ).toDateString()}
                  </Text>
                </View>
                <View style={styles.body} />
              </View>
            </View>
            <View style={styles.page}>
              <View style={styles.content} key="1">
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {this.props.day === null
                      ? ''
                      : 'Overview of ' +
                        new Date(
                          this.props.day.year,
                          this.props.day.month - 1,
                          this.props.day.day,
                        ).toDateString()}
                  </Text>
                </View>
                <View style={styles.body}>
                  <FlatList
                    data={this.props.data}
                    renderItem={({item}) => (
                      <ListItem
                        title={item.title}
                        completed={item.completed}
                        status={item.status}
                        day={this.props.day}
                        positive={item.positive}
                        edit={() =>
                          this.setState({
                            confirm: {
                              id: item.id,
                              dateString: this.props.day.dateString,
                              positive: item.positive,
                            },
                          })
                        }
                      />
                    )}
                    keyExtractor={(item) => 'id' + item.id}
                    ListHeaderComponent={
                      <View style={styles.listHdr}>
                        <View style={{flex: 2, alignItems: 'center'}}>
                          <Text style={{fontSize: 20, paddingRight: '10%'}}>
                            Title
                          </Text>
                        </View>
                        <View style={{flex: 1}} />
                        <View style={{flex: 2, alignItems: 'center'}}>
                          <Text adjustsFontSizeToFit style={{fontSize: 17}}>
                            Achieved/
                          </Text>
                          <Text adjustsFontSizeToFit style={{fontSize: 17}}>
                            Momentum
                          </Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <Text style={{fontSize: 17, paddingRight: 5}}>
                            Edit
                          </Text>
                        </View>
                      </View>
                    }
                    ListEmptyComponent={
                      <View style={styles.empty}>
                        <Text style={styles.emptyTxt}>
                          No habits available for this day
                        </Text>
                      </View>
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.page}>
              <View key="0" style={styles.content}>
                <View style={styles.header}>
                  <Text style={styles.title}>
                    {this.props.day === null
                      ? ''
                      : 'Overview of ' +
                        new Date(
                          this.props.day.year,
                          this.props.day.month - 1,
                          this.props.day.day + 1,
                        ).toDateString()}
                  </Text>
                </View>
                <View style={styles.body} />
              </View>
            </View>
          </ViewPager>
        </View>
        <EditConfirmModal
          visible={this.state.confirm !== null}
          close={() => this.setState({confirm: null})}
          data={this.state.confirm}
        />
      </>
    );
  }
}

function ListItem(props) {
  return (
    <View style={styles.li}>
      <Text style={styles.liTxt}>{props.title}</Text>
      {props.completed ? (
        <Ionicons
          name={
            props.positive
              ? 'md-checkmark-circle-outline'
              : 'md-close-circle-outline'
          }
          style={styles.checkBox}
        />
      ) : (
        <Icon name="circle-thin" style={styles.checkBox} />
      )}
      <Text style={styles.liPct}>{Math.round(100 * props.status)}%</Text>
      <View style={{flex: 3, backgroundColor: '#0000'}}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#aaa8"
          onPress={() => {
            Haptics.warn();
            props.edit();
          }}
          style={{
            flex: 1,
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 1,
            padding: 2,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#0000',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {props.completed ? (
              <Ionicons
                name={
                  props.positive
                    ? 'md-checkmark-circle-outline'
                    : 'md-close-circle-outline'
                }
                style={{flex: 1}}
                size={12}
              />
            ) : (
              <Icon name="circle-thin" style={{flex: 1}} size={12} />
            )}
            <Ionicons
              name="ios-arrow-round-forward"
              style={{flex: 1}}
              size={17}
            />
            {props.completed ? (
              <Icon name="circle-thin" style={{flex: 1}} size={12} />
            ) : (
              <Ionicons
                name={
                  props.positive
                    ? 'md-checkmark-circle-outline'
                    : 'md-close-circle-outline'
                }
                style={{flex: 1}}
                size={12}
              />
            )}
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const mapStateToProps = (state, ownProps) => {
  let now = new Date();
  let day = ownProps.route.params.day;
  let viewingDate = new Date(day.year, day.month - 1, day.day);
  let positiveData = state.positiveList
    .filter((pHabit) => {
      //Select habits that had been created by viewingDate
      let dateCreated = new Date(pHabit.timeStamp);
      return dateCreated <= viewingDate && viewingDate <= now;
    })
    .map((pHabit) => {
      let dateCreated = new Date(pHabit.timeStamp);
      let index = Math.round(
        (viewingDate - dateCreated) / (1000 * 60 * 60 * 24),
      );
      let val = pHabit.histValues[index];
      return {
        id: pHabit.id,
        title: pHabit.title,
        positive: true,
        status: displayPositiveMomentum(val, pHabit.parameters.max),
        completed: pHabit.activity[index],
      };
    });
  let negativeData = state.negativeList
    .filter((nHabit) => {
      //Select habits that had been created by viewingDate
      let dateCreated = new Date(nHabit.timeStamp);
      return dateCreated <= viewingDate && viewingDate <= now;
    })
    .map((nHabit) => {
      let dateCreated = new Date(nHabit.timeStamp);
      let index = Math.round(
        (viewingDate - dateCreated) / (1000 * 60 * 60 * 24),
      );
      let val = nHabit.histValues[index];
      return {
        id: nHabit.id,
        title: nHabit.title,
        positive: false,
        status: val,
        completed: nHabit.activity[index],
      };
    });
  return {data: positiveData.concat(negativeData), day};
};

export default connect(mapStateToProps, null)(DayModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 25,
    marginBottom: 25,
    borderRadius: 5,
    alignItems: 'center',
  },
  carousel: {
    height: '100%',
    width: '95%',
  },
  page: {},
  content: {
    alignItems: 'center',
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 6,
    borderTopWidth: 1,
    minWidth: '100%',
    borderRadius: 3,
    padding: 1,
    marginBottom: 5,
    borderColor: '#aaa',
  },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#aaa5',
    borderWidth: 1,
    borderColor: '#aaa9',
  },
  listHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
  },
  liTxt: {
    flex: 12,
    fontSize: 17,
  },
  liPct: {
    flex: 3,
    fontSize: 17,
  },
  checkBox: {
    flex: 3,
    fontSize: 20,
  },
  empty: {
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  emptyTxt: {
    fontSize: 17,
  },
  footer: {
    flex: 1,
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    padding: 15,
  },
  buttonText: {
    fontSize: 16.5,
    color: Colors.tint,
  },
});
