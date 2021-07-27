import { Router } from "express";
import * as profilesCtrl from '../controllers/profiles.js'

export {
    router
}

const router = Router()

router.get('/', isLoggedIn, profilesCtrl.index)

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/auth/spotify");
  }