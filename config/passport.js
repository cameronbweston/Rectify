import passport from 'passport'
import { Strategy as SpotifyStrategy } from 'passport-spotify'
import { User } from '../models/user.js'
import { Profile } from '../models/profile.js'


passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK
    },
    function (accessToken, refreshToken, profile, done) {
      //store tokens if they are returned:
      process.env.ACCESS_TOKEN = accessToken
      process.env.REFRESH_TOKEN = refreshToken
      //console.log(`access token: ${process.env.ACCESS_TOKEN} refresh token: ${process.env.REFRESH_TOKEN}`)
      User.findOne({ spotifyId: profile.id }, function (err, user) {
        if (err) return done(err)
        if (user) {
          return done(null, user)
        } else {
            let getAvatar;
            if(profile._json.images[0].url != null) {
              getAvatar = profile._json.images[0].url
            }
            else {
              getAvatar = '/images/placeholderAvatar.png'
            }
            const newProfile = new Profile({
              name: profile._json.display_name,
              avatar: getAvatar,
          })
          //console.log(profile)
          const newUser = new User({
            email: profile._json.email,
            spotifyId: profile.id,
            profile: newProfile._id,
            refreshToken: refreshToken
          })
          newProfile.save(function (err) {
            if (err) return done(err)
          })
          newUser.save(function (err) {
            if (err) {
              // Something went wrong while making a user - delete the profile
              // we just created to prevent orphan profiles.
              Profile.findByIdAndDelete(newProfile._id)
              return done(err)
            }
            return done(null, newUser)
          })
        }
      })
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, done) {
  User.findById(id)
  .populate('profile', 'name avatar')
  .exec(function(err, user) {
    done(err, user)
  })
})
