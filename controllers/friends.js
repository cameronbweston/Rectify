import mongoose from "mongoose";
import { Profile } from '../models/profile.js'
import { Playlist } from '../models/playlist.js'

export {
    indexFriends,
    details
}

function details(req, res) {
    Profile.findById(req.params.id)
    .then(profile => {
        Playlist.find({ savedBy: req.params.id })
        .then(playlists => {
            res.render('friends/details', {
                title: 'Profile Details',
                profile,
                playlists
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
}

function indexFriends(req, res) {
    Profile.find({})
    .then(profiles => {
        res.render('friends/indexFriends', {
            title: "Add some friends",
            profiles
        })
    })
}