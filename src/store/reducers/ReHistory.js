//Given a habit and an index, recompute momentum history downstream equal
//of index, given up-to-date activity

export default (habit, index, positive) => {
  console.log('Incoming');
  console.log(index);
  console.log(habit.activity);
  index = index < 0 ? 0 : index;
  let newHistory = habit.histValues.slice(0, index);
  console.log('Itreations:');
  if (positive) {
    for (let i = index; i < habit.activity.length; i++) {
      console.log(newHistory);
      let lastVal = i > 0 ? newHistory[i - 1] : 0;
      newHistory[i] =
        lastVal * habit.parameters.r + habit.activity[i] * habit.parameters.a;
      //Habit function. Each day is last day * r (<1), then optionally adding a if activity performed
    }
  } else {
    let streak = habit.activity
      .slice(0, index)
      .reduce((acc, curr) => (curr > 0 ? acc + 1 : 0), 0);
    console.log('Instreak: ' + streak);
    for (let i = index; i < habit.activity.length; i++) {
      console.log(newHistory);
      streak = habit.activity[i] ? streak + 1 : 0;
      newHistory[i] = 1 - Math.exp((-1 * streak) / habit.parameters.k); //Asymtotically approaches 1
    }
  }
  let newHabit = JSON.parse(JSON.stringify(habit));
  console.log(newHistory);
  newHabit.histValues = newHistory;
  return newHabit;
};
