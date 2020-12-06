const Users = require('../modal/users')

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
            name: 'string',
            age: 'number'
        });
        const body = ctx.request.body
        console.log('body-create', body)
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
    async update(ctx) {
        const id = ctx.params.id
        const body = ctx.request.body
        try {
            const user = await Users.findByIdAndUpdate(id, body)
            ctx.body = user
        } catch (error) {
            ctx.throw(404, '用户不存在')
        }
    }

}

module.exports = new UsersCtr()