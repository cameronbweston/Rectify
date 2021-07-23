import mongoose from "mongoose";
import axios from 'axios'
import { resolveInclude } from "ejs";

export {
    create
}

const playlistNames = ['In my feels', 'Rad Mix', 'Bonkers', 'Soul Soother']

function create(req, res) {
    let reqHeaders = {
        headers: {
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
        }
    }
    axios.all([
        axios.get('https://api.spotify.com/v1/search?q=John%20Mayer&type=artist', reqHeaders),
        axios.get('https://api.spotify.com/v1/search?q=Daft%20Punk&type=artist', reqHeaders),
        axios.get('https://api.spotify.com/v1/search?q=Jim%20Croce&type=artist', reqHeaders)
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

        axios.get(`https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_artists=${artistIds[0]}%2C${artistIds[1]}%2C${artistIds[2]}`, reqHeaders)
        .then(listOfTracks => {
            console.log(listOfTracks.data.tracks)

            //Store our 10 song objects
            const recommendedRandomPlaylist = []

            listOfTracks.data.tracks.forEach(track => {
                console.log(track.id)
                console.log(`image url: ${track.album.images[0].url}`)
                console.log(track.album.artists[0].name)
                console.log(track.name)
                
                let song = {
                    songId: track.id,
                    songName: track.name,
                    artistName: track.album.artists[0].name,
                    imageUrl: track.album.images[0].url
                }
                recommendedRandomPlaylist.push(song)

                // res.render('playlists/showPlaylist', {
                //     recommendedRandomPlaylist, 
                // })
            })
        })
        .then(recommendedRandomPlaylist => {
            res.render('playlists/showPlaylist', {
                recommendedRandomPlaylist, 
            })
        })
    })
    .catch(err => {
        console.log(err)
        //res.redirect('/')
    })

}

function findSpotifyArtistIds() {

}