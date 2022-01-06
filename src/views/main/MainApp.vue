<template>
  <el-container direction="vertical">
    <el-affix :offset="0">
    <el-header style="background: white;" height="fit-content">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="3">
          <el-image :src="getImage('logo_main.png')" fit="fill" :lazy="true" @click="$router.push('/')"></el-image>
        </el-col>
        <el-col :span="4">
          <el-menu mode="horizontal" :default-active="$route.path" router>
            <el-menu-item index="/main/index" key="0">首页</el-menu-item>
            <el-menu-item index="/main/search" key="3">搜索</el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="12">
          <el-input @change="toSearch" style="width: 45vw;" v-model="keyword" placeholder="搜索商品" clearable/>
        </el-col>
        <el-col :span="2" :offset="2">
          <div class="flex justify-start px-5 space-x-5" v-if="isLogin()">
            <el-button circle @click="$router.push('/main/shopcar')" class="w-8">
              <ShoppingCartIcon class="w-4 h-4 text-blue-500"></ShoppingCartIcon>
            </el-button>
            <el-button circle @click="$router.push('/main/userinfo')" class="w-8"> 
              <UserIcon class="w-4 h-4 text-blue-500"></UserIcon>
            </el-button>     
          </div>
          <div v-else class="right-coner-btn-group">
            <el-button type="text" @click="goLogin">登录 & 注册</el-button>
          </div>
        </el-col>
      </el-row>
    </el-header>
    </el-affix>
    <el-container direction="vertical">
      <el-main height="100%">
        <!-- Main content -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import {ShoppingCartIcon, UserIcon} from "@heroicons/vue/solid"

export default {
  components: {ShoppingCartIcon, UserIcon},
  data() {
    return {
      keyword: '',
    }
  },
  mounted() {
  },
  methods: {
    isLogin() {
      return this.$store.state.token != null
    },
    goLogin() {
      this.$router.push("/login")
    },
    toSearch(val) {
      if(val) {
        this.$router.push('/main/search?keyword='+val);
      }
    }
  },
  watch: {
    $route(to) {
    },
  }
}
</script>
<style scoped>
.el-pagination {
  margin-top: 30px;
}

.right-coner-btn-group {
  display: flex;
  justify-content: space-around;
}

.bottom-bar {
  width: 100%;
  height: fit-content;
  background: #fff1ec;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
