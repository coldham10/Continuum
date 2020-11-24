//Given a habit and an index, recompute momentum history downstream
//of index, given up-to-date activity

export default (habit, index, positive) => {
  let newHistory = [];
  if (positive) {
    for (let i = 0; i < habit.activity.length; i++) {
      let lastVal = i > 0 ? newHistory[i - 1] : 0;
      newHistory.push(
        lastVal * habit.parameters.r + habit.activity[i] * habit.parameters.a,
      ); //Habit function. Each day is last day * r (<1), then optionally adding a if activity performed
    }
  } else {
    let streak = 0;
    for (let i = 0; i < habit.activity.length; i++) {
      streak = habit.activity[i] ? streak + 1 : 0;
      newHistory.push(1 - Math.exp((-1 * streak) / habit.parameters.k)); //Asymtotically approaches 1
    }
    let newHabit = JSON.parse(JSON.stringify(habit));
    newHabit.histValues = newHistory;
  }
  return newHabit;
};
