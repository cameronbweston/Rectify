import mongoose from 'mongoose'

export {
    Playlist
}

const Schema = mongoose.Schema

const songSchema = new Schema({
    songId: String,
    name: String,
    artist: String,
    mediumImage: String,
})

const playlistSchema = new Schema({
    name: String,
    songs: [songSchema],
    spotifyId: String,
    savedBy: [{type: Schema.Types.ObjectId, ref:"Profile"}]
}, {
    timestamps: true
})

const Playlist = mongoose.model('Playlist', playlistSchema)