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
  password: { type: String, required: true, select: false },
  avatar_url: { type: String },
  gender: {
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true
  },
  headline: { type: String },
  locations: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  },
  business: { type: Schema.Types.ObjectId, ref: 'Topic', select: false },
  employments: {
    type: [
      {
        company: { type: Schema.Types.ObjectId, ref: 'Topic' },
        job: { type: Schema.Types.ObjectId, ref: 'Topic' }
      }
    ],
    select: false
  },
  educations: {
    type: [
      {
        school: { type: Schema.Types.ObjectId, ref: 'Topic' },
        major: { type: Schema.Types.ObjectId, ref: 'Topic' },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduation_year: { type: Number }
      }
    ],
    select: false
  },
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    select: false
  },
  followingTopics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    select: false
  }
})

module.exports = model('User', usersSchema)
