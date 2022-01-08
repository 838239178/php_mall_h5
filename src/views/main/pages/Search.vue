<template>
  <div class="search-content">
    <div class="cate-selector">
      <div style="text-align: left;" class="selector-title">所有分类</div>
      <div class="flex justify-start space-x-4 text-sm my-3">
        <span
          v-for="cat,i in category.lv1"
          :key="i"
          @click="switchCategory(cat, 2)"
          :class="dto.category == cat.categoryId ? 'text-blue-500 hover:text-blue-400' : 'text-gray-500 hover:text-gray-400'"
          class="underline cursor-pointer"
        >{{ cat.categoryName }}</span>
      </div>
      <div
        v-if="category.lv2?.length > 0"
        class="flex justify-start space-x-4 text-sm italic my-3 ml-2"
      >
        <span
          v-for="cat,i in category.lv2"
          :key="i"
          @click="switchCategory(cat, 3)"
          :class="dto.category == cat.categoryId ? 'text-blue-500 hover:text-blue-400' : 'text-gray-500 hover:text-gray-400'"
          class="underline cursor-pointer"
        >{{ cat.categoryName }}</span>
      </div>
      <div
        v-if="category.lv3?.length > 0"
        class="flex justify-start space-x-4 italic text-sm my-3 ml-4"
      >
        <span
          v-for="cat,i in category.lv3"
          :key="i"
          @click="switchCategory(cat)"
          :class="dto.category == cat.categoryId ? 'text-blue-500 hover:text-blue-400' : 'text-gray-500 hover:text-gray-400 '"
          class="underline cursor-pointer"
        >{{ cat.categoryName }}</span>
      </div>
      <div style="text-align: left;" class="selector-title">品牌</div>
      <div class="flex justify-start space-x-4 text-sm italic my-3 ml-2">
        <span
          v-for="brand,i in brands"
          :key="i"
          @click="dto.brand = brand.brandId"
          :class="dto.brand == brand.brandId ? 'text-blue-500 hover:text-blue-400' : 'text-gray-500 hover:text-gray-400'"
          class="underline cursor-pointer"
        >{{ brand.brandName }}</span>
      </div>
    </div>
    <div class="tool-bar">
      <el-row :gutter="10">
        <el-col :span="7" :offset="0">
          <el-radio-group v-model="dto['order[lowestPrice]']">
            <el-radio-button :label="null">默认</el-radio-button>
            <el-radio-button label="desc">按价格降序</el-radio-button>
            <el-radio-button label="asc">按价格升序</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="1.5" :offset="0">
          <div class="price-text">价格</div>
        </el-col>
        <el-col :span="3">
          <el-input v-model="priceRange.start" type="number" @change="onPriceChange"></el-input>
        </el-col>
        <el-col :span="1" :offset="0">
          <div class="price-text">—</div>
        </el-col>
        <el-col :span="3">
          <el-input v-model="priceRange.end" type="number" @change="onPriceChange"></el-input>
        </el-col>
        <el-col :span="5" :offset="3">
          <el-pagination
            v-model:current-page="dto.page"
            :page-size="20"
            :total="products.total"
            layout="prev, pager, next"
            :pager-count="1"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <div v-loading="loading">
      <el-row :gutter="20" type="flex" justify="start">
        <el-col v-for="item in products.list" :key="item.productId" :span="7" :offset="0">
          <product-view
            style="margin-top: 10px; width: 250px; height: 370px;"
            :id="item.productId"
            :title="item.productName"
            :sale-price="item.lowestPrice"
            :img-src="item.previewImgUrl"
            :shop-name="item.shop.shopName"
            :brand="item.brand"
            :category="item.category"
            :tags="item.productTags"
            @click="$router.push('/main/product?pid=' + item.productId)"
          />
        </el-col>
      </el-row>
    </div>
    <div class="w-full text-center mt-8">
      <el-pagination
        hide-on-single-page
        v-model:current-page="dto.page"
        :page-size="20"
        layout="prev, pager, next, jumper"
        :total="products.total"
        background
        :pager-count="7"
      ></el-pagination>
    </div>
  </div>
</template>
<script lang="js">
import ProductView from '@/components/ProductView.vue'

export default defineComponent({
  data() {
    return {
      products: {
        list: [],
        total: 0,
      },
      category: {
        lv1: [],
        lv2: [],
        lv3: []
      },
      brands: [{brandName: "全部"}],
      loading: true,
      priceRange: {
        start: null,
        end: null,
      },
      dto: {
        category: null,
        "lowestPrice[between]": null,
        productName: null,
        "order[lowestPrice]": null,
        page: 1,
        brand: null,
        group: "product:simple"
      }
    }
  },
  watch: {
    "dto.category"() { this.getProducts() },
    "dto.page"() { this.getProducts() },
    "dto.order[lowestPrice]"() { this.getProducts() },
    "dto.lowestPrice[between]"() { this.getProducts() },
    "$store.state.searchKeyword"(newValue) {
      this.dto.productName = newValue
      this.getProducts();
    }
  },
  components: { ProductView },
  mounted() {
    this.getCategories();
    if (this.$route.query.keyword) {
      this.dto.productName = this.$route.query.keyword;
    }
    if (this.$route.query.cid) {
      this.dto.category = this.$route.query.cid;
    }
    this.getProducts();
  },
  methods: {
    onPriceChange() {
      if (this.priceRange.start && this.priceRange.end) {
        this.dto['lowestPrice[between]'] = `${this.priceRange.start}..${this.priceRange.end}`
      }
    },
    async getProducts(num) {
      this.loading = true;
      try {
        this.products = await api.getProducts(this.dto);
      } catch (error) {
        ElMessage.error(error.msg);
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async getBrands(category) {
      try {
        let resp = await api.getBrands({ category: category })
        this.brands = resp.list
        this.brands.splice(0,0, {
          brandName: "全部"
        })
      } catch (error) {
        console.debug(error)
        ElMessage.error(error.msg)
      }
    },
    switchCategory(cate, level) {
      if (cate && level) {
        this.category[`lv${level}`] = cate.children;
      }
      this.dto.category = cate.categoryId
      if (cate.categoryLevel == 1) {
        this.getBrands(cate.categoryId);
      }
    },
    async getCategories() {
      try {
        let data = await api.getCategories({ categoryLevel: 1 });
        this.category.lv1 = data.list;
        this.category.lv1.splice(0, 0, {
          categoryName: "全部"
        })
      } catch (error) {
        ElMessage.error(error.msg)
      }
    }
  }
});
</script>
<style lang="scss" scoped>
.search-content {
  width: 60%;
  padding: 40px;
  margin: 0 auto;
}
.tool-bar {
  margin-top: 40px;
  margin-bottom: 40px;
  .price-text {
    padding: 5px;
    color: grey;
    font-size: 14px;
    margin: 5px auto;
  }
  .el-button-group {
    display: flex;
    justify-content: flex-start;
  }
  .el-pagination {
    margin: 5px auto;
  }
}
.cate-selector {
  .selector-title {
    color: rgb(83, 83, 83);
  }
}
</style>