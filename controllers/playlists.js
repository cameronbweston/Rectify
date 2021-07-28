import mongoose from "mongoose";
import axios from 'axios'
import { Playlist } from "../models/playlist.js";
import { User } from "../models/user.js";

const playlistNames = ['In My Feels Playlist', 'Rad Mix Playlist', 'Chill Beats Playlist', 'Soul Soother Playlist', 'Pump Up Playlist', "Crunchy Grooves Playlist", 'Rainy Day Playlist', 'Awesome Day Playlist', 'Sad Girl Playlist', 'Happy Mood Playlist', 'Buttery Smooth Jams', 'Sonic Funk Jams']

const playlistVerbs = ['To Dance To', 'To Cry To', 'To Beat The Depression', 'To Cure Anxiety', 'To Cook With', 'To Drive To', 'For the Gym', 'For Getting Over Your Ex', 'For Your Commute']

export {
    create,
    save,
    details,
    deletePlaylist as delete,
    showAllPlaylists,
    addToUserSpotify
}

function addToUserSpotify (req, res) {
    const originalReq = req
    const spotifyId = req.user.spotifyId
    const songsToAdd = JSON.parse(req.body.playlist)
    const playlistName = req.body.playlistName
    const trackIds = []
    
    //console.log(`user: ${req.user}`)
    songsToAdd.forEach(track => {
        trackIds.push(track.songId)
    })
    //console.log(`trackIds: ${trackIds}`)

    const reqHeaders = {
        headers: {
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
        }
    }

    const makePlaylistBody = {
        "name": "Rectify - " + playlistName,
        "description": "Your recommended songs from Rectify",
        "public": false
    }

    axios.post(`https://api.spotify.com/v1/users/${spotifyId}/playlists`, makePlaylistBody, reqHeaders)
    .then((response) => {
        let newPlaylistId = response.data.id
        let trackURIString = ''
        
        for (let i = 0; i < trackIds.length; i++) {
            if(i == trackIds.length - 1){
                trackURIString += trackIds[i]
            }
            else {
                trackURIString += trackIds[i]
                trackURIString += '%2Cspotify%3Atrack%3A'
            }
        }
        console.log(`body url: ${trackURIString}`)
        axios.post(`https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks?uris=spotify%3Atrack%3A${trackURIString}`, { }, reqHeaders)
        .then(() => {
            save(originalReq)
        })
        .then(() => {
            res.render('index', {
                title: "Home Page"
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
}

function showAllPlaylists(req, res) {
    Playlist.find({ savedBy: req.user.profile._id })
    .sort( { _id: -1 })
    .then(playlists => {
        res.render('playlists/showAllPlaylists', {
            title: "My Profile",
            playlists
        })
    })
}

function deletePlaylist(req, res) {
    Playlist.findByIdAndDelete(req.params.id)
    .then(( ) => {
        Playlist.find({ savedBy: req.user.profile._id })
        .sort( { _id: -1 })
        .then(playlists => {
            res.render(`playlists/showAllPlaylists`,{
                title: "My Profile",
                playlists
            })
        })
    })
    .catch(err => {
        console.log(err)
        res.render(`playlists/details`, {
            title: "My Profile"
        })
    })
}

function details(req, res) {
    Playlist.findById(req.params.id)
    .populate('savedBy')
    .sort( { _id: -1 })
    .then(playlist => {
        console.log(playlist)
        console.log(req.user)
        res.render('playlists/details', {
            title: playlist.name,
            playlist,
            user: req.user
        })
    })
}

function save(req) {
    let parsed = JSON.parse(req.body.playlist)

    // Add id of the logged in user to req.body for creating a game for the first time (if it doesn't exist in the database)
    req.body.savedBy = req.user.profile._id
    req.body.name = req.body.playlistName
    req.body.songs = parsed
    req.body.spotifyId = '' 

    Playlist.create(req.body)
}

function create(req, res) {
    console.log(req.query.firstArtist)
    let artist1 = req.query.firstArtist
    let artist2 = req.query.secondArtist
    let artist3 = req.query.thirdArtist
    artist1.replace('/ /g', "%20")
    artist2.replace('/ /g', "%20")
    artist3.replace('/ /g', "%20")

    let reqHeaders = {
        headers: {
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
        }
    }
    axios.all([
        axios.get(`https://api.spotify.com/v1/search?q=${artist1}&type=artist`, reqHeaders),
        axios.get(`https://api.spotify.com/v1/search?q=${artist2}&type=artist`, reqHeaders),
        axios.get(`https://api.spotify.com/v1/search?q=${artist3}&type=artist`, reqHeaders)
    ])
    .then(axios.spread((...responses) => {
        // console.log(responses[0].data.artists.items[0].id)
        // console.log(responses[1].data.artists.items[0].id)
        // console.log(responses[2].data.artists.items[0].id)
        const artistIds =[]

        artistIds.push(responses[0].data.artists.items[0].id, responses[1].data.artists.items[0].id, responses[2].data.artists.items[0].id)
        
        return artistIds
    }))
    .then((artistIds) => {

        axios.get(`https://api.spotify.com/v1/recommendations?limit=15&market=ES&seed_artists=${artistIds[0]}%2C${artistIds[1]}%2C${artistIds[2]}`, reqHeaders)
        .then(listOfTracks => {
            //console.log(listOfTracks.data.tracks)

            //Store our 10 song objects
            const recommendedRandomPlaylist = []

            listOfTracks.data.tracks.forEach(track => {
                // console.log(track.id)
                // console.log(`image url: ${track.album.images[0].url}`)
                // console.log(track.album.artists[0].name)
                // console.log(track.name)
                
                let song = {
                    songId: track.id,
                    name: track.name,
                    artist: track.album.artists[0].name,
                    mediumImage: track.album.images[1].url
                }
                recommendedRandomPlaylist.push(song)
            })
            return recommendedRandomPlaylist
        })
        .then(recommendedRandomPlaylist => {
            //console.log(recommendedRandomPlaylist)

            //Generate a rad playlist name
            const randomPlaylistName = playlistNames[Math.floor(Math.random()*playlistNames.length)] + " " + playlistVerbs[Math.floor(Math.random()*playlistVerbs.length)]

            res.render('playlists/showPlaylist', {
                title: "Here is your new playlist! <3",
                recommendedRandomPlaylist, 
                randomPlaylistName
            })
        })
    })
    .catch(err => {
        console.log(err)
        //res.redirect('/')
    })

}
