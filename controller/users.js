const jsonwebtoken = require('jsonwebtoken')
const Users = require('../modal/users')
const { secret } = require('../config')

class UsersCtr {
  async find(ctx) {
    // ctx.body = await Users.find()
    const { pre_page = 2 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(pre_page * 1, 1)
    ctx.body = await Users.find()
      .limit(perPage)
      .skip(page * perPage)
  }
  async findById(ctx) {
    const id = ctx.params.id
    try {
      const { fields = '' } = ctx.query
      const selectFields = fields
        .split(';')
        .filter((f) => f)
        .map((f) => ' +' + f)
        .join('')
      const user = await Users.findById(id).select(selectFields)
      ctx.body = user
    } catch (error) {
      ctx.throw(404, '用户不存在')
    }
  }
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const body = ctx.request.body
    // 查询数据库有没有这个用户，如果有就提示已经存在这个用户
    const repeatedUser = await Users.findOne({ name: body.name })
    if (repeatedUser) {
      ctx.throw(409, '用户已经存在 ')
    }
    const user = await new Users(body).save()
    ctx.body = user
  }

  async del(ctx) {
    const id = ctx.params.id
    try {
      const user = await Users.findByIdAndDelete(id)
      ctx.body = user
    } catch (error) {
      ctx.throw(404, '用户不存在')
    }
  }

  async checkOwner(ctx, next) {
    // 检查是不是当前用户
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }

  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    const id = ctx.params.id
    const body = ctx.request.body
    console.log('body', body)
    try {
      const user = await Users.findByIdAndUpdate(id, body)
      ctx.body = user
    } catch (error) {
      ctx.throw(404, '用户不存在')
    }
  }

  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const body = ctx.request.body
    const user = await Users.findOne(body)
    // 查询用户时候注册
    if (!user) {
      ctx.throw(401, '用户或密码不存在 ')
    }
    const { _id, name } = user
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = {
      token
    }
  }

  // 获取关注列表
  async listFollowing(ctx) {
    const user = await Users.findById(ctx.params.id)
      .select('following')
      .populate('following')
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user.following
  }

  //添加关注
  async follow(ctx) {
    const me = await Users.findById(ctx.state.user._id).select('following')
    console.log('me', me)
    // 如果没有被关注就可以关注，已经关注了就不能在关注
    if (!me.following.map((id) => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
      ctx.body = {
        code: 200,
        message: '关注成功'
      }
    } else {
      ctx.throw(409, '用户已关注')
    }
  }

  // 取消关注
  async unfollow(ctx) {
    const me = await Users.findById(ctx.state.user._id).select('following')
    console.log('me', me)
    // 如果没有被关注就可以关注，已经关注了就不能在关注
    const index = me.following.map((id) => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
      ctx.body = {
        code: 200,
        message: '取消成功'
      }
    } else {
      ctx.throw(404, '用户不存在 ')
    }
  }

  //   检查用户是否存在
  async checkUserExist(ctx, next) {
    console.log(111)
    try {
      const user = await Users.findById(ctx.params.id)
      if (!user) {
        ctx.throw(404, '用户不存在')
      }
    } catch (error) {
      console.log('user')
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  //  获取粉丝列表
  async listFollowers(ctx) {
    const users = await Users.find({ following: ctx.params.id })
    ctx.body = users
  }
}

module.exports = new UsersCtr()
