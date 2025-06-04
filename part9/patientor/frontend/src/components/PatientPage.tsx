import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientsService from "../services/patients";
import { Patient } from "../types";
import { Female, Male } from "@mui/icons-material";

export const PatientPage = () => {
  const params = useParams();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      patientsService
        .getById(params.id)
        .then((value) => setPatient(value))
        .catch((error) => setError(error.response.data.error ?? error));
    }
  }, [params.id]);

  if (error) {
    return <p>{error}</p>;
  } else if (!patient) {
    return <p>loading patient</p>;
  }

  return (
    <main>
      <h2>
        {patient.name} {patient.gender === "female" ? <Female /> : <Male />}
      </h2>
      <p>
        ssh: {patient.ssn}
        <br />
        occupation: {patient.occupation}
      </p>
    </main>
  );
};
