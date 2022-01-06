<template>
  <el-container>
    <el-header height="5%" style="text-align: left">
      <el-image :src="getImage('logo_main.png')" @click="goMain" />
    </el-header>
    <el-main
      class="mt-20"
      :style="{
        backgroundImage: `url(${getImage('login_back.png')})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: '100%',
        width: '100%',
      }"
    >
      <el-card
        class="body-card"
        shadow="always"
        :body-style="{ padding: '10px' }"
      >
        <template #header>
          <div class="text-center text-blue-500 text-3xl">{{ $route.meta.title }}</div>
        </template>
        <router-view />
        <div class="mt-6 mx-auto w-fit">
          <router-link v-if="$route.path == '/login/login'" to="/login/register"
            ><el-link type="primary"
              >没有账号？点击立即注册</el-link
            ></router-link
          >
          <router-link v-if="$route.path == '/login/register'" to="/login/login"
            ><el-link type="primary"
              >已有账号？点击立即登录</el-link
            ></router-link
          >
        </div>
      </el-card>
    </el-main>
  </el-container>
</template>
<script lang="js">
export default {
  methods: {
    goMain() {
      this.$router.push("/main")
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
.body-card {
  padding: 10px;
  height: fit-content;
  width: fit-content;
  margin-top: 3%;
  margin-bottom: 3%;
  margin-left: 60%;
  margin-right: 10%;
  transition: width 0.8 ease;
}

.info-footer {
  margin: 0 auto;
  padding-top: 75px;
  .p {
    color: gray;
  }
}
</style>
