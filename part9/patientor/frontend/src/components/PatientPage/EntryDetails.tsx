import { FC } from "react";
import {
  assertNever,
  Entry,
  type HealthCheckEntry,
  HealthCheckRating,
  type HospitalEntry,
  type OccupationalHealthcareEntry,
} from "../../types";
import {
  Favorite,
  LocalHospital,
  MonitorHeart,
  Work,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export const EntryDetails: FC<{ entry: Entry }> = ({ entry }) => {
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
