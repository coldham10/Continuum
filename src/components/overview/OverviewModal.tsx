/*Small modal for selecting which habits to include in the OverviewScreen
 *heatmap calendar. Individual habits can be toggled, as well as all positive
 *and all negative */

import React from 'react';
import {
  StyleSheet,
  SectionList,
  TouchableHighlight,
  View,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

function OverviewModal(props) {
  return (
    <Modal
      isVisible={props.visible}
      onBackButtonPress={() => props.close()}
      backdropOpacity={0.5}
      hasBackdrop={true}
      swipeDirection="down"
      swipeThreshold={100}
      onSwipeComplete={() => props.close()}
      onBackdropPress={() => props.close()}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={500}
      scrollOffset={100}
      style={{flex: 1}}>
      <View style={styles.spacer} />
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.title}>Displayed Habits</Text>
          </View>
          <View style={styles.listContainer}>
            <SectionList
              sections={[
                {title: 'Positive', positive: true, data: props.positiveData},
                {title: 'Negative', positive: false, data: props.negativeData},
              ]}
              keyExtractor={(item, index) => item + index}
              renderSectionHeader={({section: {title, positive, data}}) => {
                let allSelected = positive
                  ? props.allPositiveSelected
                  : props.allNegativeSelected;
                return (
                  <SectionHeader
                    title={title}
                    toggleAll={() => {
                      if (allSelected) {
                        props.deselectAll(positive);
                      } else {
                        props.selectAll(positive);
                      }
                    }}
                    allSelected={allSelected}
                  />
                );
              }}
              renderItem={({item}) => (
                <ListItem
                  item={item}
                  toggleSelected={(id, positive) =>
                    props.toggleSelected(id, positive)
                  }
                />
              )}
              ListEmptyComponent={
                <Text style={{flex: 1}}>No habits added yet</Text>
              }
              contentContainerStyle={styles.listextra}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ListItem(props) {
  return (
    <View style={styles.li}>
      <TouchableHighlight
        style={styles.liHL}
        activeOpacity={0.6}
        underlayColor="#aaa8"
        onPress={() =>
          props.toggleSelected(props.item.id, props.item.positive)
        }>
        <Text style={styles.liTxt}>{props.item.title}</Text>
      </TouchableHighlight>
      {props.item.selected ? (
        <Ionicons
          name="md-checkmark-circle-outline"
          style={styles.checkBox}
          onPress={() =>
            props.toggleSelected(props.item.id, props.item.positive)
          }
        />
      ) : (
        <Icon
          name="circle-thin"
          style={styles.checkBox}
          onPress={() =>
            props.toggleSelected(props.item.id, props.item.positive)
          }
        />
      )}
    </View>
  );
}

function SectionHeader(props) {
  return (
    <View style={styles.secHeader}>
      <TouchableHighlight
        style={styles.shHL}
        activeOpacity={0.6}
        underlayColor="#aaa8"
        onPress={() => props.toggleAll()}>
        <Text style={styles.shTxt}>{props.title}</Text>
      </TouchableHighlight>
      {props.allSelected ? (
        <Ionicons
          name="md-checkmark-circle-outline"
          style={styles.checkBox}
          onPress={() => props.toggleAll()}
        />
      ) : (
        <Icon
          name="circle-thin"
          style={styles.checkBox}
          onPress={() => props.toggleAll()}
        />
      )}
    </View>
  );
}

function checkAllSelected(data) {
  let answer;
  try {
    answer = data.every((habit) => habit.selected);
  } catch (err) {
    answer = false;
  }
  return answer;
}

const mapStateToProps = (state, ownProps) => {
  return {
    positiveData: state.positiveList,
    negativeData: state.negativeList,
    allPositiveSelected: checkAllSelected(state.positiveList),
    allNegativeSelected: checkAllSelected(state.negativeList),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggleSelected: (id, positive) => {
      let prefix = positive ? 'positive/' : 'negative/';
      dispatch({type: prefix + 'toggleSelected', payload: id});
    },
    selectAll: (positive) => {
      let prefix = positive ? 'positive/' : 'negative/';
      dispatch({type: prefix + 'selectAll'});
    },
    deselectAll: (positive) => {
      let prefix = positive ? 'positive/' : 'negative/';
      dispatch({type: prefix + 'deselectAll'});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OverviewModal);

const styles = StyleSheet.create({
  spacer: {
    flex: 4,
    opacity: 0,
  },
  container: {
    flex: 3,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  oval: {
    width: 15,
    height: 4,
    backgroundColor: '#aaa8',
    margin: 4,
    borderRadius: 3,
  },
  body: {
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    alignItems: 'center',
    minWidth: '90%',
    flex: 4,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#aaa8',
    margin: 5,
  },
  list: {
    minWidth: '100%',
  },
  listExtra: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  secHeader: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  shHL: {
    flex: 1,
    borderRadius: 2,
  },
  shTxt: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  li: {
    flexDirection: 'row',
    minWidth: '90%',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  liHL: {
    flex: 1,
    borderRadius: 2,
  },
  liTxt: {
    fontSize: 20,
  },
  checkBox: {
    fontSize: 20,
  },
});
