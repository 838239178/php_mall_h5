<template>
  <div class="order-content">
    <div class="header">
      <el-row :gutter="20" type="flex" justify="start" align="middle">
        <el-col :span="2" :offset="0">
          <el-image
            style="width: 50px; height: 50px"
            class="rounded-full"
            v-if="orderVo.shop.shopIcon"
            :src="orderVo.shop.icon"
            fit="fill"
            :lazy="true"
          ></el-image>
        </el-col>
        <el-col :span="5" :offset="0">
          <div class="shopName">{{ orderVo.shop.shopName }}</div>
        </el-col>
        <el-col :span="6" :offset="0"></el-col>
        <el-col :span="7" :offset="0">
          <count-down-view
            v-if="hasCountDown"
            :start-date="getStartDate()"
            :interval-day="getInterval()"
            :text="getHelpText()"
          />
        </el-col>
        <el-col :span="4" :offset="0">
          <div class="status-label" v-if="!isSettle">{{ getOrderStatus() }}</div>
        </el-col>
      </el-row>
    </div>
    <div class="order-detail" v-for="(detail, i) in orderVo.details" :key="i">
      <el-row :gutter="20">
        <el-col :span="5" :offset="0">
          <el-image class="w-full h-full" :src="detail.productImgUrl || detail.good.product.previewImgUrl" fit="fill" :lazy="true"></el-image>
        </el-col>
        <el-col :span="14" :offset="0">
          <div class="detail-title">{{ detail.productName || detail.good.product.productName }}</div>
          <div class="detail-type">{{ getGoodDesc(detail) }}</div>
        </el-col>
        <el-col :span="5" :offset="0">
          <div class="detail-price">￥{{ detail.productPrice || detail.good.salePrice }}</div>
          <div class="detail-size">x{{ detail.productSize }}</div>
        </el-col>
      </el-row>
    </div>
    <el-collapse
      class="detail-panel"
      v-if="!isSettle"
      v-model="showDetail"
      :accordion="false"
    >
      <el-collapse-item title="详情" :name="1">
        <el-descriptions size="small">
          <el-descriptions-item label="订单号">{{ orderVo.ordersId }}</el-descriptions-item>
          <el-descriptions-item label="交易号">{{ orderVo.payId }}</el-descriptions-item>
          <el-descriptions-item label="运单号">{{ orderVo.expressId }}</el-descriptions-item>
          <el-descriptions-item label="快递商">{{ orderVo.expressName }}</el-descriptions-item>
          <el-descriptions-item label="支付类型">{{ orderVo.payType }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ orderVo.createTime }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ orderVo.expressTime }}</el-descriptions-item>
          <el-descriptions-item label="付款时间">{{ orderVo.payTime }}</el-descriptions-item>
          <el-descriptions-item label="失效时间">{{ orderVo.cancelTime }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ orderVo.finishTime }}</el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ orderVo.address }}</el-descriptions-item>
          <el-descriptions-item label="发货地址">{{ orderVo.expressAddress }}</el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>
    </el-collapse>
    <div class="footer">
      总价：
      <span class="price">￥{{ orderVo.totalPrice }}</span>
      <span class="mx-1 text-xs text-orange-500 underline">包含运费￥{{orderVo.expressPrice || orderVo.shop.expressPrice}}</span>
    </div>
    <div v-if="!isSettle">
      <div v-if="orderVo.ordersStatus == 'wait_pay'" class="manage-btn-content">
        <el-button type="text" size="default" @click="optOrder('cancel')">取消订单</el-button>
        <el-button type="primary" size="default" @click="optOrder('pay')">付款</el-button>
      </div>
      <div v-else-if="orderVo.ordersStatus == 'wait_express'" class="manage-btn-content">
        <el-button type="primary" size="default" @click="optOrder('drawback')">退款</el-button>
      </div>
      <div v-else-if="orderVo.ordersStatus == 'wait_draw_back'" class="manage-btn-content">
        <el-button type="primary" size="default" @click="optOrder('cancel_drawback')">取消退款</el-button>
      </div>
      <div v-else-if="orderVo.ordersStatus == 'wait_receive'" class="manage-btn-content">
        <el-button type="primary" size="default" @click="optOrder('drawback')">退款</el-button>
        <el-button type="primary" size="default" @click="optOrder('receive')">确认收货</el-button>
      </div>
      <div v-else-if="orderVo.ordersStatus == 'finished'" class="manage-btn-content">
        <el-button type="primary"  @click="showCommentDialog = true">评价</el-button>
      </div>
      <div v-else class="manage-btn-content">
        <el-button size="default" @click="optOrder('remove')">删除订单</el-button>
      </div>
    </div>
    <comment-dialog v-model="showCommentDialog" :details="orderVo.details"/>
  </div>
</template>
<script lang="js">
import CountDownView from './CountDownView.vue'
import CommentDialog from './CommentDialog.vue';
const orderStatusList = {
  "wait_pay":{ label: "待付款", prop: 'createTime', interval: 7, help: '自动取消' },
  "wait_express":{ label: "待发货", prop: 'payTime', interval: 14, help: '自动退款' },
  "wait_receive":{ label: "待收货", prop: 'expressTime', interval: 7, help: '自动收货' },
  "wait_draw_back":{ label: "待退款", prop: 'refundTime', interval: 7, help: '自动退款' },
  "finished":{ label: "已完成" },
  "canceled":{ label: "已失效" },
};
export default defineComponent({
  components: { CountDownView, CommentDialog },
  data() {
    return {
      address: '',
      showCommentDialog: false,
      showDetail: [],
    };
  },
  computed: {
    hasCountDown() {
      return !this.isSettle && orderStatusList[this.orderVo.ordersStatus].interval;
    }
  },
  props: {
    orderVo: {
      type: Object,
      default: ()=>{return{}}
    },
    isSettle: Boolean
  },
  emits: ["price-change", "open-detail", 'flush'],
  methods: {
    getOrderStatus() {
      return orderStatusList[this.orderVo.ordersStatus].label;
    },
    getGoodDesc(detail) {

      return detail.goodDesc || detail.good.propKeys.map((v) => v.value).join(", ");
    },
    getInterval() {
      return orderStatusList[this.orderVo.ordersStatus].interval;
    },
    getHelpText() {
      return orderStatusList[this.orderVo.ordersStatus].help;
    },
    getStartDate() {
      var p = orderStatusList[this.orderVo.ordersStatus].prop;
      return new Date(this.orderVo[p]);
    },
    optOrder(option) {
      api.updateOrderState(option, this.orderVo.ordersId)
        .then(() => {
          this.$emit('flush');
        })
        .catch((error) => {
          ElMessage.error(error)
        })
    }
  },
});
</script>
<style lang="scss" scoped>
.order-content {
  box-shadow: 1px 1px 3px #d9d9d9;
  border-radius: 5px;
  padding: 20px;
  margin-top: 25px;
  .detail-panel {
    width: 100%;
    padding-left: 15px;
    margin: 15px auto;
  }
  .header {
    .shopName {
      font-size: 18px;
    }
    .status-label {
      color: #ff0000;
    }
  }
  .manage-btn-content {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    .el-button {
      margin: 0 10px;
    }
  }
  .select-coupon {
    margin-bottom: 15px;
  }
  .order-detail {
    margin-top: 3%;
    margin-bottom: 3%;
    .detail-title {
      margin: 25px;
      font-size: 18px;
      text-align: left;
    }
    .detail-type {
      margin-top: 20px;
      margin-left: 25px;
      font-size: 15px;
      text-align: left;
      color: gray;
    }
    .detail-price {
      color: #ff4400;
      font-weight: bold;
      font-size: 18px;
      margin: 25px auto;
    }
    .detail-size {
      margin-top: 20px;
      font-size: 15px;
      text-align: center;
      color: gray;
    }
  }
  .el-select-v2__placeholder {
    left: 0.5px;
    font-size: 13px;
  }
  .price {
    color: #ff4400;
    font-weight: bold;
  }
  .el-collapse-item__header {
    border-bottom: none;
    border-top: none;
  }
}
</style>