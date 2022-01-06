<template>
  <div class="address-content">
    <el-row :gutter="20" type="flex" justify="start" align="middle">
      <el-col :span="3" :offset="0">
          <LocationMarkerIcon class="rounded-full bg-blue-500 w-full h-full p-3 text-white" />
      </el-col>
      <el-col :span="16" :offset="0">
        <div class="person-text">
          <div class="name">
            {{ address.consignee }}
          </div>
          <div class="phone">
            {{ address.consigneePhone }}
          </div>
        </div>
        <div class="addr-text">
          {{ getAddrText }}
        </div>
      </el-col>
      <el-col :span="5" :offset="0">
        <div class="opt-btns" v-if="isSelect">
          <el-button class="select-btn" circle @click="$emit('select',address.addressId)">
            <PencilIcon class="w-5 h-5 text-blue-500"/>
          </el-button>
        </div>
        <div class="opt-btns" v-else>
          <el-button type="text" size="default" @click="$emit('update',address)">修改</el-button>
          <el-button style="color: #ff0000" type="text" size="default" @click="$emit('delete',address.addressId)">删除</el-button >
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script lang="js">
import {
  LocationMarkerIcon,
  PencilIcon
} from '@heroicons/vue/solid'

export default defineComponent({
  components: {LocationMarkerIcon,PencilIcon},
  props: {
    address: {
      type: Object,
      default: ()=>{return{}}
    },
    isSelect: () => false,
  },
  emits:['select','delete','update'],
  computed: {
    getAddrText() {
      return (
        this.address.province +
        this.address.city +
        this.address.country +
        this.address.street
      );
    },
  },
});
</script>
<style lang="scss" scoped>
.address-content {
  box-shadow: 1px 1px 3px #d9d9d9;
  border-radius: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 25px;
  padding-bottom: 10px;
  margin-top: 25px;
  .el-avatar {
    background: #ff7700;
  }
  .person-text {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    padding-bottom: 20px;
    .name {
      font-size: 18px;
      padding-right: 10px;
    }
    .phone {
      font-size: 12px;
      color: gray;
    }
  }
  .addr-text {
    font-size: 14px;
    text-align: left;
    margin-top: 10px;
  }
  .opt-btns {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .footer {
    margin-top: 15px;
    text-align: left;
  }
  .select-btn {
    color: #FF4400;
    border: none;
    font-size: 20px;
  }
}
</style>