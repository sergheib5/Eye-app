"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exercise_1 = require("../exercise");
describe('Exercise Selector', () => {
    it('should return a random exercise from the list', () => {
        const exercise = (0, exercise_1.getRandomExercise)();
        expect(exercise_1.EXERCISES).toContainEqual(exercise);
    });
    it('should return the next exercise sequentially', () => {
        const first = (0, exercise_1.getNextExercise)(0);
        expect(first).toEqual(exercise_1.EXERCISES[1 % exercise_1.EXERCISES.length]);
        const second = (0, exercise_1.getNextExercise)(1);
        expect(second).toEqual(exercise_1.EXERCISES[2 % exercise_1.EXERCISES.length]);
        const last = (0, exercise_1.getNextExercise)(exercise_1.EXERCISES.length - 1);
        expect(last).toEqual(exercise_1.EXERCISES[0]);
    });
});
//# sourceMappingURL=exercise.test.js.map