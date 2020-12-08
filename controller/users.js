const jsonwebtoken = require('jsonwebtoken')
const Users = require('../modal/users')
const { secret } = require('../config')

class UsersCtr {
    async find(ctx) {
        ctx.body = await Users.find()
    }
    async findById(ctx) {
        const id = ctx.params.id
        try {
            const user = await Users.findById(id)
            ctx.body = user
        } catch (error) {
            ctx.throw(404, '用户不存在')
        }
    }
    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });
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
            password: { type: 'string', required: false }
        });
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
        });
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

}

module.exports = new UsersCtr()