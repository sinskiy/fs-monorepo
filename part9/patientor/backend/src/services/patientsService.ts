import patientsData from '../../data/patients'
import { NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types'
import { randomUUID } from 'node:crypto'

const patients = patientsData

const getEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest)
}

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(patient => patient.id === id)
  return patient
}

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: randomUUID(),
    entries: [],
    ...entry,
  }

  patients.push(newPatient)
  return newPatient
}

const addEntry = (patient: Patient, entry: NewEntry): Patient => {
  patient.entries.push({ ...entry, id: randomUUID() })
  return patient
}

export default { getEntries, findById, addPatient, addEntry }
