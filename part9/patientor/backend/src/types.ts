import { z } from 'zod'
import {
  newEntrySchema,
  newHealthCheckEntrySchema,
  newHospitalEntrySchema,
  newOccupationHealthcareEntrySchema,
  newPatientSchema,
} from './utils'
export interface Diagnosis {
  code: string
  name: string
  latin?: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

interface EntryBase {
  id: string
  diagnosisCodes?: Array<Diagnosis['code']>
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

type NewHospitalEntry = z.infer<typeof newHospitalEntrySchema>
type NewHealthCheckEntry = z.infer<typeof newHealthCheckEntrySchema>
type NewOccupationHealthcareEntry = z.infer<
  typeof newOccupationHealthcareEntrySchema
>
type HospitalEntry = NewHospitalEntry & EntryBase
type HealthCheckEntry = NewHealthCheckEntry & EntryBase
type OccupationalHealthcareEntry = NewOccupationHealthcareEntry & EntryBase

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry

export type NewEntry = z.infer<typeof newEntrySchema>

export type NewPatient = z.infer<typeof newPatientSchema>

export interface Patient extends NewPatient {
  id: string
  entries: Entry[]
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>
