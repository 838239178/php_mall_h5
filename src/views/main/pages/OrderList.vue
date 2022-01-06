<template>
  <div class="order-toolbar">
    <el-radio-group v-model="statusLabel" @change="onSelectType">
      <el-radio-button v-for="l,i in statusLabels" :key="i" :label="l"></el-radio-button>
    </el-radio-group>
    <el-input style="width: 25%;" v-model="dto.keywords" placeholder="输入关键字搜索" clearable @change="getOrders"></el-input>
    <el-dropdown trigger="click" @command="onSelectTimeRange">
       <span class="el-dropdown-link">
        选择日期
        <ChevronDownIcon class="w-3 h-3 inline text-orange-my" />
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="0">全部</el-dropdown-item>
          <el-dropdown-item :command="1">近一周内</el-dropdown-item>
          <el-dropdown-item :command="2">一个月内</el-dropdown-item>
          <el-dropdown-item :command="3">三个月内</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div  v-loading="loading">
    <div style="margin: 0 auto; width:40%;" v-if="orders.list.length > 0">
      <order-view
        v-for="o in orders.list"
        :key="o.ordersId"
        :orderVo="o"
        :isSettle="false"
        @flush="getOrders"
      />
    </div>
    <div v-else>
      <el-empty description="暂时没有订单" />
    </div>
  </div>
  <div class="w-full text-center mt-8">
    <el-pagination
      hide-on-single-page
      v-model:current-page="dto.page"
      :page-size="5"
      layout="prev, pager, next"
      background
      :total="orders.total"
      :pager-count="5">
    </el-pagination>
  </div>
</template>
<script lang="js">
import OrderView from '@/components/OrderView.vue'
import {ChevronDownIcon} from "@heroicons/vue/solid"

export default defineComponent({
  components: { OrderView, ChevronDownIcon },
  data() {
    return {
      loading: true,
      statusLabels: api.getAllStatusLabel(),
      dto:{
        page: 1,
        "order[createTime]": 'desc',
        "createTime[gt]": null,
        keywords: null,
        ordersStatus: null,
      },
      statusLabel: "全部",
      orders:{
        total: 0,
        list: []
      }
    }
  },
  watch: {
    "dto.page"() {
      this.getOrders();
    }
  },
  mounted() {
    if(this.$route.params.status) {
      this.dto.ordersStatus = this.$route.params.status;
      this.statusLabel = api.getOrderStatusLabel(this.dto.ordersStatus);
    }
    this.getOrders();
  },
  methods: {
    onSelectType(label) {
      this.dto.ordersStatus = api.getOrderStatus(label)
      this.getOrders();
    },
    onSelectTimeRange(command) {
      switch(command) {
        case 1:
          this.dto["createTime[gt]"] = api.getLocalDateTime({week: -1});
          break;
        case 2:
          this.dto["createTime[gt]"] = api.getLocalDateTime({month: -1});
          break;
        case 3:
          this.dto["createTime[gt]"] = api.getLocalDateTime({month: -3});
          break;
        case 0:
          this.dto["createTime[gt]"] = null;
          break;
      }
      this.getOrders();
    },
    async getOrders() {
      try {
        this.loading = true
        this.orders = await api.getOrders(this.dto);
      } catch (error) {
        ElMessage.error(error.msg)
      } finally {
        this.loading = false;
      }
    },
  }
})
</script>
<style lang="scss">
.order-toolbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 50%;
  margin: 0 auto;
  margin-bottom: 20px;
  .el-dropdown-link {
    cursor: pointer;
    color: #ff4400;
  }
}
</style>