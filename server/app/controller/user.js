const BaseController = require('./base');
const md5 = require('md5');
const jwt = require('jsonwebtoken')

const createRule = {
  email: { type: 'email' },
  nickname: { type: 'string' },
  passwd: { type: 'string' },
  captcha: { type: 'string' },
};

const HashSalt = ':space123';
class UserController extends BaseController {

  async login() {
    
    const { ctx, app } = this
    const { email, captcha, passwd,emailcode } = ctx.request.body

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      console.log(captcha.toUpperCase(),ctx.session.captcha.toUpperCase())
      return this.error('验证码错误');
    }
    if (emailcode !== ctx.session.emailcode) {
      return this.error('邮箱验证错误');
    }

    const user = await ctx.model.User.findOne({
      email,
      passwd:md5(passwd+HashSalt)
    })
    if(!user){
      return this.error('用户名密码错误')
    }

    const token = jwt.sign({
      email,
      _id:user._id
    },app.config.jwt.secret,{
      expiresIn:"1h"
    })
    return this.success({token,email,nickname:user.nickname})
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
    console.log(captcha.toUpperCase())
    console.log(ctx.session.captcha.toUpperCase())
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误');
    }

    if (await this.checkEmail(email)) {
      return this.error('邮箱重复啦');
    } else {
      const ret = await ctx.model.User.create({
        email,
        nickname,
        passwd: md5(passwd + HashSalt),
      });

      if (ret._id) { this.message('注册成功'); }
    }

    // this.success({name:'space'})
  }

  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email });
    console.log('user',user)
    return user;
  }
  async verify() {

  }

  async info() {
    const {ctx} = this
    // const {email} = 
    const {email} = ctx.state
    console.log('infoemail',email)
    const user = await this.checkEmail(email)
    console.log(user)
    this.success(user)
  }
}

module.exports = UserController;
