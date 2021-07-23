import 'dotenv/config.js'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import createError from 'http-errors'
import session from 'express-session'
import logger from 'morgan'
import methodOverride from 'method-override'
import passport from 'passport'
import { passUserToView } from './middleware/middleware.js'

// create the express app
const app = express()

// connect to MongoDB with mongoose
import('./config/database.js')

// load passport
import('./config/passport.js')

// require routes
import { router as indexRouter } from './routes/index.js'
import { router as authRouter } from './routes/auth.js'
import { router as profilesRouter } from './routes/profiles.js'
import { router as playlistsRouter } from './routes/playlists.js'

// view engine setup
app.set(
  'views',
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'views')
)
app.set('view engine', 'ejs')

// middleware
app.use(methodOverride('_method'))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
  )
)

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
    }
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// custom middleware
app.use(passUserToView)
//fetch or refresh access token
// let resp = fetchAccessToken()
// console.log(resp)

// router middleware
app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/profiles', profilesRouter)
app.use('/playlists', playlistsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// function fetchAccessToken() {
//     // method: "POST",
//     // url: "https://accounts.spotify.com/api/token",
//   let body = `grant_type=authorization_code&code=${process.env.USER_CODE}&redirect_uri=${process.env.SPOTIFY_CALLBACK}&client_id=${process.env.SPOTIFY_CLIENT_ID}&client_secret${process.env.SPOTIFY_SECRET}`

//   //POST request for token
//   app.post('https://accounts.spotify.com/api/token' + body, function(req, res) {
//     req.header = 
//     console.log(req.query)
//     //console.log(res.body)
//     return req.body
//   })
// }

// function AuthorizationApi(body) {

// }

// function handleAuthorization() {

// }

export { app }