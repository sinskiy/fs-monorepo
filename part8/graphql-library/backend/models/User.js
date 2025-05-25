import mongoose, { Schema } from 'mongoose'

const schema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
  },
  favoriteGenre: {
    type: String,
    required: true,
  },
})

export default mongoose.model('User', schema)
