import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    personal: {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      gender: { type: String, default: '' }
    },
    contact: {
      phone: { type: String, required: true },
      address: { type: String, default: '' },
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, required: true }
    },
    auth: {
      password: { type: String, required: true }
    },
    about: {
      description: { type: String, default: '' }
    }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
