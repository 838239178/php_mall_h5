<template>
  <div style="margin: 0 auto; width: 60%;" v-loading="loadding">
    <el-row :gutter="20" class="mb-10">
      <el-col :span="9" :offset="0">
        <el-image 
          class="w-full h-full"
          :src="product.previewImgUrl" 
          fit="fill" 
          :lazy="false" />
      </el-col>
      <el-col :span="2"/>
      <el-col :span="12" :offset="0">
        <div class="product-name">
          {{product.productName}}
        </div>
        <div class="product-desc">
          {{product.productDesc}}
        </div>
        <!-- TODO SKU -->
        <div class="type-select">
          <div class="type-title">款式:</div>
          <div @click="selectGood = true" class="tracking-wide py-2 px-4 bg-orange-100 bg-opacity-30 hover:bg-opacity-60 cursor-pointer transform will-change-transform mr-10 border rounded-lg border-orange-400 text-orange-400 border-opacity-40">
            {{goodDesc}}
          </div>
        </div>
        <div class="size-price-content">
          <div class="price-label">数量：</div>
          <el-input-number v-model="selectedSize"
            :min="1" :step="1" :max="good.stock"  :controls="true" controls-position="right" />
          <div class="text-xs underline text-gray-400 decoration-orange-200 underline-offset-2 decoration-2 ml-3 mr-8">剩余:{{good.stock}}</div>
          <div class="price-label">
            单价:
          </div>
          <div class="price-sale">
            ￥{{good.salePrice}}
          </div>
        </div>
        <div class="flex justify-start space-x-10 my-10 items-end">
          <el-button @click="addToColl">
            <CollectionIcon class="w-5 h-5 text-blue-400 mx-2"/>收藏 
          </el-button>
          <el-button @click="addToCar">
            <ShoppingCartIcon class="w-5 h-5 text-blue-400 mx-2"/>加购
          </el-button>
          <el-button type="primary" size="default" @click="orderSettle">购买</el-button>
        </div>
      </el-col>
      <el-col :span="1" :offset="0"></el-col>  
    </el-row>
    <el-tabs class="w-full" v-model="tabName" tab-position="top">
      <el-tab-pane name="intro" label="介绍">
        <div class="w-full fr-view" v-html="product.introPage"></div>
      </el-tab-pane>
      <el-tab-pane name="comment" label="评论">
        <div class="w-full space-y-8">
          <Comment
            class="shadow-md rounded-lg border-b-2 border-r-2 border-blue-100"
            v-for="com,i in comments.list" :key="i"
           :comment="com" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <GoodSelectDialog @change-good="getGood" v-model="selectGood" :propKeys="product.propKeys"/>
  </div>
</template>
<script lang="js">
import '@/assets/css/froala_style.css'
import {
  ShoppingCartIcon,
  CollectionIcon
} from "@heroicons/vue/solid"
import GoodSelectDialog from '@/components/GoodSelectDialog.vue';
import Comment from '@/components/Comment.vue';

export default defineComponent({
  data() {
    return {
      product: {},
      good: {
        propKeys: []
      },
      dto: {
        product: null,
        "order[createTime]": 'desc',
        page: 1,
      },
      comments: {
        list: [],
        total: 0,
      },
      selectedSize: 1,
      loadding: true,
      tabName: "intro",
      selectGood: false,
    }
  },
  components: {
    ShoppingCartIcon,
    CollectionIcon,
    GoodSelectDialog,
    Comment
},
  mounted() {
    var pid = this.$route.query.pid;
    if(pid) {
      this.getProduct(pid);
      this.dto.product = pid;
      this.getComments();
    } else {
      this.$router.push('/main/search');
    }
  },
  computed: {
    goodDesc() {
      if(this.good.propKeys.length == 0) {
        return "正在加载"
      }
      return this.good.propKeys.map((v)=>v.value).join(", ");
    }
  },
  methods: {
    async getComments() {
      try {
        this.comments = await api.getComments(this.dto);
      } catch (error) {
        console.error(error)
      }
    },
    async getProduct(pid) {
      try {
        this.product = await api.getProduct(pid)
        api.getIRI(this.product.goods[0]).then(res => this.good=res); 
      } catch (error) {
        ElMessage.error(error.msg)
      } finally {
        this.loadding = false
      }
    },
    async getGood(values) {
      try {
        let resp = api.searchGood(this.product.productId, values)
        this.good = (await resp);
        this.selectGood = false;
      } catch (error) {
        if(error.code == 404) {
          ElMessage.warning("这个款式卖完了哦");
        } else {
          ElMessage.error(error.msg)
        }
      }
    },
    async addToColl() {
      try {
        await api.addCollection(this.product["@id"]);
        ElMessage.success("收藏成功")
      } catch (error) {
        ElMessage.error(error.msg)
      }
    },
    async addToCar() {
      try {
        console.log(this.good)
        await api.addShopCar({
          productSize: this.selectedSize,
          good: this.good["@id"]
        })
        ElMessage.success("添加成功")
      } catch (error) {
        ElMessage.error(error.msg)
      }
    },
    orderSettle() {
      this.good.product = this.product
      this.$router.push({
        name: 'ordersettle',
        params: {
          data: JSON.stringify([{
            good: this.good,
            productSize: this.selectedSize
          }])
        }
      });
    }
  }
})
</script>
<style lang="scss" scoped>

.product-name {
  font-size: 20px;
  font-weight: bold;
  margin: 25px 0;
  text-align: left;
}
.product-desc {
  font-size: 14px;
  color: gray;
  margin: 10px 0;
  text-align: left;
}
.type-select {
  .type-title {
    font-weight: bold;
    margin: 10px 0;
    font-size: 15px;
  }
  text-align: left;
  margin-top: 4%;
  margin-bottom: 5%;
}

.size-price-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin: 25px 0;
  .price-label {
    font-size: 12px;
    color: gray;
  }
  .price-sale,.price-original {
    color: #ff0000;
  }
  .price-sale {
    font-size: 25px;
    padding: 0 5px;
  }
  .price-original {
    font-size: 16px;
    padding: 0 5px;
    text-decoration: line-through;
  }

}
</style>