import mongoose from "mongoose";
import axios from 'axios'

export {
    create
}

function create(req, res) {
    axios.get('https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg', {
        headers: {
        Authorization: 'Bearer ' + process.env.ACCESS_TOKEN //the token is a variable which holds the token
        }
    })
    .then(response => {
        console.log(response.data)
    })
    .catch(err => {
        console.log(err)
    })
}