<template>
  <div v-loading="onPlaceOrder" :element-loading-text="placeOrderMsg">
    <el-affix class="bar-affix" position="top">
      <div class="bottom-bar">
        <el-row :gutter="10" type="flex" justify="start" align="middle">
          <el-col :span="18" :offset="0"></el-col>
          <el-col :span="0.5" :offset="0">
            <div style="font-size: 13px; color: grey; padding-top: 10px;">总价</div>
          </el-col>
          <el-col :span="2" :offset="0">
            <div
              style="color: #FF4400; font-weight: bold; height: 100%; padding-top: 5px;"
            >￥{{ paidPrice }}</div>
          </el-col>
          <el-col :span="1" :offset="0">
            <el-button type="primary" size="small" @click="settelOrder">确认</el-button>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" size="small" @click="$router.push('/shopcar')">取消</el-button>
          </el-col>
          <el-col :span="1" :offset="0"></el-col>
        </el-row>
      </div>
    </el-affix>
    <div v-loading="loadingAddr">
      <address-view
        v-if="defaultAddr"
        style="width: 30%; margin: 10px auto;"
        :isSelect="true"
        :address="defaultAddr"
        @select="selectAddress"
      />
      <div class="text-center" v-else>
        <el-button
          type="text"
          size="default"
          @click="$router.push('/main/address')"
        >您还没有设定地址，请点击前往设置。</el-button>
      </div>
    </div>
    <div style="margin: 0 auto; width: 40%;">
      <order-view v-for="o in orders" :key="o.shop.shopId" :isSettle="true" :orderVo="o" />
    </div>
    <el-dialog title="选择地址" v-model="showAllAddr" width="50%">
      <span>
        <el-scrollbar v-if="allAddrs.length > 0" height="500px">
          <address-view
            v-for="item,i in allAddrs"
            :key="i"
            style="width: 70%; margin: 10px auto;"
            :isSelect="true"
            :address="item"
            @select="changeAddr(item)"
          />
        </el-scrollbar>
        <el-empty v-else description="没有地址信息" />
      </span>
    </el-dialog>
  </div>
</template>
<script lang="js">
import AddressView from '@/components/AddressView.vue';
import OrderView from '@/components/OrderView.vue';
import { ElMessage } from 'element-plus';
import store from '@/store';

export default defineComponent({
  components: { OrderView, AddressView },
  data() {
    return {
      orders: [],
      paidPrice: 0,
      defaultAddr: null,
      allAddrs: [],
      carIds: [],
      showAllAddr: false,
      onPlaceOrder: false,
      loadingAddr: true,
      orderNo: 0,
    }
  },
  computed: {
    placeOrderMsg() {
      return `正在生成订单..${this.orderNo}/${this.orders.length}`
    }
  },
  methods: {
    async getDefaultAddr() {
      //request
      try {
        this.loadingAddr = true
        var defAddr = store.state.defAddr;
        if(defAddr == null) {
          let user = await api.getUserInfo(store.state.id)
          this.defaultAddr = await api.getIRI(user.defaultAddress["@id"])
          store.commit("setDefAddr", this.defaultAddr)
        } else {
          this.defaultAddr = defAddr;
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingAddr = false
      }
    },
    async getAllAddresses() {
      try {
        let res = await api.getAddresses({})
        this.allAddrs = res.list
      } catch (error) {
        console.log(error)
        ElMessage.error(error.msg)
      }
    },
    async clearCars() {
      this.carIds.forEach(id => {
        api.removeShopCar(id);
      })
    },
    changeAddr(addr) {
      this.defaultAddr = addr;
      this.showAllAddr = false;
    },
    settleAllOrder() {
      this.orders.forEach(async i => {
        var order = {
          address: this.defaultAddr.province+this.defaultAddr.city+this.defaultAddr.country+this.defaultAddr.street,
          details: i.details.map(t => {
            return {
              good: t.good["@id"],
              productSize: t.productSize
            }
          })
        }
        await api.addOrder(order)
        this.orderNo++
      })
    },
    async settelOrder() {
      this.onPlaceOrder = true;
      try {
        await this.settleAllOrder()
        this.clearCars()
        this.$router.push("/main/orderlist")
      } catch (error) {
        console.log(error)
        ElMessage.error(error.msg)
      } finally {
        this.onPlaceOrder = false;
      }
    },
    getOrdersFromCarItems(carItems) {
      var orderMap = new Map();
      carItems.forEach(item => {
        if (item.carId) {
          this.carIds.push(item.carId);
        }
        var price = Number.parseFloat(item.good.salePrice) * Number.parseInt(item.productSize)
        if (!orderMap.has(item.good.product.shop.shopId)) {
          orderMap.set(item.good.product.shop.shopId, {
            shop: item.good.product.shop,
            totalPrice: price + item.good.product.shop.expressPrice,
            details: [item]
          })
        } else {
          var order = orderMap.get(item.good.product.shop.shopId)
          order.details.push(item)
          order.totalPrice += price;
          order.totalPrice = Math.round(order.totalPrice * 100) / 100;
        }
        this.paidPrice += price;
        this.paidPrice = Math.round(this.paidPrice * 100) / 100;
      });
      this.orders = [...orderMap.values()];
      console.log(this.orders)
    },
    selectAddress() {
      if (this.allAddrs.length == 0) {
        this.getAllAddresses();
      }
      this.showAllAddr = true;
    }
  },
  mounted() {
    if (this.$route.params.data) {
      this.getOrdersFromCarItems(JSON.parse(this.$route.params.data))
      this.getDefaultAddr();
    }
  }
})
</script>
<style lang="">
  
</style>