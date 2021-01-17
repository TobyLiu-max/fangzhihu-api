// 连接数据库
const mongoose = require('mongoose')
const { model, Schema } = mongoose

mongoose.connect('mongodb://localhost:27017/zhihu', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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
  avatar_url: { type: String },
  introduction: { type: String, select: false }
})

module.exports = model('Topic', usersSchema)
