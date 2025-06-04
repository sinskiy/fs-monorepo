import { z } from 'zod'
import { newEntrySchema } from './utils'

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

export type NewPatientEntry = z.infer<typeof newEntrySchema>

export interface Patient extends NewPatientEntry {
  id: string
}

export type PatientWithoutSsn = Omit<Patient, 'ssn'>
