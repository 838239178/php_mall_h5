<template>
  <el-affix v-if="shopCars.list.length > 0" class="bar-affix" position="top">
    <div class="bottom-bar">
      <div class="flex justify-end items-center space-x-10 px-16">
        <div style="font-size: 13px; color: grey; padding-top: 10px;">总价</div>
        <div
          style="color: #FF4400; font-weight: bold; height: 100%; padding-top: 5px;"
        >￥{{ totalPrice }}</div>
        <el-button type="primary" @click="goSettle">结算</el-button>
      </div>
      <GoodSelectDialog v-model="openSelector" :propKeys="tempPropKyes" @change-good="changeGood" />
    </div>
  </el-affix>
  <div style="margin: 0 auto; width: 40%;" v-loading="loading">
    <div v-if="shopCars.list.length > 0">
      <shop-car-view
        v-for="(car, index) in shopCars.list"
        :key="index"
        :car="car"
        @change-good="handleChangeCarGood"
        @change-size="reCalcTotalPrice"
        @select-item="selectItem"
        @delete-item="removeItem"
      />
      <div class="w-full text-center mt-8">
        <el-pagination
          hide-on-single-page
          v-model:current-page="dto.page"
          :page-size="10"
          layout="prev, pager, next, jumper"
          :total="shopCars.total"
          background
          :pager-count="3"
        ></el-pagination>
      </div>
    </div>
    <div v-else>
      <el-empty description="购物车空空如也，快去加购吧"></el-empty>
    </div>
  </div>
</template>
<script lang="js">
import ShopCarView from '@/components/ShopCarView.vue'
import GoodSelectDialog from '@/components/GoodSelectDialog.vue';

export default defineComponent({
  data() {
    return {
      shopCars: {
        list: [],
        total: 0,
      },
      loading: true,
      selectedList: [],
      itemIndex: {},
      tempPropKyes: [],
      tempShopCar: {},
      openSelector: false,
      totalPrice: 0.00,
      dto: {
        page: 1,
        "order[createTime]": null,
      },
    }
  },
  components: {
    ShopCarView,
    GoodSelectDialog,
  },
  mounted() {
    this.getShopCars();
  },
  watch: {
    "dto.page"() {
      this.getShopCars();
    }
  },
  methods: {
    async handleCars(list) {
      let shopDict = {}
      for (var idx in list) {
        var i = list[idx];
        let shop = i.good.product.shop
        let temp = shopDict[shop.shopId]
        if (temp) {
          temp.items.push(i)
        } else {
          shopDict[i.good.product.shop.shopId] = {
            shop: shop,
            items: [i]
          };
        }
      }
      this.shopCars.list = Object.values(shopDict);
    },
    async getShopCars() {
      try {
        this.loading = true
        let cars = await api.getShopCars(this.dto)
        this.shopCars.total = cars.total;
        this.handleCars(cars.list)
      } catch (error) {
        console.log(error)
        ElMessage.error(error.msg)
      } finally {
        this.loading = false
      }
    },
    selectItem(checked, car, item) {
      if (checked) {
        this.selectedList.push(item);
        this.totalPrice += Number.parseFloat(item.good.salePrice) * Number.parseInt(item.productSize);
      } else {
        var idx = this.selectedList.findIndex(i => i.good.product.productId == item.good.product.productId);
        this.selectedList.splice(idx, 1);
        this.totalPrice -= Number.parseFloat(item.good.salePrice) * Number.parseInt(item.productSize);
      }
      this.totalPrice = Math.round(this.totalPrice * 100) / 100;
    },
    reCalcTotalPrice() {
      var temp = 0;
      this.selectedList.forEach(item => {
        temp += Number.parseFloat(item.good.salePrice) * Number.parseInt(item.productSize);
      })
      this.totalPrice = Math.round(temp * 100) / 100
    },
    async removeItem(car, item) {
      try {
        await api.removeShopCar(item.carId)
        if (item.checked) {
          this.selectItem(false, car, item);
        }
        var idx = car.items.findIndex(i => i.cardId == item.cardId)
        car.items.splice(idx, 1);
        if(car.items.length == 0) {
          idx = this.shopCars.list.findIndex(i=> i.shop.shopId == car.shop.shopId)
          this.shopCars.list.splice(idx,1);
        }
      } catch (error) {
        console.debug(error)
        ElMessage.error(error.msg)
      }
    },
    handleChangeCarGood(shopCar) {
      this.tempPropKyes = shopCar.good.product.propKeys;
      this.tempShopCar = shopCar;
      this.openSelector = true;
    },
    async changeGood(options) {
      try {
        let good = await api.searchGood(this.tempShopCar.good.product.productId, options);
        good.product = this.tempShopCar.good.product
        this.tempShopCar.good = good
        this.openSelector = false
        if (this.tempShopCar.checked) {
          this.reCalcTotalPrice()
        }
      } catch (error) {
        console.debug(error)
        ElMessage.error(error.msg)
      }
    },
    goSettle() {
      if (this.selectedList.length == 0) {
        ElMessage.info("你还没选择商品哦")
        return
      }
      this.$router.push({
        name: 'ordersettle',
        params: {
          data: JSON.stringify(this.selectedList)
        }
      })
    }
  }
})
</script>
<style lang="scss">
</style>