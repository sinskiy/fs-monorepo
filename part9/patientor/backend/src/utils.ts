import { z } from 'zod'
import { Gender } from './types'

const ssnRegex = /^(?!000|666|9\d{2})\d{3}-\d{2}-\d{4}$/

export const newEntrySchema = z.object({
  name: z.string().nonempty(),
  ssn: z.string().regex(ssnRegex),
  dateOfBirth: z.string().date(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().nonempty(),
})
