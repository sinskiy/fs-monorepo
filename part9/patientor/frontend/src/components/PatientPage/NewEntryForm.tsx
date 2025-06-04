import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import patientsService from "../../services/patients";
import { HealthCheckRating, Patient } from "../../types";
import { getErrorAndLog } from "../../utils";

interface NewEntryFormProps {
  id: string;
  hideEntryForm: () => void;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
}

export const NewEntryForm = ({
  id,
  hideEntryForm,
  setPatient,
}: NewEntryFormProps) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState("");
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleNewEntrySubmit: FormEventHandler = (e) => {
    e.preventDefault();
    patientsService
      .createEntry(id, {
        date,
        description,
        healthCheckRating,
        specialist,
        type: "HealthCheck",
        diagnosisCodes,
      })
      .then((value) => {
        setPatient(value);
        hideEntryForm();
      })
      .catch((error) => {
        setError(getErrorAndLog(error));
      });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleNewEntrySubmit}>
          <Typography variant="h5" component="h3">
            New HealthCheck entry
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
            <TextField
              id="date"
              label="Date"
              type="date"
              variant="standard"
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
              onClick={hideEntryForm}
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
