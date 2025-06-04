import { AxiosError } from 'axios'

export const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError && typeof error.response?.data === 'string') {
    return error.response.data
  } else if (error instanceof Error) {
    return error.message
  } else {
    return 'unexpected error'
  }
}
