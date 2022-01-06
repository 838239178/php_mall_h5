<template>
  <div class="product-view">
    <el-card
      class="product-card relative"
      shadow="never"
      :body-style="{ padding: '5px' }"
      @click="$emit('click', id)"
    >
      <template #header>
        <el-image
          class="mx-auto"
          :src="imgSrc"
          fit="cover"
          :lazy="true"
        ></el-image>
      </template>
      <div class="flex justify-between items-center mb-1">
        <div class="flex justify-start items-center">
          <el-avatar circle size="small" :src="brand.logoUrl" />
          <div class="text-xs text-gray-500 mx-2">{{ brand.brandName }}</div>
        </div>
        <div class="text-xs mx-2 text-blue-500">
          {{ category.categoryName }}
        </div>
      </div>
      <div v-if="title" class="hidden-wrap text-base mx-2 mt-1">{{ title }}</div>
      <div
        v-if="salePrice"
        class="text-orange-my text-2xl font-bold absolute right-4 bottom-3"
      >
        ¥{{ salePrice }}
      </div>
      <div class="shop-name absolute left-3 bottom-3">{{ shopName }}</div>
    </el-card>
  </div>
</template>
<script lang="js">
export default {
  props: {
    id: {
      type: String,
    },
    imgSrc: {
      type: String,
    },
    title: {
      default: () => null,
      type: String,
    },
    salePrice: {
      default: () => null,
    },
    category: {
      default: () => {
        return {};
      },
    },
    tags: { default: () => [] },
    brand: {
      default: () => {
        return {};
      },
    },
    shopName: {
      default: () => "",
    },
  },
  emits: ["click"],
};
</script>

<style lang="css" scoped>
.product-card {
  width: 300px;
  height: 350px;
}
.el-image {
  height: 200px;
  width: 200px;
  position: unset;
  display: block;
}
.shop-name {
  text-align: left;
  font-size: 12px;
  color: gray;
  text-decoration: underline;
}
</style>