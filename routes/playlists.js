import { Router } from "express";
import * as playlistCtrl from '../controllers/playlists.js'
export {
    router
}

const router = Router()

router.get('/create', isLoggedIn, playlistCtrl.create)
router.post('/savePlaylist', isLoggedIn, playlistCtrl.save)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/spotify");
  }