'use strict';
const svgCaptcha = require('svg-captcha');
const BaseController = require('./base')
const fse = require("fs-extra")

const Controller = require('egg').Controller;

class UtilController extends BaseController {
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.response.type = 'image/svg+xml';
    console.log(captcha);
    this.ctx.body = captcha.data;

  }
  async uploadfile(){
    console.log('enter file upload')
    const {ctx} = this
    const file = ctx.request.files[0]
   
    const {name} = ctx.request.body
    console.log(name,file)
    await fse.move(file.filepath,this.config.UPLOAD_DIR+"/"+file.filename)
    this.success({
      url:`/public/${file.filename}`
    })
    // this.success({
    //   url:'xx'
    // })
  }
  async sendcode(){
    const {ctx} = this
    const email = ctx.query.email
    let code = Math.random().toString().slice(2,6)
    console.log('邮箱'+email+'验证码:'+code)
    ctx.session.emailcode = code

    const subject = 'newspace'
    const text = ''
    const html = `<h2>从姑获鸟</h2><a href="https:www.baidu.com"><span>${code}</span></a>`
    const  hasSend = await this.service.tools.sendMail(email,subject,text,html)
    if(hasSend){
      this.message('发送成功 ')
    }else{
      this.error('发送失败')
    }
  }
}

module.exports = UtilController;
