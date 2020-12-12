/*Invisible Component that maintains a timer that refreshes the data at midnight*/
import * as React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import {premiumSKU} from './Constants';

//Android PurchaseStates
const A_UNSPECIFIED_STATE = 0;
const A_PURCHASED = 1;
const A_PENDING = 2;
//Android BillingResponseCodes
const A_USER_CANCELED = 1;
const A_API_ERROR = 6;

class PremiumListener extends React.Component {
  constructor(props) {
    super(props);
    this.listener = null;
    this.errorListener = null;
  }

  componentDidMount() {
    RNIap.initConnection()
      .then(() => {
        RNIap.flushFailedPurchasesCachedAsPendingAndroid()
          .catch(() => {})
          .then(() => {
            this.listener = purchaseUpdatedListener((purchase) => {
              switch (purchase.purchaseStateAndroid) {
                case A_PURCHASED:
                  this.props.setPremium();
                  RNIap.finishTransaction(purchase, false);
                  break;
                case A_PENDING:
                  this.props.setPending();
                  break;
              }
            });
            this.errorListener = purchaseErrorListener((error) => {
              switch (error.responseCode) {
                case A_USER_CANCELED:
                  this.props.unsetPending();
                  break;
                case A_API_ERROR:
                default:
                  this.restorePurchases();
              }
            });
          })
          .then(() => {
            //Update price for display
            RNIap.getProducts([premiumSKU]).then((prods) => {
              console.log(prods);
              this.props.setPrice(prods[0].localizedPrice);
            });
          })
          .then(() => {
            //Restore purchase
            this.restorePurchases();
          });
      })
      .catch((err) => console.log(err.message));
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
    if (this.errorListener) {
      this.errorListener.remove();
      this.errorListener = null;
    }
  }

  restorePurchases() {
    RNIap.getAvailablePurchases()
      .then((purchases) => {
        purchases = purchases.filter(
          (purchase) => purchase.productId === premiumSKU,
        );
        if (purchases.length === 0) {
          this.props.unsetPending();
        } else if (purchases[0].productId === premiumSKU) {
          if (purchases[0].purchaseStateAndroid === A_PURCHASED) {
            this.props.setPremium();
          } else if (purchases[0].purchaseStateAndroid === A_PENDING) {
            this.props.setPending();
          }
        }
      })
      .catch(() => {});
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPremium: () => dispatch({type: 'settings/setPremium'}),
    unsetPending: () => dispatch({type: 'settings/unsetPending'}),
    setPending: () => dispatch({type: 'settings/setPending'}),
    setPrice: (price) => dispatch({type: 'settings/setPrice', payload: price}),
  };
};

export default connect(null, mapDispatchToProps)(PremiumListener);
