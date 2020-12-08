const path = require('path')

class HomeCtr {
    index(ctx) {
        ctx.body = 'Hello World'
    }
    upload(ctx) {
        const file = ctx.request.files.file
        const basename = path.basename(file.path)
        ctx.body = { url: `${ctx.origin}/uploads/${basename}` }
    }
}

module.exports = new HomeCtr()