import { fileURLToPath } from "node:url";

export function parseNumArguments(
  args: string[],
  targetLength?: number
): number[] {
  const relevantArgs = args.slice(2);
  if (targetLength && relevantArgs.length !== targetLength) {
    throw new Error(`Expected ${targetLength} arguments`);
  }

  const parsedArguments: number[] = [];
  for (const arg of relevantArgs) {
    if (!isPositiveNumeric(arg)) {
      throw new Error(
        "Expected all arguments to be valid positive JavaScript numbers"
      );
    }

    parsedArguments.push(Number(arg));
  }

  return parsedArguments;
}

export function isArrayOfType<T>(
  arr: unknown,
  validator: (item: unknown) => item is T
): arr is T[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => validator(item));
}

export function isPositiveNumeric(value: unknown): boolean {
  const numberFromValue = typeof value === "number" ? value : Number(value);
  return !(isNaN(numberFromValue) || numberFromValue <= 0);
}

export function getErrorMessage(error: unknown): string {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  return errorMessage;
}

export function isRunFromCli(): boolean {
  return process.argv[1] === fileURLToPath(import.meta.url);
}
