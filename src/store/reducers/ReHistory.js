//Given a habit and an index, recompute momentum history downstream equal
//of index, given up-to-date activity

export default (habit, index, positive) => {
  let newHabit = reHistory(habit, index, positive);
  if (isNaN(newHabit.histValues[newHabit.histValues.length - 1])) {
    newHabit = reHistory(habit, 0, positive);
  }
  return newHabit;
};

const reHistory = (habit, index, positive) => {
  index = index < 0 ? 0 : index;
  let newHistory = habit.histValues.slice(0, index);
  if (positive) {
    for (let i = index; i < habit.activity.length; i++) {
      let lastVal = i > 0 ? newHistory[i - 1] : 0;
      newHistory[i] =
        lastVal * habit.parameters.r + habit.activity[i] * habit.parameters.a;
      //Habit function. Each day is last day * r (<1), then optionally adding a if activity performed
    }
  } else {
    let streak = habit.activity
      .slice(0, index)
      .reduce((acc, curr) => (curr > 0 ? acc + 1 : 0), 0);
    for (let i = index; i < habit.activity.length; i++) {
      streak = habit.activity[i] ? streak + 1 : 0;
      newHistory[i] = 1 - Math.exp((-1 * streak) / habit.parameters.k); //Asymtotically approaches 1
    }
  }
  let newHabit = JSON.parse(JSON.stringify(habit));
  newHabit.histValues = newHistory;
  return newHabit;
};
