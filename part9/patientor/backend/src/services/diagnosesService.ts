import diagnosesData from '../../data/diagnoses'
import { Diagnosis } from '../types'

const diagnoses = diagnosesData

const getEntries = (): Diagnosis[] => {
  return diagnoses
}

export default { getEntries }
