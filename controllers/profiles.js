import { Profile } from '../models/profile.js'

export {
    indexFriends,
    showUser
}

function showUser(req, res) {
    Profile.findById(req.user.profile._id)
    .then(profile => {
        res.render('profiles/showUser', {
            title: "My Profile",
            profile
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