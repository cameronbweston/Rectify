import mongoose from "mongoose";
import { Profile } from '../models/profile.js'
import { Playlist } from '../models/playlist.js'

export {
    indexFriends,
    details,
    add,
    remove
}

function remove(req, res) {
    Profile.findById(req.user.profile)
    .then(profile => {
      profile.friends.remove(req.params.id)
      profile.save()
      .then(()=> {
        res.redirect(`/friends/${req.params.id}`)
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
}

function add(req, res) {
    Profile.findById(req.user.profile)
    .then(profile => {
      profile.friends.push(req.params.id)
      profile.save()
      .then(()=> {
        res.redirect(`/friends/${req.params.id}`)
      })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
  }

function details(req, res) {
    Profile.findById(req.user.profile._id)
    .then(userProfile => {
        Profile.findById(req.params.id)
        .then(profile => {
            Playlist.find({ savedBy: req.params.id })
            .then(playlists => {
                res.render('friends/details', {
                    title: 'Profile Details',
                    profile,
                    playlists,
                    userProfile
                })
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