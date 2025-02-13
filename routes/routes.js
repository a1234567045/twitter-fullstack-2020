const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')

const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')
const loginController = require('../controllers/loginController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
  }
  res.redirect('/admin/signin')
}

// tweets相關路由
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweetId/replies', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.addTweet)
router.post(
  '/tweets/:tweetId/replies',
  authenticated,
  tweetController.postReplies
)
router.post('/tweets/:tweetId/like', authenticated, tweetController.addLike)
router.post(
  '/tweets/:tweetId/unlike',
  authenticated,
  tweetController.removeLike
)

// User
// signin
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)

router.get('/signin', loginController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  loginController.signIn
)

router.get('/logout', loginController.logOut)

router.get('/admin/signin', adminController.signInPage)
router.post(
  '/admin/signin',
  passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }),
  adminController.signIn
)

router.get('/users/:userId/setting', authenticated, userController.getSetting)
router.put('/users/:userId/setting', authenticated, userController.editSetting)

//routes for follow
router.get(
  '/users/:userId/followings',
  authenticated,
  userController.getFollowings
)
router.get(
  '/users/:userId/followers',
  authenticated,
  userController.getFollowers
)
router.post(
  '/followships',  
  authenticated,
  followshipController.addFollowing
)  //與delete follow傳入值的方法不同
router.delete(
  '/followships/:userId',
  authenticated,
  followshipController.removeFollowing
)

// tweets
router.get('/tweets', authenticated, tweetController.getTweets)

// users
router.get('/users/:userId/tweets', authenticated, userController.getUserTweets)
router.get('/users/:userId/replies', authenticated, userController.getReplies)
router.get('/users/:userId/likes', authenticated, userController.getLikes)

// Admin
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete(
  '/admin/tweets/:tweetId',
  authenticatedAdmin,
  adminController.deleteTweet
)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

// 如果使用者訪問首頁，就導向 /tweets 的頁面
router.get('/', authenticated, (req, res) => {
  res.redirect('/tweets')
})

module.exports = router
