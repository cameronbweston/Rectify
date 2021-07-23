import mongoose from 'mongoose'

export {
  User
}

const userSchema = new mongoose.Schema(
  {
    email: String,
    spotifyId: String,
    profile: {type: mongoose.Schema.Types.ObjectId, ref: "Profile"}
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
