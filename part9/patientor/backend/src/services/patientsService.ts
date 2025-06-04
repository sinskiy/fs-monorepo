import patientsData from '../../data/patients'
import { NewPatientEntry, Patient, PatientWithoutSsn } from '../types'
import { randomUUID } from 'node:crypto'

const patients = patientsData as Patient[]

const getEntries = (): PatientWithoutSsn[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest)
}

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: randomUUID(),
    ...entry,
  }

  patients.push(newPatientEntry)
  return newPatientEntry
}

export default { getEntries, addPatient }
