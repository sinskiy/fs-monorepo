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

const newEntryBaseSchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
})

const newHospitalEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
})

const newOccupationHealthCareEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('OccupationalHealthCare'),
  employerName: z.enum(['HyPD', 'FBI']),
  sickLeave: z
    .object({ startDate: z.string(), endDate: z.string() })
    .optional(),
})

const newHealthCheckEntrySchema = newEntryBaseSchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
})

export const newEntrySchema = newHospitalEntrySchema
  .or(newOccupationHealthCareEntrySchema)
  .or(newHealthCheckEntrySchema)
