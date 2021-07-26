import { Router } from "express";
import * as friendsCtrl from '../controllers/friends.js'
import { Profile } from "../models/profile.js";
export {
    router
}

const router = Router()

router.get('/', isLoggedIn, friendsCtrl.indexFriends)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/spotify");
  }