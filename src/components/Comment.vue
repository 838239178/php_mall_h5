<template>
  <div class="w-9/12 mx-auto py-5 px-6">
    <div class="flex justify-between items-center">
      <div>
          <img v-if="comment.user.avatarUrl" class="inline-block w-12 h-12 mr-5 rounded-full border-4 border-dashed border-blue-200 p-1" alt="avatar" :src="comment.user.avatarUrl">
          <UserCircleIcon v-else class="inline-block rounded-full text-gray-500 border-4 border-dashed border-blue-200 w-12 h-12 mr-5" />
        <div class="inline-block text-sm font-bold text-gray-500">{{comment.user.nickName}}</div>
      </div>
      <div class="text-xs font-semibold text-blue-500">
        {{comment.createTime}}
      </div>
    </div>
    <div class="my-6 px-5 py-2 ml-14 mr-5 min-h-28 bg-gray-50 wrap-text rounded-xl">
      {{comment.content}}
    </div>
    <div class="ml-14 text-blue-400 text-xs">
      {{comment.ordersDetail.goodDesc}}
    </div>
  </div>
</template>
<script setup lang="ts">
import { UserCircleIcon } from "@heroicons/vue/solid"

interface Comment {
  content: string,
  createTime: string,
  user: {
    nickName: string,
    avatarUrl: string,
  },
  ordersDetail:{
    goodDesc: string,
  }
}

const prop = defineProps<{
  comment: Comment,
}>()


const emits = defineEmits(['delete-comment'])
</script>

<style scoped>
</style>