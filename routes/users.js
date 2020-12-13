const Router = require('koa-router')
const jwt = require('koa-jwt')
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const {
  find,
  findById,
  create,
  del,
  update,
  login,
  checkOwner,
  listFollowing,
  follow,
  unfollow,
  listFollowers,
  checkUserExist
} = require('../controller/users')
const router = new Router()

// const auth = async (ctx, next) => {
//     const { authorization } = ctx.request.header
//     const token = authorization.replace('Bearer ', '')
//     try {
//         const user = jsonwebtoken.verify(token, secret)
//         // 把用户信息存在ctx.state上面
//         ctx.state.user = user
//     } catch (error) {
//         ctx.throw(401, error.message)
//     }
//     await next()
// }

const auth = jwt({ secret })

router.get('/users', find)

router.get('/users/:id', findById)

router.post('/users', create)

router.delete('/users/:id', auth, checkOwner, del)

router.patch('/users/:id', auth, checkOwner, update)

router.post('/users/login', login)

router.get('/:id/following', listFollowing)

router.put('/following/:id', auth, checkUserExist, follow)

router.delete('/following/:id', auth, checkUserExist, unfollow)

router.get('/:id/followers', listFollowers)

module.exports = router
