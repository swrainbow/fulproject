const BaseController = require('./base');
const md5 = require('md5');

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
};

const HashSalt = ':space123';
class UserController extends BaseController {

  async login() {

  }

  async register() {
    const { ctx } = this;
    try {
      ctx.validate(createRule);
    } catch (error) {
      return this.error('参数校验', -1, e.errors);
    }

    const { email, passwd, captcha, nickname } = ctx.request.body;
    console.log({ email, passwd, captcha, nickname });
    if (captcha.toUpperCase() == ctx.session.captcha.toUpperCase()) {
      if (await this.checkEmail(email)) {
        this.error('邮箱重复啦');
      } else {
        const ret = await ctx.model.User.create({
          email,
          nickname,
          passwd: md5(passwd + HashSalt),
        });

        if (ret._id) { this.message('注册成功'); }
      }
    } else {
      this.error('验证码错误');
    }
    // this.success({name:'space'})
  }

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
  }
  async verify() {

  }

  async info() {

  }
}

module.exports = UserController;
