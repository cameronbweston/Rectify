import { Profile } from '../models/profile.js'
import { Playlist } from '../models/playlist.js'

export {
    indexFriends,
    showUser
}


function showUser(req, res) {
    Playlist.find({ savedBy: req.user.profile._id })
    .then(playlists => {
        res.render('profiles/showUser', {
            title: "My Profile",
            playlists
        })
    })
}

function indexFriends(req, res) {
    Profile.find({})
    .then(profiles => {
        res.render('profiles/indexFriends', {
            title: "Add some friends",
            profiles
        })
    })
}