export interface Exercise {
  title: string;
  description: string;
}

export const EXERCISES: Exercise[] = [
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
    title: 'Near-Far Zoom',
    description: 'Hold your thumb at arm length and focus on it. Slowly bring it closer to your nose while keeping it in focus, then move it back out. This helps with eye accommodation.',
  },
  {
    title: 'Palming',
    description: 'Rub your hands together to warm them, then gently cup them over your closed eyes WITHOUT applying pressure. Breathe deeply and relax for 30 seconds.',
  }
];

export function getRandomExercise(): Exercise {
  const randomIndex = Math.floor(Math.random() * EXERCISES.length);
  return EXERCISES[randomIndex];
}

export function getNextExercise(currentIndex: number): Exercise {
  const nextIndex = (currentIndex + 1) % EXERCISES.length;
  return EXERCISES[nextIndex];
}
