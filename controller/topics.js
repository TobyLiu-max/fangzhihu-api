const jsonwebtoken = require('jsonwebtoken')
const Topic = require('../model/topics')
const Users = require('../model/users')
class TopicsCtr {
  async find(ctx) {
    // ctx.body = await Topic.find()
    // 分页
    // limit 返回数量
    // skip 返回起点
    const { pre_page = 2 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(pre_page * 1, 1)
    // 添加模糊搜索，mongodb 会自动去匹配q参数
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) })
      .limit(perPage)
      .skip(page * perPage)
  }

  //   检查话题是否已关注
  async checkTopicExist(ctx, next) {
    const user = await Topic.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ' +' + f)
      .join('')
    console.log('selectFields', selectFields)
    // introduction  只展示introduction
    //+introduction  在原来的基础上添加introduction
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    ctx.body = topic
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }

  //  获取话题列表
  async listTopicFollowers(ctx) {
    const users = await Users.find({ followingTopics: ctx.params.id })
    ctx.body = users
  }
}

module.exports = new TopicsCtr()
