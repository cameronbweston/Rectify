import { Router } from "express";
import * as profilesCtrl from '../controllers/profiles.js'

export {
    router
}

const router = Router()

router.get('/friends', profilesCtrl.indexFriends)