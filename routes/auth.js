import { Router } from 'express'
import passport from 'passport'

export {
  router
}

const router = Router()


router.get('/spotify', passport.authenticate('spotify', { scope: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private']}))

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    process.env.USER_CODE = req.query.code
    res.redirect('/');
  }
);

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})


