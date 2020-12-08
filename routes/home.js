const Router = require('koa-router')
const { index, upload } = require('../controller/home')
const router = new Router()



router.get('/', index)

router.post('/upload', upload)

module.exports = router 