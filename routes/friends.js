import { Router } from "express";
import * as friendsCtrl from '../controllers/friends.js'

export {
    router
}

const router = Router()

router.get('/remove/:id', isLoggedIn, friendsCtrl.remove)
router.get('/add/:id', isLoggedIn, friendsCtrl.add)
router.get('/:id', isLoggedIn, friendsCtrl.details)
router.get('/', isLoggedIn, friendsCtrl.indexFriends)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/spotify");
  }