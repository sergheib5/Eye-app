import notifier from 'node-notifier';
import { Exercise } from './exercise';

export function sendExerciseNotification(exercise: Exercise, onClick?: () => void): void {
  notifier.notify(
    {
      title: 'Time for an Eye Break! 👀',
      subtitle: exercise.title,
      message: exercise.description,
      sound: true,
      wait: true, // We need to wait to capture the click
    },
    (err, response, metadata) => {
      if (response === 'activate' || response === 'clicked' || (metadata as any)?.activationType === 'clicked') {
        if (onClick) onClick();
      }
    }
  );
}
