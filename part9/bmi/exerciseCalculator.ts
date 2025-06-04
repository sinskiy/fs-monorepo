import { getErrorMessage, isRunFromCli, parseNumArguments } from "./utils.ts";

interface ExercisesAnalysis {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: keyof typeof RATING_MAP;
  ratingDescription: (typeof RATING_MAP)[keyof typeof RATING_MAP];
  target: number;
  average: number;
}

const RATING_MAP = {
  1: "bad",
  2: "not too bad but could be better",
  3: "good",
} as const;

export function calculateExercises(
  dailyExerciseHours: number[],
  targetHours: number
): ExercisesAnalysis {
  const periodLength = dailyExerciseHours.length;
  const totalHours = dailyExerciseHours.reduce((sum, day) => sum + day, 0);
  const average = totalHours / periodLength;
  const rating =
    average >= targetHours ? 3 : targetHours - average <= 1 ? 2 : 1;
  return {
    periodLength,
    trainingDays: dailyExerciseHours.filter((day) => day !== 0).length,
    success: average >= targetHours,
    rating,
    ratingDescription: RATING_MAP[rating],
    target: targetHours,
    average,
  };
}

if (isRunFromCli()) {
  cli();
}

function cli(): void {
  try {
    const [target, ...dailyExerciseHours] = parseNumArguments(process.argv);
    console.log(calculateExercises(dailyExerciseHours, target));
  } catch (error) {
    console.log(getErrorMessage(error));
  }
}
