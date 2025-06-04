import {
  Response,
  Router,
  RequestHandler,
  ErrorRequestHandler,
  Request,
} from 'express'
import { z } from 'zod'
import { NewEntry, NewPatient, NonSensitivePatient, Patient } from '../types'
import patientsService from '../services/patientsService'
import { newEntrySchema, newPatientSchema } from '../utils'

const patientsRouter = Router()

patientsRouter.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientsService.getEntries())
})

const newPatientParse: RequestHandler = (req, _res, next) => {
  try {
    newPatientSchema.parse(req.body)
    next()
  } catch (error) {
    next(error)
  }
}

patientsRouter.post(
  '/',
  newPatientParse,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.addPatient(req.body)
    res.json(addedPatient)
  }
)

patientsRouter.get('/:id', (req, res) => {
  const patient = patientsService.findById(req.params.id)
  if (patient) {
    res.json(patient)
  } else {
    res.status(404).json({ error: 'patient not found' })
  }
})

const newEntryParse: RequestHandler = (req, _res, next) => {
  try {
    newEntrySchema.parse(req.body)
    next()
  } catch (error) {
    next(error)
  }
}

patientsRouter.post(
  '/:id/entries',
  newEntryParse,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Patient | { error: string }>
  ) => {
    const patient = patientsService.findById(req.params.id)
    if (!patient) {
      res.status(404).json({ error: 'patient not found' })
      return
    }

    const changedPatient = patientsService.addEntry(patient, req.body)
    res.json(changedPatient)
  }
)

const errorMiddleware: ErrorRequestHandler = (error, _req, res, next) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues })
  } else {
    next(error)
  }
}
patientsRouter.use(errorMiddleware)

export default patientsRouter
