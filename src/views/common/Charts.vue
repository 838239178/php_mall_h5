<template>
  <div>
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-500 mr-5 inline-block">销售报表</h1>
      </div>
    </header>
    <div class="mx-auto mt-6 w-fit">
      <el-date-picker v-model="currentYear" type="year" placeholder="年份选择"></el-date-picker>
    </div>
    <div
      v-if="showProduct"
      id="product-chart"
      class="shadow my-6 p-4 lg:w-[1020px] sm:w-[800px] h-96 mx-auto"
    ></div>
    <div
      v-if="showShop"
      id="shop-chart"
      class="shadow my-6 p-4 lg:w-[1020px] sm:w-[800px] h-96 mx-auto"
    ></div>
  </div>
</template>
<!-- 
  1. 某个商品 每个月的下单数量、销售金额折线图
  2. 商店销售报表
-->
<script lang="ts" setup>
import _axios from '@/plugins/axios'
import * as echarts from 'echarts'

interface ChartQuery {
  productId?: number,
  shopId?: number,
  token?: string
}

const currentYear = ref(new Date())
const showProduct = ref(true)
const showShop = ref(true)

type EchartOption = echarts.EChartsOption
type Echarts = echarts.ECharts

let productChart: Echarts
let shopChart: Echarts

let query: ChartQuery

watch(currentYear, ()=>{
  initData()
})

onMounted(() => {
  query = useRoute().query
  showProduct.value = query.productId != undefined
  showShop.value = query.shopId != undefined
  //init chart
  if (showProduct.value) {
    productChart = echarts.init(document.getElementById("product-chart")!, undefined, { renderer: "svg" })
    productChart.setOption(productChartOption)
  }
  if (showShop.value) {
    shopChart = echarts.init(document.getElementById("shop-chart")!, undefined, { renderer: "svg" })
    shopChart.setOption(shopChartOption)
  }
  initData()
})

function initData() {
  //append data
  if (query.productId) {
    getProductSaleData(query.productId, currentYear.value.getFullYear());
  }
  if (query.shopId) {
    getShopIncomeData(query.shopId, currentYear.value.getFullYear());
  }
}

async function getProductSaleData(id: number, year?: number) {
  productChart.showLoading()
  try {
    let res = await _axios.get("/api/charts/products/" + id, {
      params:{
        year: year
      }, 
      headers:{
        'Authorization': `Bearer ${query.token}`
      }
    }) as {month: number, sale: number, money: number}[]

    productChart.setOption({
      xAxis: {
        data: res.map(i=>`${i.month}月`)
      },
      series: [
        {
          name: "总销量",
          data: res.map(i=>i.sale)
        },
        {
          name: "总金额",
          data: res.map(i=> Math.round(i.money / 1000) / 10)
        }
      ]
    })
  } catch (error: any) {
    ElMessage.error(error.msg);
  } finally {
    productChart.hideLoading()
  }
}

async function getShopIncomeData(id: number, year?: number) {
  shopChart.showLoading()
  try {
    let res = await _axios.get("/api/charts/shop/" + id, {
      params:{
        year: year
      }, 
      headers:{
        'Authorization': `Bearer ${query.token}`
      }
    }) as {month: number, money: number}[]
    shopChart.setOption({
      xAxis: {
        data: res.map(i=>`${i.month}月`)
      },
      series: [
        {
          name: "收入",
          data: res.map(i=>i.money)
        },
      ]
    })
  } catch (error: any) {
    ElMessage.error(error.msg);
  } finally {
    shopChart.hideLoading()
  }
}

const productChartOption = {
  title: {
    text: "商品销售数据"
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['总销量', '总金额']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: [
    {
      type: 'value',
      name: '销售数量'
    },
    {
      type: 'value',
      name: '销售金额/万'
    }
  ],
  series: [
    {
      name: "总销量",
      type: 'line',
      stack: 'Total',
      data: [],
    },
    {
      name: "总金额",
      type: 'line',
      stack: 'Total',
      data: [],
    }
  ],
} as EchartOption

const shopChartOption = {
  title: {
    text: "商店收入数据"
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['收入']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value',
    name: "收入金额/元"
  },
  series: [
    {
      data: [],
      type: 'bar',
      name: '收入',
    }
  ]
} as EchartOption

</script>