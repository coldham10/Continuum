//Create new habit starting today, either positive or negative

export default (positive) => {
  let rightNow = new Date();
  let today = new Date(
    rightNow.getFullYear(),
    rightNow.getMonth(),
    rightNow.getDate(),
  ); //Set to 00:00 of day created so that new days clock over at midnight
  let habit = {
    positive,
    id: Date.now(),
    title: 'New Habit',
    timeStamp: today.getTime(),
    parameters: positive
      ? {r: 0.7966, a: 0.4027, max: 1.9797} //For geometric habit function (+ve)
      : {k: 7}, //For exponential momentum function (-ve)
    histValues: [0], //habit-function values at end of day every day since timeStamp
    activity: [0], //Binary array since timeStamp day, 0="not done", 1="done"
    selected: true,
  };
  return habit;
};
