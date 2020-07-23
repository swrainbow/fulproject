<template>
  <div class="login-container">
    <el-form class="login-form" :model="form" :rules="rules" ref="loginForm" label-width="100px">
      <div class="title-container">
        <img src="../assets/logo.png" alt />
      </div>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item prop="captcha" label="验证码" class="captcha-container">
        <div class="captcha" @click="resetCaptcha">
          <img :src="code.captcha" alt />
        </div>
        <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="emailcode" label="邮箱验证码" class="captcha-container">
        <div class="captcha">
          <el-button @click="sendEmailCode" :disabled="send.timer>0" type="primary">{{sendText}}</el-button>
        </div>
        <el-input v-model="form.emailcode" placeholder="请输入邮箱验证码"></el-input>
      </el-form-item>
      <el-form-item prop="passwd" label="密码">
        <el-input v-model="form.passwd" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>

      <el-form-item label>
        <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  layout: "login",
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          console.log("validate success");
          let obj = {
            email: this.form.email,
            nickname: this.form.nickname,
            passwd: this.form.passwd,
            captcha: this.form.captcha,
            emailcode:this.form.emailcode
          };

          let ret = await this.$http.post("/user/login", obj);

          if (ret.code == 0) {
            this.$message.success("login success");
            localStorage.setItem('token',ret.data.token)
            setTimeout(() => {
              this.$router.push("/login");
            }, 500);
          } else {
            console.log("error");
            this.$message.error(`${ret.message}`)
          }
        } else {
        }
      });
    },
    resetCaptcha() {
      this.code.captcha = "/api/captcha?_t=" + new Date().getTime();
      console.log(this.code.captcha);
    },
    async sendEmailCode(){
        this.send.timer = 10
        await this.$http.get('/sendcode?email='+this.form.email)
        this.timer = setInterval(()=>{
            this.send.timer -= 1
            if(this.send.timer === 0){
                console.log("thi.timer",this.timer)
                clearInterval(this.timer)
            }
        },1000)
    }
  },
  computed:{
      sendText(){
          if(this.send.timer <= 0){
              return 'send'
          }
          return `${this.send.timer}s后发送`
      }
  },
  data() {
    return {
      send: {
        timer: 0
      },
      form: {
        email: "534965993@qq.com",
        passwd: "qwer111",
        captcha: ""
      },
      rules: {
        email: [
          { required: true, message: "please input email" },
          { type: "email", message: "please input incrrect format" }
        ],
        captcha: [{ required: true, message: "please input captcha" }],
        passwd: [
          {
            required: true,
            pattern: /^[\w_-]{6,12}$/g,
            message: "please input pd"
          }
        ],
        emailcode:[{
            required:true,message:"请输入邮箱验证码"
        }]
      },
      code: {
        captcha: "/api/captcha"
      }
    };
  }
};
</script>

<style lang="stylus" ></style>