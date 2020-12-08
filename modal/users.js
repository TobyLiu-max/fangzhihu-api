// 连接数据库
const mongoose = require('mongoose')
const { model, Schema } = mongoose

mongoose.connect('mongodb://localhost:27017/zhihu', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useFindAndModify', false)
const db = mongoose.connection

db.on('error', (err) => {
    console.log('数据库连接失败')
})

db.once('open', function () {
    console.log('数据库连接成功')
})

const usersSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false }
})

module.exports = model('user', usersSchema)