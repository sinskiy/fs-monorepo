import {
  Response,
  Router,
  RequestHandler,
  ErrorRequestHandler,
  Request,
} from 'express'
import { z } from 'zod'
import { NewPatientEntry, Patient, PatientWithoutSsn } from '../types'
import patientsService from '../services/patientsService'
import { newEntrySchema } from '../utils'

const patientsRouter = Router()

patientsRouter.get('/', (_req, res: Response<PatientWithoutSsn[]>) => {
  res.json(patientsService.getEntries())
})

const newPatientParse: RequestHandler = (req, _res, next) => {
  try {
    newEntrySchema.parse(req.body)
    next()
  } catch (error) {
    next(error)
  }
}

patientsRouter.post(
  '/',
  newPatientParse,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedEntry = patientsService.addPatient(req.body)
    res.json(addedEntry)
  }
)

const errorMiddleware: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues })
  } else {
    next(error)
  }
}
patientsRouter.use(errorMiddleware)

export default patientsRouter
