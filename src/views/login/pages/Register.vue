<template>
  <div>
    <el-form
      :model="regForm"
      ref="regform"
      :rules="regRule"
      label-width="fit-content"
      label-position="top"
      :inline="true"
      size="normal"
      style="text-align: left"
    >
      <el-form-item label="账号" prop="username" style="width: 45%">
        <el-popover
          trigger="focus"
          width="fit-content"
          content="由英文数字组成"
          placement="top-end"
        >
          <template #reference>
            <el-input
              v-model="regForm.username"
              placeholder="用户名"
            ></el-input>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="密码" prop="pass" style="width: 45%">
        <el-popover
          placement="top-end"
          width="fit-content"
          trigger="focus"
          content="至少使用英文和数字组成"
        >
          <template #reference>
            <el-input
              type="password"
              v-model="regForm.password"
              placeholder="密码"
            />
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPass" style="width: 45%">
        <el-input
          type="password"
          v-model="comfirmPwd"
          placeholder="再次输入密码"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email" style="width: 45%">
        <el-input
          type="email"
          v-model="regForm.email"
          placeholder="输入邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱验证码" prop="emailCode" style="width: 45%">
        <el-row :gutter="20">
          <el-col :span="15" :offset="0"
            ><el-input
              v-model="regForm.emailCode"
              placeholder="输入验证码"
            ></el-input
          ></el-col>
          <el-col :span="9" :offset="0"
            ><el-button type="primary" size="small" @click="sendCode"
              >发送</el-button
            ></el-col
          >
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          style="margin-top: 50%; margin-left: 50%"
          type="primary"
          @click="onSubmit"
          >立即注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="js">
export default {
  data() {
    return {
      regRule: {
        username: {
          trigger: "blur",
          require: true,
          validator: this.validateName,
        },
        pass: {
          trigger: "blur",
          require: true,
          validator: this.validatePass,
        },
        comfirmPass: {
          trigger: "blur",
          require: true,
          validator: this.validateComfirmPass,
        },
        email: {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change'],
          require: true,
        },
        emailCode: { trigger: "blur", require: true },
      },
      regForm: {
        username: "",
        email: "",
        password: "",
        emailCode: "",
        phone: "",
        phoneCode: "",
      },
      comfirmPwd: "",
    };
  },
  methods: {
    onSubmit() {
      this.validCall(this.$refs.regform, async ()=>{
        try {
          await api.register(this.regForm);
          ElMessage.success("注册成功");
          this.$router.push("/login/login")
        } catch (e) {
          ElMessage.error(e.response.data.message);
        }
      })
    },
    sendCode() {
      this.validCall(this.$refs.regform, async ()=>{
        let resp = await api.sendEmailCode(this.regForm.email);
        console.log(resp)
      })
    },
    validateRegex(value, callback) {
      let isMatch = value.match(/[a-zA-Z]+[0-9]+/);
      if (!isMatch) {
        callback("至少使用英文和数字组成");
      } else {
        if (this.comfirmPwd !== "") {
          this.$refs.regform.validateField("comfirmPass");
        }
        callback();
      }
    },
    validateName(rule, value, callback) {
      this.validateRegex(this.regForm.username, callback);
    },
    validatePass(rule, value, callback) {
      this.validateRegex(this.regForm.password, callback);
    },
    validateComfirmPass(rule, value, callback) {
      if (this.regForm.password !== this.comfirmPwd) {
        callback("两次密码输入不一致");
      } else {
        callback();
      }
    },
  },
};
</script>
<style lang="scss">
</style>