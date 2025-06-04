import patientsData from '../../data/patients'
import { NewPatientEntry, NonSensitivePatient, Patient } from '../types'
import { randomUUID } from 'node:crypto'

const patients = patientsData as Patient[]

const getEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _ssn, ...rest }) => rest)
}

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(patient => patient.id === id)
  return patient
}

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: randomUUID(),
    entries: [],
    ...entry,
  }

  patients.push(newPatientEntry)
  return newPatientEntry
}

export default { getEntries, findById, addPatient }
