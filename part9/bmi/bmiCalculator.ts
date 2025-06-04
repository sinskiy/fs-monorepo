import { getErrorMessage, isRunFromCli, parseNumArguments } from "./utils.ts";

type BmiCategory = "Underweight" | "Normal range" | "Overweight" | "Obese";

export function calculateBmi(heightCm: number, weightKg: number): BmiCategory {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal range";
  } else if (bmi >= 25 && bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
}

if (isRunFromCli()) {
  cli();
}

function cli(): void {
  try {
    const [height, weight] = parseNumArguments(process.argv, 2);
    console.log(calculateBmi(height, weight));
  } catch (error) {
    console.log(getErrorMessage(error));
  }
}
