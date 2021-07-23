import { Profile } from '../models/profile.js'

export {
    indexFriends
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