import { z } from 'zod'
import { Gender, HealthCheckRating } from './types'

const ssnRegex = /^(?!000|666|9\d{2})\d{3}-\d{2}-\d{4}$/

export const newPatientSchema = z.object({
  name: z.string().nonempty(),
  ssn: z.string().regex(ssnRegex),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().nonempty(),
})

export const newEntryBaseSchema = z.object({
  description: z.string().nonempty(),
  date: z.string().date(),
  specialist: z.string().nonempty(),
  diagnosisCodes: z.array(z.string()).optional(),
})

export const newHospitalEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().date(),
    criteria: z.string().nonempty(),
  }),
})

export const newOccupationHealthcareEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().nonempty(),
  sickLeave: z
    .object({ startDate: z.string().date(), endDate: z.string().date() })
    .optional(),
})

export const newHealthCheckEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
})

export const newEntrySchema = newHospitalEntrySchema.or(
  newOccupationHealthcareEntrySchema.or(newHealthCheckEntrySchema)
)
