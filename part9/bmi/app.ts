import express from "express";
import { isArrayOfType, isPositiveNumeric } from "./utils.ts";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercises } from "./exerciseCalculator.ts";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const searchParams = req.query;
  if (
    !isPositiveNumeric(searchParams.weight) ||
    !isPositiveNumeric(searchParams.height)
  ) {
    res.status(401).json({ error: "malformatted parameters" });
    return;
  }

  const weight = Number(searchParams.weight);
  const height = Number(searchParams.height);
  res.json({ weight, height, bmi: calculateBmi(height, weight) });
});

app.post("/exercises", (req, res) => {
  if (typeof req.body !== "object") {
    res.status(401).json({ error: "malformatted parameters" });
    return;
  }

  // validated by typeof object
  const { daily_exercises, target } = req.body as Record<string, unknown>;

  if (!daily_exercises || !target) {
    res.status(401).json({ error: "parameters missing" });
    return;
  }

  if (typeof target !== "number" || target <= 0) {
    res.status(401).json({ error: "malformatted parameters" });
    return;
  }

  if (
    !isArrayOfType(
      daily_exercises,
      (item): item is number => typeof item === "number" && item >= 0
    )
  ) {
    res.status(401).json({ error: "malformatted parameters" });
    return;
  }

  res.json(calculateExercises(daily_exercises, target));
});

app.listen(3000);
