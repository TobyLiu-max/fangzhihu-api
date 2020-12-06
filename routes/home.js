const Router = require('koa-router')
const { index } = require('../controller/home')
const router = new Router()



router.get('/', index)

module.exports = router