import 'dotenv/config'

const config = {
  PORT: process.env.PORT,
  MONGODB_URL:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URL
      : process.env.MONGODB_URL,
}
export default config
