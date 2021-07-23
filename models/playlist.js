import mongoose from 'mongoose'

export {
    Playlist
}

const Schema = mongoose.Schema

const songSchema = new Schema({
    artist: String,
    songTitle: String
})

const playlistSchema = new Schema({
    name: String,
    songs: [songSchema],
    SpotifyId: String
}, {
    timestamps: true
})

const Playlist = mongoose.model('Playlist', playlistSchema)