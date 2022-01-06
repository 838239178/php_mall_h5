<template>
  <el-dialog v-model="showDialog" width="30%" title="选择你要评价的商品">
    <div class="space-y-5" v-if="selectOrder">
      <div v-for="d,i in details" :key="i" class="w-4/5 flex justify-between items-center mx-auto">
        <div class="mx-4 space-y-5"> 
          <div class="font-bold text-sm">{{d.productName}}</div>
          <div class="text-xs text-gray-500">{{d.goodDesc}}</div>
        </div>
        <el-button circle :disabled="d.comment" class="mx-3" type="primary" @click="onSelectOrder(d)">
          <PencilIcon class="w-5 h-5 text-white" />
        </el-button>
      </div>
    </div>
    <template v-else>
      <div class="mb-3">{{selectedOrder?.productName}}({{selectedOrder?.goodDesc}})</div>
      <el-input type="textarea" v-model="content" class="mb-5"/>
      <div class="text-right">
        <el-button type="primary" @click="addComment">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { PencilIcon } from '@heroicons/vue/outline'

interface OrdersDetail {
    "@id": string,
    productName: string,
    goodDesc: string,
    comment?: string,
    good: string
}

const selectOrder = ref(true)
const content = ref("")
const selectedOrder = ref<OrdersDetail>()

const props = defineProps<{
  details: OrdersDetail[]
  modelValue: Boolean
}>()
const emits = defineEmits<{
  (event: "update:modelValue", value: Boolean): void,
}>()

const showDialog = computed<Boolean>({
  set: (value)=>{
    emits("update:modelValue", value)
  },
  get: ()=>{
    return props.modelValue
  }
})

onActivated(() => {
  if(!props.details.some(i => i.comment == undefined)) {
    ElMessage.info("已经全部评价过了")
    return
  }
  if(props.details.length == 1) {
    onSelectOrder(props.details[0])
  }
})

function onSelectOrder(order: OrdersDetail) {
  selectedOrder.value = order
  selectOrder.value = false
}

async function addComment() {
  try {
    let good: any = await api.getIRI(selectedOrder.value!.good)
    await api.addComment({
      product: good.product["@id"],
      ordersDetail: selectedOrder.value!['@id'],
      content: content.value
    })
    ElMessage.success("评价成功")
    if(props.details.length == 1) {
      showDialog.value = false
      selectOrder.value = true
    } else {
      selectOrder.value = true
    }
  } catch (error: any) {
    ElMessage.error(error.msg)
  }
}
</script>