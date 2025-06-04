import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientsService from "../../services/patients";
import { Patient } from "../../types";
import { Female, Male } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { EntryDetails } from "./EntryDetails";
import { NewEntryForm } from "./NewEntryForm";

export const PatientPage = () => {
  const params = useParams();

  const [error, setError] = useState("");

  const [patient, setPatient] = useState<Patient | null>(null);

  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

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

  if (!params.id) {
    return <p>invalid URL</p>;
  }

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
        {showNewEntryForm && (
          <NewEntryForm
            hideEntryForm={() => setShowNewEntryForm(false)}
            id={params.id}
            setPatient={setPatient}
          />
        )}
        {patient.entries.map((entry) => (
          <Card sx={{ mt: 2 }} key={entry.id}>
            <CardContent>
              <EntryDetails entry={entry} />
            </CardContent>
          </Card>
        ))}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setShowNewEntryForm(true)}
        >
          add new entry
        </Button>
      </Box>
    </Box>
  );
};
