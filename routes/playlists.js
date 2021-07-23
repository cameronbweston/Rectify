import { Router } from "express";
import * as playlistCtrl from '../controllers/playlists.js'
export {
    router
}

const router = Router()

router.get('/create', playlistCtrl.create)