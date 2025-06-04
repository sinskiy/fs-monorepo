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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export type NewPatientEntry = z.infer<typeof newEntrySchema>

export interface Patient extends NewPatientEntry {
  id: string
  entries: Entry[]
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>
