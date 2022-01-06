<template>
  <div style="margin: 0 auto; width:30%;" v-loading="loading">
    <div v-if="addrs.length == 0">
      <el-button type="text" size="default" disabled>暂无地址信息</el-button>
    </div>
    <div style="text-align: right; margin: 25px;">
      <el-button round type="primary" size="default" @click="addNewAddr = true">添加新地址</el-button>
    </div>
    <el-radio-group v-model="defaultAddrId" @change="changeDefaultAddr" style="width: 100%">
      <address-view
      v-for="addr in addrs"
      :key="addr.addressId"
      :address="addr"
      @delete="deleteAddr"
      @update="updateAddress"
      >
        <template #footer>
          <el-radio :label="addr.addressId">默认地址</el-radio>
        </template>
      </address-view>
    </el-radio-group>   
  </div> 
  <el-dialog
    :title="updateAddr ? '修改地址' : '添加新地址'"
    v-model="addNewAddr"
    width="40%">
    <span>
      <el-form :model="newAddr" label-width="80px" :inline="true" size="normal">
        <el-form-item label="收货人">
          <el-input v-model="newAddr.consignee" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="newAddr.consigneePhone" placeholder="电话号码"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" class="addr-select">
          <el-select v-model="newAddr.province" @change="selectProvice">
            <el-option 
            v-for="opt in provinceOptions"
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.label" />
          </el-select>省
          <el-select v-model="newAddr.city" @change="selectCity">
            <el-option 
            v-for="opt in cityOptions"
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.label" />
          </el-select>市
          <el-select v-model="newAddr.country">
            <el-option 
            v-for="opt in countryOptions"
            :key="opt.value" 
            :label="opt.label" 
            :value="opt.label" />
          </el-select>县/区
        </el-form-item>
        <el-form-item label="详细地址" size="normal">
          <el-input 
          class="addr-street"
          :autosize="{ minRows: 2, maxRows: 4}" 
          type="textarea" 
          v-model="newAddr.street" 
          placeholder="街道、村落、门牌号"/>
        </el-form-item>
        <!-- <el-form-item class="addr-setdef">
          <el-checkbox v-model="newAddr.isDefault" :label="true">设为默认地址</el-checkbox>
        </el-form-item> -->
      </el-form>
    </span>
    <template #footer>
      <el-button @click="addNewAddress">确认</el-button>
      <el-button type="primary" @click="addNewAddr = false; newAddr={};">取消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="js">
import AddressView from '@/components/AddressView.vue'
import {provinceDataList, cityDataMap, countryDataMap, textCodeMap} from '@/js/area-data'

export default defineComponent({
  components: { AddressView },
  data() {
    return {
      defaultAddrId: 1,
      addNewAddr: false,
      updateAddr: false,
      newAddr: {},
      provinceOptions: provinceDataList,
      cityOptions: [],
      countryOptions: [],
      addrs: [],
      loading: true,
    }
  },
  mounted() {
    this.getAddrs();
  },
  methods: {
    async changeDefaultAddr(value) {
      try {
        let addr = await api.setDefaultAddress(value);
        this.defaultAddrId = value;
        store.commit("setDefAddr", addr)
      } catch (error) {
        ElMessage.error(error.msg);
      }
    },
    async addNewAddress() {
      try {
        var addr = {}
        if(this.updateAddr) {
          addr = await api.updateAddress(this.newAddr)
        } else {
          addr = await api.addAddress(this.newAddr);
          this.addrs.push(addr)
        }
        this.addNewAddr = false;
      } catch (error) {
        console.debug(error)
        ElMessage.error(error.msg)
      }
    },
    async deleteAddr(id) {
      try {
        await api.removeAddress(id);
        ElMessage.success("删除成功")
      } catch (error) {
        ElMessage.error(error.msg);
      }
    },
    async getAddrs() {
      try {
        this.loading = true
        this.addrs = (await api.getAddresses()).list || [];
        if(this.addrs.length > 0){
          this.userInfo = await api.getUserInfo(store.state.id);
          if(this.userInfo.defaultAddress){
            this.defaultAddrId = this.userInfo.defaultAddress.addressId;
          }
        }
      } catch (error) {
        ElMessage.error(error.msg)
      } finally {
        this.loading = false;
      }
    },
    async updateAddress(addr) {
      this.newAddr = addr;
      this.updateAddr = this.addNewAddr = true;
      this.setCityOptions(addr.province)
      this.setCountryOptions(addr.city)
    },
    selectProvice(item) {
      this.newAddr.city = '';
      this.newAddr.country = '';
      if(item == undefined || item == null || item == "") {
        this.cityOptions = [];
        this.countryOptions = [];
        return;
      }
      this.setCityOptions(item)
    },
    setCityOptions(province) {
      let code = textCodeMap.get(province);
      this.cityOptions = cityDataMap.get(code);
    },
    setCountryOptions(city) {
      let code = textCodeMap.get(city);
      this.countryOptions = countryDataMap.get(code);
    },
    selectCity(item) {
      this.newAddr.country = '';
      if(item == undefined || item == null || item == "") {
        this.countryOptions = [];
        return;
      }
      this.setCountryOptions(item);
    }
  }
})
</script>
<style lang="scss" scoped>
.addr-select {
  .el-select {
    width: 130px;
    padding-right: 10px;
    padding-left: 10px;
  }
}
.addr-street {
  width: 495px;
  padding: 0 10px;
}
.addr-setdef {
  margin: 0 20px;
  text-align: left;
  width: 465px;
}
</style>