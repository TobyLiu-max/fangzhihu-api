const Koa = require('koa')
const path = require('path')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
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

// 启动静态服务器
app.use(koaStatic(path.join(__dirname, 'public')))

// 错误处理
app.use(error())
// 解析body
app.use(koaBody({
    multipart: true, //允许文件格式
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),  //上传文件输出目录 
        keepExtensions: true //保留原始文件名
    }
}))
// 校验参数
app.use(parameter(app))
// 注册路由
registered(app)
app.listen(3000)
console.log('start server http://localhost:3000')
