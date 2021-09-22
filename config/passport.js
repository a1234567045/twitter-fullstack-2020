const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

// setup passport strategy
passport.use(
  new LocalStrategy(
    // customize user field
    {
      usernameField: 'account',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    (req, account, password, cb) => {
      console.log('================')
      console.log('進入passport authenticate user')
      User.findOne({ where: { account } }).then(user => {
        if (!user)
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號或密碼輸入錯誤')
          )
        if (!bcrypt.compareSync(password, user.password))
          return cb(null, false, req.flash('error_messages', '密碼輸入錯誤！'))
        return cb(null, user)
      })
    }
  )
)

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  console.log('================')
  console.log('正在進行serialize')
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  console.log('================')
  console.log('正在進行deserialize')
  User.findByPk(id, {
    include: [
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' },
      { model: Tweet, as: 'LikedTweets' }
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport
