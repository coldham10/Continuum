/*Invisible Component that maintains a timer that refreshes the data at midnight*/
import * as React from 'react';
import {connect} from 'react-redux';
import {LogBox, AppState} from 'react-native';

class UpdateTimer extends React.Component {
  constructor(props) {
    LogBox.ignoreLogs(['Setting a timer']);
    super(props);
    this.timer = null;
  }

  scheduleUpdate() {
    clearTimeout(this.timer);
    let midnight = new Date();
    midnight.setHours(24, 0, 0, 500);
    let millis = midnight - new Date(); //Milliseconds until new day
    this.timer = setTimeout(() => {
      this.props.updateAll();
      this.scheduleUpdate(); //Call again for next day
    }, millis);
  }

  componentDidMount() {
    this.scheduleUpdate();
    AppState.addEventListener('focus', () => this.onFocus());
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    AppState.removeEventListener('focus', () => this.onFocus());
  }

  onFocus() {
    this.props.updateAll();
    this.scheduleUpdate();
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateAll: () => {
      dispatch({type: 'positive/extendAll'});
      dispatch({type: 'negative/extendAll'});
    },
  };
};

export default connect(null, mapDispatchToProps)(UpdateTimer);
