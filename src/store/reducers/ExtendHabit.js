/*Returns a copy of habit with activity and momentum history updated to present
 * day. Will Extend with zeros, toggling to ones should be done by other functions*/
import reHistory from './ReHistory';

export default (habit) => {
  let daysOld = Math.floor(
    (Date.now() - habit.timeStamp) / (1000 * 60 * 60 * 24),
  );
  let daysStale = daysOld + 1 - habit.activity.length;
  if (daysStale > 0) {
    habit.activity = habit.activity.concat(new Array(daysStale).fill(0));
    return reHistory(
      habit,
      habit.activity.length - 1 - daysStale,
      habit.positive,
    );
  } else return habit;
};
