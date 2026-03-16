import notifier from 'node-notifier';
import { sendExerciseNotification } from '../notifier';
import { Exercise } from '../exercise';

jest.mock('node-notifier', () => {
  return {
    __esModule: true,
    default: {
      notify: jest.fn()
    }
  };
});

describe('Notifier Wrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call node-notifier with the correct exercise details', () => {
    const exercise: Exercise = {
      title: 'Test Exercise',
      description: 'This is a test description.',
    };

    sendExerciseNotification(exercise);

    expect(notifier.notify).toHaveBeenCalledTimes(1);
    expect(notifier.notify).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Time for an Eye Break! 👀',
        subtitle: exercise.title,
        message: exercise.description,
        sound: true,
        wait: true,
      }),
      expect.any(Function)
    );
  });
});
