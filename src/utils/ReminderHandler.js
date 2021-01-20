import * as React from 'react';
import PushNotification from 'react-native-push-notification';
import {connect} from 'react-redux';

class ReminderHandler extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    PushNotification.cancelAllLocalNotifications();
    if (this.props.nextReminder !== null) {
      PushNotification.localNotificationSchedule({
        channel: 'reminders',
        title: 'Reminder',
        message: 'Time to log your habits.',
        date: this.props.nextReminder,
        allowWhileIdle: true,
        ignoreInForeground: true,
        repeatType: 'day',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.nextReminder) {
      if (
        //Reminder newly set,
        !prevProps.nextReminder ||
        //Or, time has actually changed
        this.props.nextReminder.getHours() !==
          prevProps.nextReminder.getHours() ||
        this.props.nextReminder.getMinutes() !==
          prevProps.nextReminder.getMinutes()
      ) {
        //Change the reminder
        PushNotification.cancelAllLocalNotifications();
        PushNotification.localNotificationSchedule({
          channel: 'reminders',
          title: 'Reminder',
          message: 'Time to log your habits.',
          date: this.props.nextReminder,
          allowWhileIdle: true,
          ignoreInForeground: true,
          repeatType: 'day',
        });
      }
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state, ownProps) => {
  let newReminder = new Date();
  if (state.settings.reminder) {
    newReminder.setHours(state.settings.reminderHour);
    newReminder.setMinutes(state.settings.reminderMinute, 0, 0);
    if (newReminder <= Date.now()) {
      newReminder.setDate(newReminder.getDate() + 1);
    }
  } else {
    newReminder = null;
  }
  return {
    nextReminder: newReminder,
  };
};

export default connect(mapStateToProps, null)(ReminderHandler);
