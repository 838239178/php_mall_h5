<template>
  <header class="bg-white shadow">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight text-gray-500 mr-5 inline-block">你找的页面不见了</h1>
      <router-link to="/main" class="text-lg underline text-blue-500 hover:text-opacity-60">
        返回主页<ChevronRightIcon class="inline w-7 h-7"/>
      </router-link>
    </div>
  </header>
  <div class="text-orange-my font-mono lg:text-huge sm:text-9xl lg:py-12 sm:py-8 font-black w-fit mx-auto underline decoration-orange-100 underline-offset-8">
    404
  </div>
</template>
<script setup lang="ts">
import {ChevronRightIcon} from "@heroicons/vue/solid"
</script>
