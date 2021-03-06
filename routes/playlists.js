import { Router } from "express";
import * as playlistCtrl from '../controllers/playlists.js'
export {
    router
}

const router = Router()


router.get('/show', isLoggedIn, playlistCtrl.showAllPlaylists)
router.get('/create', isLoggedIn, playlistCtrl.create)
router.get('/details/:id', isLoggedIn, playlistCtrl.details)
router.delete('/:id', isLoggedIn, playlistCtrl.delete)
router.post('/addToUserSpotify', isLoggedIn, playlistCtrl.addToUserSpotify)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/spotify");
  }