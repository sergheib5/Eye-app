"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_notifier_1 = __importDefault(require("node-notifier"));
const notifier_1 = require("../notifier");
const exercise_1 = require("../exercise");
jest.mock('node-notifier', () => {
    return {
        notify: jest.fn()
    };
});
describe('Notifier Wrapper', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should call node-notifier with the correct exercise details', () => {
        const exercise = {
            title: 'Test Exercise',
            description: 'This is a test description.',
        };
        (0, notifier_1.sendExerciseNotification)(exercise);
        expect(node_notifier_1.default.notify).toHaveBeenCalledTimes(1);
        expect(node_notifier_1.default.notify).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Time for an Eye Break! 👀',
            subtitle: exercise.title,
            message: exercise.description,
            sound: true,
        }));
    });
});
//# sourceMappingURL=notifier.test.js.map