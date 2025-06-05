import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { FormEventHandler, useState } from "react";
import {
  assertNever,
  Entry,
  EntryFormValues,
  HealthCheckRating,
} from "../../types";

interface NewEntryFormProps {
  onCancel: () => void;
  onSubmit: (entry: EntryFormValues) => void;
  error: string;
}

export const NewEntryForm = ({
  onCancel,
  onSubmit,
  error,
}: NewEntryFormProps) => {
  const [entryType, setEntryType] = useState<Entry["type"]>("Hospital");

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");

  const [employerName, setEmployerName] = useState("");
  const [startDateOfSickLeave, setStartDateOfSickLeave] = useState("");
  const [endDateOfSickLeave, setEndDateOfSickLeave] = useState("");

  const buildNewEntryValues = (): EntryFormValues => {
    const baseValues = { date, description, specialist, diagnosisCodes };
    switch (entryType) {
      case "Hospital":
        return {
          ...baseValues,
          type: "Hospital",
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
      case "OccupationalHealthcare":
        return {
          ...baseValues,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave: {
            startDate: startDateOfSickLeave,
            endDate: endDateOfSickLeave,
          },
        };
      case "HealthCheck":
        return { ...baseValues, type: "HealthCheck", healthCheckRating };
      default:
        return assertNever(entryType);
    }
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    onSubmit(buildNewEntryValues());
  };

  return (
    <Card>
      <CardContent>
        <div>
          <InputLabel id="entry-type-label">Entry type</InputLabel>
          <Select
            labelId="entry-type-label"
            id="entry-type"
            value={entryType}
            label="Entry type"
            onChange={(e) => setEntryType(e.target.value as Entry["type"])}
          >
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              Occupational healthcare
            </MenuItem>
            <MenuItem value="HealthCheck">Health check</MenuItem>
          </Select>
        </div>
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" component="h3">
            New {entryType} entry
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <div>
            <TextField
              id="description"
              label="Description"
              variant="standard"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <InputLabel htmlFor="date">Date</InputLabel>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <TextField
              id="specialist"
              label="Specialist"
              variant="standard"
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
            />
          </div>
          {entryType === "HealthCheck" && (
            <div>
              <InputLabel id="health-check-rating-label">
                Healthcheck rating
              </InputLabel>
              <Select
                labelId="health-check-rating-label"
                id="health-check-rating"
                value={healthCheckRating}
                label="Healthcheck rating"
                onChange={(e) =>
                  setHealthCheckRating(e.target.value as HealthCheckRating)
                }
              >
                <MenuItem value={HealthCheckRating.Healthy}>0</MenuItem>
                <MenuItem value={HealthCheckRating.LowRisk}>1</MenuItem>
                <MenuItem value={HealthCheckRating.HighRisk}>2</MenuItem>
                <MenuItem value={HealthCheckRating.CriticalRisk}>3</MenuItem>
              </Select>
            </div>
          )}
          {entryType === "Hospital" && (
            <>
              <div>
                <InputLabel htmlFor="discharge-date">Discharge date</InputLabel>
                <Input
                  id="discharge-date"
                  type="date"
                  value={dischargeDate}
                  onChange={(e) => setDischargeDate(e.target.value)}
                />
              </div>
              <div>
                <TextField
                  id="discharge-criteria"
                  label="Discharge criteria"
                  variant="standard"
                  value={dischargeCriteria}
                  onChange={(e) => setDischargeCriteria(e.target.value)}
                />
              </div>
            </>
          )}
          {entryType === "OccupationalHealthcare" && (
            <>
              <div>
                <TextField
                  id="employer-name"
                  label="Employer name"
                  variant="standard"
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
                <div>
                  <InputLabel htmlFor="sick-leave-start-date">
                    Sick leave start date
                  </InputLabel>
                  <Input
                    id="sick-leave-start-date"
                    type="date"
                    value={startDateOfSickLeave}
                    onChange={(e) => setStartDateOfSickLeave(e.target.value)}
                  />
                </div>
                <div>
                  <InputLabel htmlFor="sick-leave-end-date">
                    Sick leave end date
                  </InputLabel>
                  <Input
                    id="sick-leave-end-date"
                    type="date"
                    value={endDateOfSickLeave}
                    onChange={(e) => setEndDateOfSickLeave(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <TextField
              id="diagnosis-codes"
              label="Diagnosis codes"
              variant="standard"
              value={diagnosisCodes.join(", ")}
              onChange={(e) => setDiagnosisCodes(e.target.value.split(", "))}
            />
          </div>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="error"
              onClick={onCancel}
              type="button"
            >
              cancel
            </Button>
            <Button variant="contained" color="inherit" type="submit">
              add
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};
