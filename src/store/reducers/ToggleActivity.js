//Toggle activity of a habit for a certain date, and return the index of that date

export default (habit, date) => {
  let newHabit = JSON.parse(JSON.stringify(habit));
  let index = Math.floor((date - habit.timeStamp) / (1000 * 60 * 60 * 24));
  newHabit.activity = habit.activity.map((val, idx) => {
    if (idx === index) {
      val = 1 - val; //Flip the bit
    }
    return val; //Create new activity values with toggled day
  });
  return {data: newHabit, index};
};
