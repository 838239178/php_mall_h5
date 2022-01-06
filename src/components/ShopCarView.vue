<template>
  <div class="shop-car">
    <div class="title">
      <el-checkbox v-model="isCarChecked" @change="handleSelectCar" />
      <el-image class="title-icon" :src="car.shop.icon" fit="fill" :lazy="true" />
      {{ car.shop.shopName }}
    </div>
    <div class="shop-car-item" v-for="item in car.items" :key="item.productId">
      <el-row :gutter="20" type="flex" justify="start">
        <el-col class="product-img" :span="6" :offset="0">
          <el-checkbox
            v-model="item.checked"
            @change="(checked) => handleSelectItem(checked, car, item)"
          />
          <el-image
            :src="item.good.product.previewImgUrl"
            class="w-40 h-40"
            fit="fill"
            :lazy="true"
          />
        </el-col>
        <el-col :span="16" :offset="0">
          <div class="item-name hidden-wrap">{{ item.good.product.productName }}</div>
          <div class="item-type">
            <div class="desc-bg" @click="$emit('change-good', item)">{{ getGoodDesc(item.good) }}</div>
            <el-button type="text" size="small" @click="handleDeleteItem(car, item)">移除</el-button>
          </div>
          <el-row :gutter="20">
            <el-col :span="10" :offset="1">
              <el-input-number
                v-model="item.productSize"
                :min="1"
                @change="(n, o) => handleChangeSize(n, o, car, item)"
              />
            </el-col>
            <el-col :span="10" :offset="3">
              <div class="price-text">￥{{ getPrice(item) }}</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2" :offset="0"></el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="js">
import GoodSelectDialog from './GoodSelectDialog.vue';

export default defineComponent({
  data() {
    return {
      isCarChecked: false,
    };
  },
  emits: ["change-good","select-item", "delete-item", "change-size"],
  props: {
    car: {
      type: Object,
      default: () => {
        return {
          shop: {},
          items: []
        };
      }
    }
  },
  methods: {
    getPrice(item) {
      return Math.round(Number.parseFloat(item.good.salePrice) * Number.parseInt(item.productSize)*100) / 100;
    },
    getGoodDesc(good) {
      return good.propKeys.map((v) => v.value).join(", ");
    },
    handleSelectCar(checked) {
      this.car.items.forEach(i => {
        if (i.checked !== checked) {
          i.checked = checked;
          this.handleSelectItem(checked, this.car, i);
        }
      });
    },
    handleDeleteItem(car, item) {
      this.$emit("delete-item", car, item);
    },
    handleSelectItem(checked, car, item) {
      if (checked == true) {
        if (!this.isCarChecked) {
          var count = 0;
          this.car.items.forEach(i => i.checked ? count++ : 0);
          if (count == this.car.items.length) {
            this.isCarChecked = true;
          }
        }
      }
      else {
        this.isCarChecked = false;
      }
      this.$emit("select-item", checked, car, item);
    },
    handleChangeSize(n, o, car, item) {
      if (item.checked) {
        this.$emit("change-size");
      }
    }
  },
  components: { GoodSelectDialog }
});
</script>
<style>
.desc-bg {
  @apply bg-orange-100 text-orange-400 py-2 px-4 transform will-change-transform bg-opacity-30 border rounded-lg border-orange-400 border-opacity-40 cursor-pointer hover:bg-opacity-60 active:scale-95;
}
</style>
<style lang="scss" scoped>
.shop-car {
  .title {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 5% 0;
    .title-icon {
      margin: 0 15px;
      height: 40px;
      width: 40px;
    }
  }
  .product-img {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .el-image {
      margin-left: 5%;
    }
  }
  .shop-car-item {
    margin: 5% auto;
    .price-text {
      color: #ff2111;
      font-size: 20px;
    }
  }
  .item-name {
    margin: 4% 8%;
    text-align: left;
  }
  .item-type {
    margin-bottom: 3%;
    margin-left: 5%;
    width: 80%;
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 20%;
    }
  }
}
</style>