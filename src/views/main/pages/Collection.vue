<template>
  <div class="coll-toolbar">
    <el-select v-model="dto.category" placeholder="按分类查找" clearable @change="getColls">
      <el-option
        v-for="item in categories"
        :key="item.categoryId"
        :label="item.categoryDesc"
        :value="item.categoryId"
      ></el-option>
    </el-select>

    <el-input
      style="width: 25%;"
      v-model="dto['product.productName']"
      placeholder="输入关键字搜索"
      clearable
      @change="getColls"
    ></el-input>
    <el-dropdown trigger="click" size="default" @command="onSelectTimeRange">
      <span class="el-dropdown-link">
        选择日期
        <chevron-down-icon class="w-4 h-4 inline text-orange-my" />
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
  <div v-if="colls.list.length > 0">
    <div style="width: 40%; margin: 0 auto;">
      <collection-view
        v-for="col in colls.list"
        :key="col.collId"
        :coll="col"
        @remove="removeColl"
      />
    </div>
    <div class="w-full text-center mt-8">
      <el-pagination
        hide-on-single-page
        v-model:current-page="dto.page"
        :page-size="10"
        layout="prev, pager, next, jumper"
        :page-count="colls.total"
        background
        :pager-count="5"
      ></el-pagination>
    </div>
  </div>
  <div v-else v-loading="loading">
    <el-empty description="你的收藏夹还没有东西哦"></el-empty>
  </div>
</template>
<script>
import CollectionView from '@/components/CollectionView.vue'
import { defineComponent } from 'vue';
import api from '@/js/api';
import { ElMessage } from 'element-plus';
import { ChevronDownIcon } from "@heroicons/vue/solid"

export default defineComponent({
  components: { CollectionView, ChevronDownIcon },
  data() {
    return {
      dto: {
        category: null,
        "product.productName": null,
        "createTime[gt]": null,
        page: 1,
      },
      colls: {
        list: [],
        total: 0,
      },
      categories: [],
      loading: true
    }
  },
  mounted() {
    this.getCategories();
    this.getColls();
  },
  methods: {
    onSelectTimeRange(command) {
      switch (command) {
        case 1:
          this.dto["createTime[gt]"] = Api.getLocalDateTime({ week: -1 });
          break;
        case 2:
          this.dto["createTime[gt]"] = Api.getLocalDateTime({ month: -1 });
          break;
        case 3:
          this.dto["createTime[gt]"] = Api.getLocalDateTime({ month: -3 });
          break;
        case 0:
          this.dto["createTime[gt]"] = null;
          break;
      }
      this.getColls();
    },
    getCategories() {

    },
    async getColls() {
      try {
        this.loading = true;
        this.colls = await api.getCollections(this.dto);
        console.log(this.colls)
      } catch (error) {
        ElMessage.error(error.msg)
      } finally {
        this.loading = false;
      }
    },
    async removeColl(cid) {
      try {
        await api.removeCollection(cid);
        let idx = this.colls.list.findIndex(i=>i.collId == cid)
        this.colls.list.splice(idx,1);
        this.colls.total -= 1;
      } catch(error) {
        ElMessage.error(error.msg);
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.coll-toolbar {
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