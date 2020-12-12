import * as React from 'react';
import {Button} from 'react-native';
import {connect} from 'react-redux';
import RNIap from 'react-native-iap';
import {premiumSKU} from '../../utils/Constants';

function BuyPremiumButton(props) {
  if (props.pending) {
    //XXX remove setfree
    return (
      <Button
        title="Transaction Pending..."
        onPress={() => requestPurchase()}
      />
    );
  } else if (!props.premium) {
    return (
      <Button
        title={'Buy Premium (' + props.price + ')'}
        onPress={() => requestPurchase()}
      />
    );
  } else return null;
}

const requestPurchase = async () => {
  try {
    await RNIap.requestPurchase(premiumSKU, false);
  } catch (err) {
    console.log(err.message);
  }
};

const mapStateToProps = (state, ownProps) => ({
  premium: state.settings.premium,
  pending: state.settings.pending,
  price: state.settings.price,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setPremium: () =>
    dispatch({
      type: 'settings/setPremium',
    }),
  unsetPending: () =>
    dispatch({
      //XXX remove
      type: 'settings/unsetPending',
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(BuyPremiumButton);
