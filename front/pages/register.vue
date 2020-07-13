<template>
    <div class="login-container">
        <el-form class="login-form" :model="form" :rules="rules" ref="registerForm" label-width="100px">
            <div class="title-container">
                <img src="../assets/logo.png" alt="">

            </div>
            <el-form-item prop="email" label="邮箱">
                <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

              <el-form-item prop="captcha" label="验证码" class="captcha-container">
                  <div class="captcha">
                      <img :src="code.captcha" alt="" @click="resetCaptcha">
                  </div>
                <el-input v-model="form.captcha" placeholder="请输入邮箱"></el-input>
            </el-form-item>
             <el-form-item props="nickname" label="昵称">
                <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
            </el-form-item>
             <el-form-item prop="passwd"  label="密码">
                <el-input v-model="form.passwd" type="password" placeholder="请输入密码"></el-input>
            </el-form-item>
             <el-form-item prop="repasswd"  label="确认密码">
                <el-input v-model="form.repasswd" type="password" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click.native.prevent="handleRegister">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import md5 from "md5"
    export default {
        layout:'login',
        methods: {
            handleRegister() {
                this.$refs.registerForm.validate(async valid=>{
                    if(valid){
                        console.log('validate success')
                        let obj = {
                            email:this.form.email,
                            nickname:this.form.nickname,
                            passwd:this.form.passwd,
                            captcha:this.form.captcha
                        }

                        let ret = await this.$http.post('/user/register',obj)

                        if(ret.code == 0){
                            this.$alert('注册成功','成功',{
                                confirmButtonText:"去登陆",
                                callback:()=>{
                                    this.$router.push("/login")
                                }
                            })
                        }else{
                            console.log('error')
                            // this.$message.error()
                        }
                    }else{
                        
                    }
                })
            },
            resetCaptcha(){
                this.code.captcha = '/api/captcha?_t='+new Date().getTime
            }
        },
        data(){
            return {
                form:{
                    email:"534965993@qq.com",
                    nickname:"space",
                    passwd:"qwer111",
                    repasswd:"qwer111",
                    captcha:''
                },
                rules:{
                    email:[
                        {required:true,message:"please input email"},
                        {type:'email',message:"please input incrrect format"}
                    ],
                    captcha:[
                        {required:true,message:"please input captcha"},
                    ],
                    nickname:[
                        {required:true,message:"please input nickname"}
                    ],
                    passwd:[
                        {required:true,pattern:/^[\w_-]{6,12}$/g,message:"please input pd"}
                    ],
                    repasswd:[
                        {required:true,message:"please input pd aggain"},
                        {validator:(rule,value,callback)=>{
                            if(value !== this.form.passwd){
                                callback(new Error('pd doesnt match'))
                            }
                            callback()
                        }}
                    ]
                },
                code:{
                    captcha:"/api/captcha"
                }
            }
        }
    }
</script>

<style lang="stylus" >

</style>