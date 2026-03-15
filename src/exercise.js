"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXERCISES = void 0;
exports.getRandomExercise = getRandomExercise;
exports.getNextExercise = getNextExercise;
exports.EXERCISES = [
    {
        title: '20-20-20 Rule',
        description: 'Look at something 20 feet away for 20 seconds.',
    },
    {
        title: 'Blink Slowly',
        description: 'Blink your eyes very slowly 10 times to naturally lubricate them.',
    },
    {
        title: 'Eye Roll',
        description: 'Slowly roll your eyes in a circle 3 times clockwise, then 3 times counter-clockwise.',
    },
    {
        title: 'Focus Shift',
        description: 'Hold a finger a few inches away and focus on it. Then focus on something far away. Repeat 5 times.',
    },
    {
        title: 'Palming',
        description: 'Rub your hands together to warm them, then gently cup them over your closed eyes for 30 seconds.',
    }
];
function getRandomExercise() {
    const randomIndex = Math.floor(Math.random() * exports.EXERCISES.length);
    return exports.EXERCISES[randomIndex];
}
function getNextExercise(currentIndex) {
    const nextIndex = (currentIndex + 1) % exports.EXERCISES.length;
    return exports.EXERCISES[nextIndex];
}
//# sourceMappingURL=exercise.js.map