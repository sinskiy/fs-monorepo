import { Schema, model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
  },
  books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
})

schema.plugin(uniqueValidator)

export default model('Author', schema)
