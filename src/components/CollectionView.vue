<template>
  <div class="coll-content">
    <el-row :gutter="20">
      <el-col :span="7" :offset="0">
        <el-image class="view-img" :src="coll.product.previewImgUrl" fit="fill" :lazy="true"></el-image>
      </el-col>
      <el-col :span="16" :offset="1">
        <div class="title">
          {{coll.product.productName}}
        </div>
        <div class="price">
          ￥{{coll.product.lowestPrice}}
        </div>
        <div class="footer">
          <div class="shop-name">{{coll.product.shop.shopName}}</div>
          <el-button size="default" @click="goDetail(coll.product.productId)">查看详情</el-button>
          <el-button size="default" @click="$emit('remove',coll.collId)">移除</el-button>
        </div>
      </el-col>
    </el-row>
    
  </div>
</template>
<script lang="js">
export default {
  props: {
    coll: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  emits: ['remove'],
  methods: {
    goDetail(pid) {
      this.$router.push(`/main/product?pid=${pid}`);
    },
  }
}
</script>
<style lang="scss" scoped>
.coll-content {
  box-shadow: 1px 1px 3px #d9d9d9;
  border-radius: 5px;
  padding: 20px;
  margin-top: 25px;
  .title {
    text-align: left;
    font-size: 18px;
    height: 50%;
    width: 90%;
  }
  .price {
    color: #ff4477;
    text-align: right;
    width: 90%;
    height: 25%;
    font-size: 20px;
    font-weight: bold;
  }
  .view-img {
    width: 200px;
    height: 200px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .shop-name {
      color: gray;
      font-size: 14px;
      width: 50%;
      text-align: left;
      cursor: pointer;
      &:hover {
        opacity: 80%;
      }
    }
  }
}
</style>