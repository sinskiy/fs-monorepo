import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientsService from "../services/patients";
import {
  assertNever,
  Diagnosis,
  Entry,
  type HealthCheckEntry,
  HealthCheckRating,
  type HospitalEntry,
  type OccupationalHealthcareEntry,
  Patient,
} from "../types";
import {
  Favorite,
  Female,
  LocalHospital,
  Male,
  MonitorHeart,
  Work,
} from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import diagnosesService from "../services/diagnoses";

export const PatientPage = () => {
  const params = useParams();

  const [error, setError] = useState("");

  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (params.id) {
      patientsService
        .getById(params.id)
        .then((value) => setPatient(value))
        .catch((error) =>
          setError(error?.response?.data?.error ?? error?.message ?? error)
        );
    }
  }, [params.id]);

  const [diagnoses, setDiagnoses] = useState<Diagnosis[] | null>(null);
  useEffect(() => {
    diagnosesService
      .getAll()
      .then((value) => setDiagnoses(value))
      .catch((error) =>
        setError(error?.response?.data?.error ?? error?.message ?? error)
      );
  }, []);
  console.log(diagnoses);

  if (error) {
    return <p>{error}</p>;
  } else if (!patient) {
    return <p>loading patient</p>;
  }

  return (
    <Box component="main" sx={{ mt: 3 }}>
      <Typography variant="h4" component="h2" fontWeight={600}>
        {patient.name} {patient.gender === "female" ? <Female /> : <Male />}
      </Typography>
      <Typography sx={{ my: 2 }}>
        ssh: {patient.ssn}
        <br />
        occupation: {patient.occupation}
      </Typography>
      <Box component="section">
        <Typography variant="h5" component="h3" fontWeight={500}>
          entries
        </Typography>
        {patient.entries.map((entry) => (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <EntryDetails key={entry.id} entry={entry} />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

const EntryDetails: FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntry entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const HospitalEntry: FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <Box component="article">
      <Typography>
        <time dateTime={entry.date}>{entry.date}</time>
        <LocalHospital />
      </Typography>
      <Typography>
        <i>{entry.description}</i>
      </Typography>
      <Typography>diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const OccupationalHealthcareEntry: FC<{
  entry: OccupationalHealthcareEntry;
}> = ({ entry }) => {
  return (
    <Box component="article">
      <Typography>
        <time dateTime={entry.date}>{entry.date}</time>
        <Work />
        <i>{entry.employerName}</i>
      </Typography>
      <Typography>
        <i>{entry.description}</i>
      </Typography>
      <Typography>diagnose by {entry.specialist}</Typography>
    </Box>
  );
};

const HealthCheckEntry: FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  return (
    <Box component="article">
      <Typography>
        <time dateTime={entry.date}>{entry.date}</time>
        <MonitorHeart />
      </Typography>
      <Typography>
        <i>{entry.description}</i>
      </Typography>
      <Favorite
        color={
          entry.healthCheckRating === HealthCheckRating.Healthy
            ? "success"
            : entry.healthCheckRating === HealthCheckRating.LowRisk
            ? "secondary"
            : entry.healthCheckRating === HealthCheckRating.HighRisk
            ? "warning"
            : "error"
        }
      />
      <Typography>diagnose by {entry.specialist}</Typography>
    </Box>
  );
};
