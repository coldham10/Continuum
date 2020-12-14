import * as React from 'react';
import {Button, PermissionsAndroid, Alert} from 'react-native';
import {connect} from 'react-redux';
import RNIap from 'react-native-iap';
import RNFS from 'react-native-fs';
import {premiumSKU} from '../../utils/Constants';
import {
  raToLossDays,
  rToFormDays,
  displayPositiveMomentum,
} from '../../utils/Functions';

function ExportDataButton(props) {
  return (
    <Button
      title="Export data to .csv"
      onPress={() => {
        if (props.premium) {
          export_csv(props.data);
        } else {
          props.navigation.navigate('GetPremium', {
            reason: 'Exporting habit data',
          });
        }
      }}
    />
  );
}

const getMinDate = (data) => {
  let minDate = new Date();
  data.positiveList.forEach((habit) => {
    let d = new Date(habit.timeStamp);
    minDate = d < minDate ? d : minDate;
  });
  data.negativeList.forEach((habit) => {
    let d = new Date(habit.timeStamp);
    minDate = d < minDate ? d : minDate;
  });
  return minDate;
};

const export_csv = async (data) => {
  let minDate = getMinDate(data);
  let now = Date.now();
  let header = 'Name,Formation Time,Loss Time,';
  for (
    let iDate = new Date(minDate);
    iDate < now;
    iDate.setDate(iDate.getDate() + 1)
  ) {
    header += ',' + iDate.toJSON().split('T')[0];
  }
  let activityFile = header + '\n';
  let momentumFile = header + '\n';
  data.positiveList.forEach((habit) => {
    /*Iterate over positive habits line by line first*/
    let a_line = habit.title.replace(',', '');
    a_line += ',' + rToFormDays(habit.parameters.r);
    a_line += ',' + raToLossDays(habit.parameters.r, habit.parameters.a) + ',';
    let m_line = a_line;
    let dateCreated = new Date(habit.timeStamp);
    let index = 0;
    for (
      let iDate = new Date(minDate);
      iDate < now;
      iDate.setDate(iDate.getDate() + 1)
    ) {
      /*Fill out the lines */
      a_line += ',';
      m_line += ',';
      if (iDate >= dateCreated) {
        a_line += habit.activity[index];
        m_line += displayPositiveMomentum(
          habit.histValues[index++],
          habit.parameters.max,
        );
      }
    }
    a_line += '\n';
    m_line += '\n';
    activityFile += a_line;
    momentumFile += m_line;
  });
  data.negativeList.forEach((habit) => {
    /*Iterate over negative habits line by line next*/
    let a_line = habit.title.replace(',', '');
    a_line += ',' + habit.parameters.k;
    a_line += ',,';
    let m_line = a_line;
    let dateCreated = new Date(habit.timeStamp);
    let index = 0;
    for (
      let iDate = new Date(minDate);
      iDate < now;
      iDate.setDate(iDate.getDate() + 1)
    ) {
      /*Fill out the line */
      a_line += ',';
      m_line += ',';
      if (iDate >= dateCreated) {
        a_line += habit.activity[index];
        m_line += habit.histValues[index++];
      }
    }
    a_line += '\n';
    m_line += '\n';
    activityFile += a_line;
    momentumFile += m_line;
  });
  write_file(activityFile, 'continuum_activity.csv');
  write_file(momentumFile, 'continuum_momentum.csv');
};

const write_file = async (text, fname) => {
  var path = RNFS.DownloadDirectoryPath + '/' + fname;
  // write the file
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Continuum Write File Permission',
        message: 'Continuum needs to access your files to export your data.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      RNFS.writeFile(path, text, 'utf8')
        .then((success) => {
          Alert.alert(
            'Export Complete',
            'File written to ' + path,
            [{text: 'OK'}],
            {cancelable: false},
          );
        })
        .catch((err) => {
          console.warn(err);
        });
    } else {
      Alert.alert(
        'Write permission denied',
        'Please allow storage access',
        [{text: 'CANCEL'}],
        {cancelable: false},
      );
    }
  } catch (err) {
    console.warn(err);
  }
};

const mapStateToProps = (state, ownProps) => ({
  premium: state.settings.premium,
  data: state,
});

export default connect(mapStateToProps, null)(ExportDataButton);
