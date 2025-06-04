import { Response, Router } from 'express'
import { Diagnosis } from '../types'
import diagnosesService from '../services/diagnosesService'

const diagnosesRouter = Router()

diagnosesRouter.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.json(diagnosesService.getEntries())
})

export default diagnosesRouter
