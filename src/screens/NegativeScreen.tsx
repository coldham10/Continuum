import * as React from 'react';
import {ImageBackground} from 'react-native';
import {connect} from 'react-redux';
import HabitList from '../components/lists/HabitList';
import {imageList} from '../utils/Constants';

function NegativeScreen(props) {
  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={imageList[props.bgIndex].image}>
      <HabitList positive={false} {...props} />
    </ImageBackground>
  );
}
const mapStateToProps = (state, ownProps) => ({
  bgIndex: state.settings.background,
});

export default connect(mapStateToProps, null)(NegativeScreen);
