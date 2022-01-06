<template>
  <div class="login-content">
    <el-form :model="loginForm" ref="form" :rules="rules" label-width="50px" label-position="left" :inline="false" size="normal">
      <el-form-item label="账号" prop="username">
        <el-input v-model="loginForm.username" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input show-password v-model="loginForm.password" placeholder="输入密码"></el-input>
      </el-form-item>
    </el-form>
    <div class="text-center my-10">
      <el-button type="primary" size="normal" @click="onSubmit">登录</el-button>
    </div>
  </div>
</template>
<script lang="js">
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      rules: {
        username: {
          trigger: "blur",
          require: true,
        },
        password: {
          trigger: 'blur',
          require: true
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    async onSubmit() {
      try {
        let resp = await api.login(this.loginForm)
        ElMessage.success("登录成功");
        this.$store.commit("setUser", resp)
        this.$router.push("/main/search")
      } catch (error) {
        ElMessage.error("账号或密码错误"); 
      }
    }
  },
}
</script>
<style lang="scss" scope>
.login-content {
  height: 100%;
  min-width: 320px;
  margin: 0 auto;
  .el-form-item {
    margin: 20px 25px;
  }
  .verify-fi {
    .el-form-item__content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
}
</style>