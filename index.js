const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter');
const registered = require('./routes')
const app = new Koa()
// const myError = async (ctx, next) => {
//     try {
//         await next()
//     } catch (error) {
//         //处理逻辑
//     }
// }

// 错误处理
app.use(error())
// 解析body
app.use(bodyParser())
// 校验参数
app.use(parameter(app))
// 注册路由
registered(app)
app.listen(3000)
console.log('start server http://localhost:3000')
