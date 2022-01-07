<template>
  <el-dialog title="选择款式" v-model="showGoodSelector" width="40%">
    <div class="space-y-5">
      <div v-for="pk,i in propKeys" :key="i">
        <div class="my-3 font-bold text-sm">{{ pk.propKey.keyName }}</div>
        <div
          v-for="v,j in pk.optionValues" :key="'v' + j"
          class="option-card"
          :class="options[pk.id]?.value === v ? 'bg-orange-400 text-orange-600' : 'bg-orange-100 hover:bg-orange-300 text-orange-400'"
          @click="setOption(pk.id, v)"
        >{{ v }}</div>
      </div>
    </div>
    <template #footer>
      <span>
        <el-button @click="showGoodSelector = false">取消</el-button>
        <el-button type="primary" @click="changeGood">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
const props = defineProps<{
  propKeys: Entity.ProductPropKey[]
  modelValue: Boolean
}>()

const emits = defineEmits<{
  (event: "change-good", opts: Entity.PropOption[]): void
  (event: "update:modelValue", val: Boolean): void
}>()


const showGoodSelector = computed<Boolean>({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value)
});

const options = ref<{ [key: number]: Entity.PropOption }>({})

function changeGood() {
  let values: Entity.PropOption[] = Object.values(options.value)
  if (values.length === props.propKeys.length) {
    emits("change-good", values)
  } else {
    ElMessage.warning("还有标签没有选择");
  }
}
function setOption(id: number, value: string) {
  options.value[id] = {
    propKeyId: id,
    value: value
  }
}
</script>
<style scoped>
.option-card {
  @apply py-2 px-4 
        transform will-change-transform 
        bg-opacity-30 inline-block 
        mr-3 border rounded-lg border-orange-400 border-opacity-40 cursor-pointer 
        active:scale-95;
}
</style>