class HomeCtr {
    index(ctx) {
        ctx.body = 'Hello World'
    }
}

module.exports = new HomeCtr()