<template>
  <div>
    <el-dialog title="修改密码" v-model="changePwd" width="30%">
      <span>
        <el-form
          :model="subject"
          label-width="80px"
          :inline="false"
          size="normal"
        >
          <el-form-item label="旧密码">
            <el-input
              style="width: 70%"
              v-model="subject.oldPrimary"
              placeholder="请输入旧密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" size="normal">
            <el-input
              style="width: 70%"
              v-model="subject.newPrimary"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </span>
      <template #footer>
        <el-button @click="changePwd = false">取消</el-button>
        <el-button type="primary" @click="updatePwd">修改</el-button>
      </template>
    </el-dialog>
  </div>
  <div style="width: 80%; margin: 0 auto">
    <el-row gutter="40">
      <el-col class="left-content" :span="5">
        <el-form>
          <el-form-item>
            <el-upload
              class="
                avatar-uploader
                text-center
                leading-10
                flex
                justify-center
                items-center
                mx-auto
              "
              action="/api/uploads/image"
              :show-file-list="false"
              with-credentials
              :on-success="uploadAvatarSuccess"
            >
              <el-avatar
                v-if="userInfo.avatarUrl"
                icon="el-icon-user-solid"
                shape="circle"
                :src="userInfo.avatarUrl"
                fit="fit"
              />
              <i v-else>
                <PlusIcon class="w-10 h-10 text-gray-500" />
              </i>
            </el-upload>
          </el-form-item>
          <div class="control">
            <el-form-item>
              <el-button size="default" @click="$router.push('/main/orderlist')"
                ><TicketIcon
                  class="w-5 h-5 text-blue-500 mx-1"
                />我的订单</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button size="default" @click="$router.push('/main/address')"
                ><LocationMarkerIcon
                  class="w-5 h-5 text-blue-500 mx-1"
                />地址管理</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button size="default" @click="$router.push('/main/shopcar')">
                <ShoppingCartIcon
                  class="w-5 h-5 text-blue-500 mx-1"
                />购物车</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button size="default" @click="$router.push('/main/collection')">
                <CollectionIcon class="w-5 h-5 text-blue-500 mx-1"/>
                收藏夹
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="default" @click="logout">
                <LogoutIcon class="w-5 h-5 text-blue-500 mx-1" />
                退出登录
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col class="right-content" :span="14">
        <el-form :model="userInfo" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="userInfo.username" readonly> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" size="normal">
            <el-input
              v-model="userInfo.email"
              size="normal"
              readonly
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" size="normal">
            <el-input
              v-model="userInfo.nickName"
              placeholder="昵称"
              size="normal"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">更新资料</el-button>
            <el-button type="text" @click="changePwd = true">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="js">
import {
  PlusIcon,
  LogoutIcon,
  CollectionIcon,
  ShoppingCartIcon,
  TicketIcon,
  LocationMarkerIcon,
} from "@heroicons/vue/solid";

export default defineComponent({
  components: {
    PlusIcon,
    LogoutIcon,
    CollectionIcon,
    ShoppingCartIcon,
    TicketIcon,
    LocationMarkerIcon,
  },
  data() {
    return {
      changePwd: false,
      userInfo: {},
      categories: [],
      subject: {
        oldPrimary: "",
        newPrimary: "",
        oldCode: "",
        newCode: "",
      },
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getCategories() {},
    async getUserInfo() {
      try {
        this.userInfo = await api.getUserInfo(this.$store.state.id);
      } catch (error) {}
    },
    async updateUserInfo() {
      try {
        await api.patchUserInfo(this.userInfo);
      } catch (error) {
        console.log(error.msg);
      }
    },
    async updatePwd() {
      try {
        await api.updatePwd(this.subject.newPrimary, this.subject.oldPrimary)
        ElMessage.success("更改成功，请重新登陆")
        this.logout();
      } catch (error) {
        ElMessage.error(error.msg)
      }
    },
    uploadAvatarSuccess(resp) {
      this.userInfo.avatarUrl = resp.url;
      this.userInfo.avatar = resp.name;
      this.updateUserInfo();
    },
    logout() {
      this.$store.commit("clear");
      this.$router.push("/main");
    },
  },
});
</script>
<style lang="scss" scoped>
.left-content {
  .el-button {
    width: 70%;
    margin-left: auto !important;
    margin-right: auto !important;
  }

  .control {
    padding-top: 30px;
    padding-bottom: 20px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
  }
  .el-avatar {
    width: 250px;
    height: 250px;
  }
  .avatar-uploader {
    width: 250px;
    height: 250px;
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    .el-upload {
      height: 250px;
    }
  }
}
.shop-uploader {
  .shop-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 120px;
    text-align: center;
  }
  .el-upload {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
  }
}
.right-content {
  padding-top: 5%;
  .el-form-item {
    width: 60%;
    margin: 40px auto;
    .el-input {
      width: 60%;
    }
    .el-textarea {
      width: 70%;
    }
  }
  .el-button {
    margin: 10px;
  }
  overflow: hidden;
}
</style>