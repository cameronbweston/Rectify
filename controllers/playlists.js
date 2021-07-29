import mongoose from "mongoose";
import axios from 'axios'
import { Playlist } from "../models/playlist.js";

//Random playlist names so we can add some spice to our playlist titles
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
    
    //store all songs in array so we can add them to API call
    songsToAdd.forEach(track => {
        trackIds.push(track.songId)
    })

    //save headers and reuse them for all API calls
    const reqHeaders = {
        headers: {
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
        }
    }

    //Create body of url 
    const makePlaylistBody = {
        "name": "Rectify - " + playlistName,
        "description": "Your recommended songs from Rectify",
        "public": false
    }

    //Make call to create a blank playlist
    axios.post(`https://api.spotify.com/v1/users/${spotifyId}/playlists`, makePlaylistBody, reqHeaders)
    .then((response) => {
        let newPlaylistId = response.data.id
        let trackURIString = ''
        console.log("step 1")
        //Build string of tracks to comply with request format
        for (let i = 0; i < trackIds.length; i++) {
            if(i == trackIds.length - 1){
                trackURIString += trackIds[i]
            }
            else {
                trackURIString += trackIds[i]
                trackURIString += '%2Cspotify%3Atrack%3A'
            }
        }
        console.log(`step 2`)
        //Finally, we make the call to the API to add this playlist to the user profile
        axios.post(`https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks?uris=spotify%3Atrack%3A${trackURIString}`, {}, reqHeaders)
        .then(() => {
            //Also save it in our MongoDB so user can view what they have saved
            console.log('step 3')
            save(originalReq)
                console.log('step 4')
                res.render('index', {
                    title: "Rectify"
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

    req.body.savedBy = req.user.profile._id
    req.body.name = req.body.playlistName
    req.body.songs = parsed
    req.body.spotifyId = '' 
    //Don't need to check if it's been created, theoretically all playlists should be random and unique
    Playlist.create(req.body)
    .then(() => {
        return
    })
    .catch(err => {
        console.log(err)
    })
}

function create(req, res) {
    let artist1 = req.query.firstArtist
    let artist2 = req.query.secondArtist
    let artist3 = req.query.thirdArtist
    let numberOfTracks = req.query.numberOfTracks ? req.query.numberOfTracks : 15
    let genres = req.query.genres
    
    //Format artists to comply with request format
    artist1.replace('/ /g', "%20")
    artist2.replace('/ /g', "%20")
    artist3.replace('/ /g', "%20")

    let reqHeaders = {
        headers: {
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
        }
    }
    //Get the 3 artists ids so we can build playlist with them
    axios.all([
        axios.get(`https://api.spotify.com/v1/search?q=${artist1}&type=artist`, reqHeaders),
        axios.get(`https://api.spotify.com/v1/search?q=${artist2}&type=artist`, reqHeaders),
        axios.get(`https://api.spotify.com/v1/search?q=${artist3}&type=artist`, reqHeaders)
    ])
    .then(axios.spread((...responses) => {
        const artistIds =[]
        //Add these artist ids to our array
        artistIds.push(responses[0].data.artists.items[0].id, responses[1].data.artists.items[0].id, responses[2].data.artists.items[0].id)
        
        return artistIds
    }))
    .then((artistIds) => {
        //Finally, we get our randomized playlists with all of the variables the user has entered in our form...
        axios.get(`https://api.spotify.com/v1/recommendations?limit=${numberOfTracks}&market=ES&seed_artists=${artistIds[0]}%2C${artistIds[1]}%2C${artistIds[2]}`, reqHeaders)
        .then(listOfTracks => {
            //Store our 10 song objects
            const recommendedRandomPlaylist = []

            listOfTracks.data.tracks.forEach(track => {
                //Create song objects for each of our tracks and store them in our playlist array
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
    })

}
