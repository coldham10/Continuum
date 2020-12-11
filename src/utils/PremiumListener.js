/*Invisible Component that maintains a timer that refreshes the data at midnight*/
import * as React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap';

class PremiumListener extends React.Component {
  constructor(props) {
    super(props);
    this.listener = null;
    this.state = {status: 'init'};
  }

  componentDidMount() {
    RNIap.initConnection()
      .then(() => {
        RNIap.flushFailedPurchasesCachedAsPendingAndroid()
          .catch(() => {})
          .then(() => {
            this.listener = purchaseUpdatedListener((purchase) => {
              this.setState({status: purchase.toString()});
            });
          });
      })
      .catch((err) => this.setState({status: 'Listener setup failed'}));
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  render() {
    return <Text>{this.state.status}</Text>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return null;
};

export default connect(null, null)(PremiumListener);
