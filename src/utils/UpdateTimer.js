/*Invisible Component that maintains a timer that refreshes the data at midnight*/
import * as React from 'react';
import {connect} from 'react-redux';

class UpdateTimer extends React.Component {
  constructor(props) {
    super(props);
  }

  scheduleUpdate() {
    let midnight = new Date();
    midnight.setHours(24, 0, 0, 500);
    let millis = midnight - new Date(); //Milliseconds until new day
    setTimeout(() => {
      this.props.updateAll();
      this.scheduleUpdate(); //Call again for next day
    }, millis);
  }

  componentDidMount() {
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
