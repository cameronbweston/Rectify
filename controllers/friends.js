import mongoose from "mongoose";
import { Profile } from '../models/profile.js'

export {
    indexFriends
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