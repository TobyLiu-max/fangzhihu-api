const Router = require('koa-router')
const jwt = require('koa-jwt')
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  update,
  listTopicFollowers,
  checkTopicExist
} = require('../controller/topics')
const router = new Router({ prefix: '/topics' })

const auth = jwt({ secret })

router.get('/', find)

router.get('/:id', findById)

router.post('/', auth, checkTopicExist, create)

router.patch('/:id', auth, checkTopicExist, update)

router.get('/:id/followingTopics', checkTopicExist, listTopicFollowers)

module.exports = router
