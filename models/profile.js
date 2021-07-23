import mongoose from 'mongoose'

export {
  Profile
}

const Schema = mongoose.Schema

const profileSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  bio: String,
  friends: [{ type: Schema.Types.ObjectId, ref: 'Profile'}],
  //playlists: [{type: Schema.Types.ObjectId, ref: 'Playlists'}]
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)