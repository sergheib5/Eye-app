import { getNextExercise, getRandomExercise, EXERCISES } from '../exercise';

describe('Exercise Selector', () => {
  it('should return a random exercise from the list', () => {
    const exercise = getRandomExercise();
    expect(EXERCISES).toContainEqual(exercise);
  });

  it('should return the next exercise sequentially', () => {
    const first = getNextExercise(0);
    expect(first).toEqual(EXERCISES[1 % EXERCISES.length]);
    
    const second = getNextExercise(1);
    expect(second).toEqual(EXERCISES[2 % EXERCISES.length]);
    
    const last = getNextExercise(EXERCISES.length - 1);
    expect(last).toEqual(EXERCISES[0]);
  });
});
