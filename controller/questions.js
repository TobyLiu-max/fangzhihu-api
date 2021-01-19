const Question = require('../model/questions')

class QuestionsCtr {
  async find(ctx) {
    const { pre_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1
    const perPage = Math.max(pre_page * 1, 1)
    const q = new RegExp(ctx.query.q)
    //  $or  多个字段模糊匹配
    ctx.body = await Question.find({ $or: [{ title: q }, { description: q }] })
      .limit(perPage)
      .skip(page * perPage)
  }

  //   检查问题是否存在
  async checkQuestionExist(ctx, next) {
    const question = await Question.findById(ctx.params.id).select(
      '+questioner'
    )
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.state.question = question
    await next()
  }

  async findById(ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields
      .split(';')
      .filter((f) => f)
      .map((f) => ' +' + f)
      .join('')
    const question = await Question.findById(ctx.params.id)
      .select(selectFields)
      .populate('questioner')
    ctx.body = question
  }

  async create(ctx) {
    console.log('question-1')
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    const question = await new Question({
      ...ctx.request.body,
      questioner: ctx.state.user._id
    }).save()
    if (!question) {
      ctx.throw('500', '新建问题失败')
    }
    ctx.body = question
  }

  async update(ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    const question = await ctx.state.question.update(ctx.request.body)
    if (!question) {
      ctx.throw('500', '修改问题失败')
    }
    ctx.body = {
      code: 200
    }
  }

  // 删除问题
  async delete(ctx) {
    await Question.findByIdAndDelete(ctx.params.id)
    ctx.body = {
      code: 200,
      message: '删除成功'
    }
  }

  // 检查是不是当前用户
  async checkQuestioner(ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
}

module.exports = new QuestionsCtr()
