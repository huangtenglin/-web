<template>
  <a-row class="content" type="flex">
    <a-col :xs="0" :sm="0" :md="6" :lg="6" class="content-left">
      <div class="left-search-item">
        <h4>商品分类</h4>
        <a-tree :tree-data="contentData.cData" :selected-keys="contentData.selectedKeys" @select="onSelect" style="min-height: 220px">
        </a-tree>
      </div>
      <div class="left-search-item">
        <h4>热门标签</h4>
        <div class="tag-view tag-flex-view">
          <span
            class="tag"
            :class="{ 'tag-select': contentData.selectTagId === item.id }"
            v-for="item in contentData.tagData"
            :key="item.id"
            @click="clickTag(item.id)"
            >{{ item.title }}</span
          >
        </div>
      </div>
      <div class="left-search-item">
        <h4>最新推荐</h4>
        <div class="tag-view tag-flex-view">
          <span
            class="tag"
            v-for="(item, index) in contentData.tabData"
            :key="index"
            :class="contentData.selectTabIndex === index ? 'tag-select' : ''"
            @click="selectTab(index)"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </a-col>
    <a-col :xs="22" :sm="22" :md="16" :lg="16" class="content-right">
      <a-spin :spinning="contentData.loading">
        <!-- <div v-infinite-scroll="load" infinite-scroll-immediate="false" infinite-scroll-distance="10" class="pc-thing-list">
          <div v-for="item in contentData.pageData" :key="item.id" @click="handleDetail(item)" class="thing-item">
            <div class="thing-item_container">
              <div class="img-view"> <img :src="item.cover" class="img" /></div>
              <div class="info-view">
                <span class="thing-name" :labelTooltip="item.title">{{ item.title.substring(0, 12) }}</span>
                <div>
                  <span class="price">¥</span> <span class="price">{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="contentData.pageData.length <= 0 && !contentData.loading" class="no-data" style="">暂无数据</div>
        </div> -->
        <div class="pc-thing-list">
          <div v-for="item in contentData.pageData" :key="item.id" @click="handleDetail(item)" class="thing-item">
            <div class="thing-item_container">
              <img :src="item.cover" class="img" />
              <div class="info-view">
                <span class="thing-name" :labelTooltip="item.title">{{ item.title.substring(0, 12) }}</span>
                <div>
                  <span class="price">¥</span> <span class="price">{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="contentData.pageData.length <= 0 && !contentData.loading" class="no-data" style="">暂无数据</div>
        </div>
      </a-spin>
      <div class="page-view" style="">
        <a-pagination
          v-model="contentData.page"
          size="small"
          @change="changePage"
          :hideOnSinglePage="true"
          :defaultPageSize="contentData.pageSize"
          :total="contentData.total"
          :showSizeChanger="false"
        />
      </div>
    </a-col>
  </a-row>
</template>

<script setup>
import { listApi as listClassificationList } from '/@/api/classification'
import { listApi as listTagList } from '/@/api/tag'
import { listApi as listThingList } from '/@/api/thing'
import { BASE_URL } from "/@/store/constants"
import { useUserStore } from "/@/store"

const userStore = useUserStore()
const router = useRouter()

const contentData = reactive({
  selectX: 0,
  selectTagId: -1,
  cData: [],
  selectedKeys: [],
  tagData: [],
  loading: false,

  tabData: ['最新', '最热', '推荐'],
  selectTabIndex: 0,
  tabUnderLeft: 0,

  thingData: [],
  pageData: [],

  page: 1,
  total: 0,
  pageSize: 1,
  pageNum: 16,
})

const count = ref(0)

onMounted(() => {
  initSider()
  getThingList({ pageSize: contentData.pageSize, pageNum: contentData.pageNum })
})

const initSider = () => {
  contentData.cData.push({ key: '-1', title: '全部' })
  listClassificationList().then(res => {
    res.data.forEach(item => {
      item.key = item.id
      contentData.cData.push(item)
    })
  })
  listTagList().then(res => {
    contentData.tagData = res.data
  })
}

const getSelectedKey = () => {
  if (contentData.selectedKeys.length > 0) {
    return contentData.selectedKeys[0]
  } else {
    return -1
  }
}
const onSelect = (selectedKeys) => {
  contentData.selectedKeys = selectedKeys
  if (contentData.selectedKeys.length > 0) {
    getThingList({ c: getSelectedKey(), pageSize: contentData.pageSize, pageNum: contentData.pageNum })
  }
  contentData.selectTagId = -1
}
const clickTag = (index) => {
  contentData.selectedKeys = []
  contentData.selectTagId = index
  getThingList({ tag: contentData.selectTagId, pageSize: contentData.pageSize, pageNum: contentData.pageNum })
}

// 最新|最热|推荐
const selectTab = (index) => {
  contentData.selectTabIndex = index
  let sort = (index === 0 ? 'recent' : index === 1 ? 'hot' : 'recommend')
  const data = { sort: sort }
  if (contentData.selectTagId !== -1) {
    data['tag'] = contentData.selectTagId
  } else {
    data['c'] = getSelectedKey()
  }
  getThingList(data)
}
const handleDetail = (item) => {
  // 跳转新页面
  let text = router.resolve({ name: 'detail', query: { id: item.id } })
  window.open(text.href, '_blank')
}

const getThingList = (data) => {
  contentData.loading = true
  listThingList(data).then(res => {
    contentData.loading = false
    res.data.records.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
      }
    })
    contentData.thingData = res.data.records
    contentData.total = res.data.pages
    // contentData.pageData = [...contentData.pageData, ...res.data.records]
    contentData.pageData = res.data.records
  }).catch(err => {
    console.log(err)
    contentData.loading = false
  })
}

// 分页事件
const changePage = (page) => {
  contentData.page = page
  contentData.pageSize = page
  getThingList({ pageSize: contentData.pageSize, pageNum: contentData.pageNum })
}
// // 滚动加载数据
// const load = () => {
//   if ((contentData.pageSize * contentData.pageNum) <= contentData.total) {
//     contentData.loading = true
//     contentData.pageSize += 1
//     getThingList({ pageSize: contentData.pageSize, pageNum: contentData.pageNum })
//     console.log(contentData)
//     contentData.loading = false
//     console.log(contentData.pageData)
//   }
//   return
// }


</script>

<style scoped lang="less">
.content {
  width: 100%;
  padding: 100px 100px;
  box-sizing: border-box;
}
.content-left {
  margin-right: 32px;
}

.left-search-item {
  overflow: hidden;
  border-bottom: 1px solid #cedce4;
  margin-top: 24px;
  padding-bottom: 24px;
}

h4 {
  color: #4d4d4d;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  height: 24px;
}

.category-item {
  cursor: pointer;
  color: #333;
  margin: 12px 0 0;
  padding-left: 16px;
}

ul {
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
}

li {
  margin: 4px 0 0;
  display: list-item;
  text-align: -webkit-match-parent;
}

.child {
  color: #333;
  padding-left: 16px;
}

.child:hover {
  color: #4684e2;
}

.select {
  color: #4684e2;
}

.flex-view {
  display: flex;
  flex-wrap: wrap;
}

.name {
  font-size: 14px;
}

.name:hover {
  color: #4684e2;
}

.count {
  font-size: 14px;
  color: #999;
}

.check-item {
  font-size: 0;
  height: 18px;
  line-height: 12px;
  margin: 12px 0 0;
  color: #333;
  cursor: pointer;
  align-items: center;
}

.check-item input {
  cursor: pointer;
}

.check-item label {
  font-size: 14px;
  margin-left: 12px;
  cursor: pointer;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.tag-view {
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-top: 4px;
}

.tag-flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.tag {
  background: #fff;
  border: 1px solid #a1adc6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 6px;
  height: 20px;
  line-height: 18px;
  padding: 0 8px;
  margin: 8px 8px 0 0;
  cursor: pointer;
  font-size: 12px;
  color: #152833;
}

.tag:hover {
  background: orange;
  color: #fff;
  border: 1px solid orange;
}

.tag-select {
  background: orange;
  color: #fff;
  border: 1px solid orange;
}

.content-right {
  padding-top: 12px;

  .pc-search-view {
    margin: 0 0 24px;
    align-items: center;

    .search-icon {
      width: 20px;
      height: 20px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 20px;
      flex: 0 0 20px;
      margin-right: 16px;
    }

    input {
      outline: none;
      border: 0px;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      border-bottom: 1px solid #cedce4;
      color: #152844;
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      -ms-flex-item-align: end;
      align-self: flex-end;
      padding-bottom: 8px;
    }

    .clear-search-icon {
      position: relative;
      left: -20px;
      cursor: pointer;
    }

    button {
      outline: none;
      border: none;
      font-size: 14px;
      color: #fff;
      background: #288dda;
      border-radius: 32px;
      width: 88px;
      height: 32px;
      line-height: 32px;
      margin-left: 2px;
      cursor: pointer;
    }

    .float-count {
      color: #999;
      margin-left: 24px;
    }
  }

  .top-select-view {
    justify-content: space-between;
    align-items: center;
    height: 40px;
    margin-bottom: 40px;
    &_container {
      display: flex;
      width: 150px;
      position: relative;
      color: #6c6c6c;
      font-size: 20px;
      &_item {
        flex: 1;
        align-items: center;
        justify-content: center;
        text-align: center;
        cursor: pointer;
      }

      .tab-select {
        color: #409eff;
      }

      .tab-underline {
        position: absolute;
        bottom: 0;
        left: 0px;
        width: 50px;
        height: 2px;
        background: #4684e2;
        transition: left 0.3s;
      }
    }
  }

  .pc-thing-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }

    .thing-item {
      &_container {
        cursor: pointer;
        transition: box-shadow 1s ease, transform 1s ease;
        text-align: center;
        transition: all 0.5s;
        padding: 20px 20px;

        &:hover {
          transform: translate3d(0, -3px, 0);
          box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
        }

        .img {
          width: 150px;
          height: 150px;
          border-radius: 5px;
          text-align: center;
        }
        .info-view {
          text-align: center;
          box-sizing: border-box;
          margin-top: 20px;
          .thing-name {
            font-size: 14px;
          }

          .price {
            color: #ff5000;
            font-size: 20px;
          }

          .translators {
            color: #6f6f6f;
            font-size: 12px;
            line-height: 14px;
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .no-data {
      height: 200px;
      line-height: 200px;
      text-align: center;
      width: 100%;
      font-size: 16px;
      color: #152844;
    }
  }

  .page-view {
    width: 100%;
    text-align: center;
    margin-top: 48px;
  }
}

.a-price-symbol {
  top: -0.5em;
  font-size: 12px;
}

.a-price {
  color: #0f1111;
  font-size: 21px;
}
</style>
