import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientsService from "../services/patients";
import { Diagnosis, Patient } from "../types";
import { Female, Male } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
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
        <Typography variant="h5" component="h3" fontWeight={500} sx={{ mb: 2 }}>
          entries
        </Typography>
        {patient.entries.map((entry) => (
          <Box component="article" key={entry.id}>
            <Typography>
              <time dateTime={entry.date}>{entry.date}</time>{" "}
              <i>{entry.description}</i>
            </Typography>
            {entry.diagnosisCodes && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <Typography component="li" key={code}>
                    {code}{" "}
                    {diagnoses &&
                      (diagnoses.find((diagnosis) => diagnosis.code === code)
                        ?.name ??
                        "description not found")}
                  </Typography>
                ))}
              </ul>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
