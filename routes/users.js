const Router = require('koa-router')
const { find, findById, create, del, update } = require('../controller/users')
const router = new Router()

router.get('/users', find)

router.get('/users/:id', findById)

router.post('/users', create)

router.delete('/users/:id', del)

router.patch('/users/:id', update)

module.exports = router