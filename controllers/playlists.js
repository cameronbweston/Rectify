import mongoose from "mongoose";
import axios from 'axios'
import { resolveInclude } from "ejs";

export {
    create
}

function create(req, res) {

    axios.all([
        axios.get('https://api.spotify.com/v1/search?q=John%20Mayer&type=artist', {
                    headers: {
                    Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
                    }
        }),
        axios.get('https://api.spotify.com/v1/search?q=Daft%20Punk&type=artist', {
                headers: {
                Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
                }
        }),
        axios.get('https://api.spotify.com/v1/search?q=Jim%20Croce&type=artist', {
            headers: {
            Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
            }
        })
    ])
    .then(axios.spread((...responses) => {
        console.log(responses[0].data.artists.items[0].id)
        console.log(responses[1].data.artists.items[0].id)
        console.log(responses[2].data.artists.items[0].id)
        const artistIds =[]

        artistIds.push(responses[0].data.artists.items[0].id)
        artistIds.push(responses[1].data.artists.items[0].id)
        artistIds.push(responses[2].data.artists.items[0].id)
        
        return artistIds
    }))
    .then((artistIds) => {
        let id = artistIds[0]
        axios.get(`https://api.spotify.com/v1/artists/${id}`, {
            headers: {
            Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
            }
        })
        .then(req => {
            console.log(req.data)
        })
        .catch(err => {
            console.log(err)
        })
    })

}

function findSpotifyArtistIds() {

}