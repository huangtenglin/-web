<template>
  <div class="detail">
    <Header />
    <a-row class="detail-content" :gutter="[0, 16]">
      <a-col class="detail-content_top_main" :xs="8" :sm="8" :md="16" :lg="16">
        <div class="detail-content_top_main_img" ref="target">
          <img :src="detailData.cover" style="width: 400px; height: 400px" />
          <!-- 遮罩层 -->
          <div :style="{ left: `${left}px`, top: `${top}px` }" class="mask"></div>
        </div>
        <div
          :style="[
            {
              backgroundImage: `url(${detailData.cover})`,
              backgroundPositionX: `${positionX}px`,
              backgroundPositionY: `${positionY}px`,
            },
          ]"
          v-show="!isOutside"
          class="big"
        >
        </div>
        <div class="detail-content_top_main_description">
          <div class="thing-state">
            <span class="state">商品状态</span>
            <span>上市销售</span>
          </div>
          <h1 class="thing-name">{{ detailData.title }}</h1>
          <span>
            <span class="a-price-symbol">¥</span>
            <span class="a-price">{{ detailData.price }}</span>
          </span>
          <div class="translators flex-view" style="">
            <span>分类：</span>
            <span class="name">{{ detailData.classification_title }}</span>
          </div>
          <div class="translators flex-view" style="">
            <span>库存：</span>
            <span class="name">{{ detailData.repertory }}</span>
          </div>
          <div>
            <button class="buy-btn" @click="handleOrder(detailData)">
              <img :src="AddIcon" />
              <span>立即购买</span>
            </button>
            <a-button type="primary" @click="handleShowTuanGouModel" :disabled="wishCount" size="middle" style="margin-top: 20px"
              >享受团购优惠购买</a-button
            >
          </div>
        </div>
      </a-col>
      <a-col class="detail-content_top_right" :xs="24" :sm="24" :md="6" :lg="8">
        <div class="count-item flex-view pointer" @click="addToWish()">
          <div class="count-img">
            <img :src="WantIcon" />
          </div>
          <div class="count-box flex-view">
            <div class="count-text-box">
              <span class="count-title">加入心愿单</span>
            </div>
            <div class="count-num-box">
              <span class="num-text">{{ detailData.wishCount }}</span>
            </div>
          </div>
        </div>
        <div class="count-item flex-view pointer" @click="collect()">
          <div class="count-img">
            <img :src="RecommendIcon" />
          </div>
          <div class="count-box flex-view">
            <div class="count-text-box">
              <span class="count-title">收藏</span>
            </div>
            <div class="count-num-box">
              <span class="num-text">{{ detailData.collectCount }}</span>
            </div>
          </div>
        </div>
        <div class="count-item flex-view" @click="share()">
          <div class="count-img">
            <img :src="ShareIcon" />
          </div>
          <div class="count-box flex-view">
            <div class="count-text-box">
              <span class="count-title">分享</span>
            </div>
            <div class="count-num-box">
              <span class="num-text"></span>
              <img :src="WeiboShareIcon" class="mg-l" />
            </div>
          </div>
        </div>
      </a-col>
      <a-col class="detail-content_middle_main" :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <div class="order-view main-tab">
          <span
            class="tab"
            :class="selectTabIndex === index ? 'tab-select' : ''"
            v-for="(item, index) in tabData"
            :key="index"
            @click="selectTab(index)"
          >
            {{ item }}
          </span>
          <span :style="{ left: tabUnderLeft + 'px' }" class="tab-underline"></span>
        </div>

        <template v-if="selectTabIndex == 0">
          <div class="thing-intro">
            <a-image :width="400" :src="detailData.cover" />
            <p class="text" style="">{{ detailData.description }}</p>
          </div>
        </template>
        <template v-else>
          <div class="thing-comment">
            <div class="title">发表新的评论</div>
            <div class="publish flex-view">
              <img :src="AvatarIcon" class="mine-img" />
              <input placeholder="说点什么..." class="content-input" ref="commentRef" />
              <button class="send-btn" @click="sendComment()">发送</button>
            </div>
            <div class="tab-view flex-view">
              <div class="count-text">共有{{ commentData.length }}条评论</div>
              <div class="tab-box flex-view" v-if="commentData.length > 0">
                <span :class="sortIndex === 0 ? 'tab-select' : ''" @click="sortCommentList('recent')">最新</span>
                <div class="line"></div>
                <span :class="sortIndex === 1 ? 'tab-select' : ''" @click="sortCommentList('hot')">热门</span>
              </div>
            </div>
            <div class="comments-list">
              <div class="comment-item" v-for="(item, index) in commentData" :key="index">
                <div class="flex-item flex-view">
                  <img :src="AvatarIcon" class="avator" />
                  <div class="person">
                    <div class="name">{{ item.username }}</div>
                    <div class="time">{{ item.commentTime }}</div>
                  </div>
                  <div class="float-right">
                    <span @click="like(item.id)">推荐</span>
                    <span class="num">{{ item.likeCount }}</span>
                  </div>
                </div>
                <p class="comment-content">{{ item.content }}</p>
              </div>
              <div class="infinite-loading-container">
                <div class="infinite-status-prompt" style="">
                  <div slot="no-results" class="no-results">
                    <div></div>
                    <p>没有更多了</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </a-col>
      <a-col class="detail-content_middle_right" :xs="16" :sm="16" :md="6" :lg="8" :xl="8">
        <div class="recommend" style="">
          <div class="title" style="padding-bottom: 2px">热门推荐</div>
          <div class="things">
            <div class="thing-item thing-item" v-for="(item, index) in recommendData" @click="handleDetail(item)" :key="index">
              <div class="img-view"> <img :src="item.cover" /></div>
              <div class="info-view">
                <h3 class="thing-name">{{ item.title.substring(0, 12) }}</h3>
                <span>
                  <span class="a-price-symbol">¥</span>
                  <span class="a-price">{{ item.price }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-modal v-model:visible="showTuanGouModel" title="拼团购买，主打优惠" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel">返回</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">团购购买</a-button>
      </template>
      <div class="userModel">
        <h3>您将和一下用户发起团购:</h3>
        <div class="content">
          <div v-for="(item, index) in userData" :key="item.eamil" class="content_item">
            <span>{{ item.email }}</span>
            <img class="img" :src="imageList[index]" />
          </div>
        </div>
      </div>
    </a-modal>
    <Footer />
  </div>
</template>
<script setup>
import { message } from "ant-design-vue"
import Header from '/@/views/index/components/header.vue'
import Footer from '/@/views/index/components/footer.vue'
import AddIcon from '/@/assets/images/add.svg'
import WantIcon from '/@/assets/images/want-read-hover.svg'
import RecommendIcon from '/@/assets/images/recommend-hover.svg'
import ShareIcon from '/@/assets/images/share-icon.svg'
import WeiboShareIcon from '/@/assets/images/wb-share.svg'
import AvatarIcon from '/@/assets/images/avatar.jpg'
import {
  detailApi,
  listApi as listThingList,
} from '/@/api/thing'
import { listThingCommentsApi, createApi as createCommentApi, likeApi } from '/@/api/comment'
import { wishApi } from '/@/api/thingWish'
import { collectApi } from '/@/api/thingCollect'
import { BASE_URL } from "/@/store/constants"
import { useRoute, useRouter } from "vue-router/dist/vue-router"
import { useMouseInElement } from '@vueuse/core'
import { useUserStore } from "/@/store"
import { getFormatTime } from "/@/utils"
import { ref, watch } from 'vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const imageList = ["https://cdn.toodudu.com/16178dcc248c8098d7d460654f900ba5.jpg", "https://cdn.toodudu.com/169ef046e96665819ba91d9aee18f701.jpg", "https://cdn.toodudu.com/a5d9f2db2abed10a1306bc7495601801.jpg"]


let thingId = ref('')
let detailData = ref({})
let tabUnderLeft = ref(6)
let tabData = ref(['简介', '评论'])
let selectTabIndex = ref(0)
let showTuanGouModel = ref(false)
let loading = ref(false)
let userData = ref([])

let commentData = ref([])
let recommendData = ref([])
let sortIndex = ref(0)
let order = ref('recent') // 默认排序最新

let mask = ref(null)

let commentRef = ref()

onMounted(() => {
  thingId.value = route.query.id.trim()
  getThingDetail()
  getRecommendThing()
  getCommentList()
})

const selectTab = (index) => {
  selectTabIndex.value = index
  tabUnderLeft.value = 6 + 54 * index
}

const getThingDetail = () => {
  detailApi({ id: thingId.value }).then(res => {
    detailData.value = res.data
    detailData.value.cover = BASE_URL + '/api/staticfiles/image/' + detailData.value.cover
  }).catch(err => {
    message.error('获取详情失败')
  })
}
const addToWish = () => {
  let userId = userStore.user_id
  if (userId) {
    wishApi({ thingId: thingId.value, userId: userId }).then(res => {
      message.success(res.msg)
      getThingDetail()
    }).catch(err => {
      console.log('操作失败')
    })
  } else {
    message.warn('请先登录')
  }
}
const collect = () => {
  let userId = userStore.user_id
  if (userId) {
    collectApi({ thingId: thingId.value, userId: userId }).then(res => {
      message.success(res.msg)
      getThingDetail()
    }).catch(err => {
      console.log('收藏失败')
    })
  } else {
    message.warn('请先登录')
  }
}
const share = () => {
  let content = '分享一个非常好玩的网站 ' + window.location.href
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content
  window.open(shareHref)
}
const handleOrder = (detailData) => {
  console.log(detailData)
  const userId = userStore.user_id
  router.push({
    name: 'confirm',
    query:
    {
      id: detailData.id,
      title: detailData.title,
      cover: detailData.cover,
      price: detailData.price
    }
  })
}
const getRecommendThing = () => {
  listThingList({ sort: 'recommend' }).then(res => {
    res.data.forEach((item, index) => {
      if (item.cover) {
        item.cover = BASE_URL + '/api/staticfiles/image/' + item.cover
      }
    })
    recommendData.value = res.data.slice(0, 6)
  }).catch(err => {
    console.log(err)
  })
}
const handleDetail = (item) => {
  // 跳转新页面
  let text = router.resolve({ name: 'detail', query: { id: item.id } })
  window.open(text.href, '_blank')
}
const sendComment = () => {
  let text = commentRef.value.value.trim()
  if (text.length <= 0) {
    return
  }
  commentRef.value.value = ''
  let userId = userStore.user_id
  if (userId) {
    createCommentApi({ content: text, thingId: thingId.value, userId: userId }).then(res => {
      getCommentList()
    }).catch(err => {
      console.log(err)
    })
  } else {
    message.warn('请先登录！')
    router.push({ name: 'login' })
  }
}
const like = (commentId) => {
  likeApi({ id: commentId }).then(res => {
    getCommentList()
  }).catch(err => {
    console.log(err)
  })
}
const getCommentList = () => {
  listThingCommentsApi({ thingId: thingId.value, order: order.value }).then(res => {
    res.data.forEach(item => {
      item.commentTime = getFormatTime(item.commentTime, true)
    })
    commentData.value = res.data
  }).catch(err => {
    console.log(err)
  })
}
const sortCommentList = (sortType) => {
  if (sortType === 'recent') {
    sortIndex.value = 0
  } else {
    sortIndex.value = 1
  }
  order.value = sortType
  getCommentList()
}

// 2. 获取鼠标相对位置
const target = ref(null)
const { elementX, elementY, isOutside } = useMouseInElement(target)

// 3. 控制滑块跟随鼠标移动（监听elementX/Y变化，一旦变化 重新设置left/top）
let left = ref(0)
let top = ref(0)

let positionX = ref(0)
let positionY = ref(0)

watch([elementX, elementY, isOutside], () => {
  console.log('xy变化了')
  // 如果鼠标没有移入到盒子里面 直接不执行后面的逻辑
  if (isOutside.value) return
  // 有效范围内控制滑块距离
  // 横向
  if (elementX.value > 100 && elementX.value < 300) {
    left.value = elementX.value - 100
  }
  // 纵向
  if (elementY.value > 100 && elementY.value < 300) {
    top.value = elementY.value - 100
  }

  // 处理边界
  if (elementX.value > 300) { left.value = 200 }
  if (elementX.value < 100) { left.value = 0 }

  if (elementY.value > 300) { top.value = 200 }
  if (elementY.value < 100) { top.value = 0 }

  // 控制大图的显示
  positionX.value = -left.value * 2
  positionY.value = -top.value * 2

})

const wishCount = computed(() => detailData.value.wishCount < 1)


const handleShowTuanGouModel = () => {
  showTuanGouModel.value = true
  axios.get('/mockUserData').then(res => {
    console.log("模拟用户数据返回", res.data)
    userData.value = res.data.data.list
    console.log(userData.value)
  })
}

const handleOk = () => {

  loading.value = true
  handleOrder(detailData.value)
  setTimeout(() => {
    loading.value = false
    showTuanGouModel.value = false
  }, 2000)
}

const handleCancel = () => {
  showTuanGouModel.value = false
};
</script>
<style scoped lang="less">
.hide {
  display: none;
}

.detail {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
}
.detail-content {
  width: calc(100% - 160px);
  margin: 80px auto;
  box-shadow: 1px 3px #f6f6f6 inset;
  box-sizing: border-box;
  padding: 40px 40px;

  .detail-content_top_main {
    display: flex;
    gap: 0px 20px;
    position: relative;
    &_img {
      width: 400px;
      height: 400px;
      background: #f5f5f5;
    }

    .mask {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      // 绝对定位 然后跟随咱们鼠标控制left和top属性就可以让滑块移动起来
      left: 0;
      top: 0;
      position: absolute;
    }

    .big {
      position: absolute;
      top: 0;
      left: 412px;
      width: 400px;
      height: 400px;
      z-index: 500;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      background-repeat: no-repeat;
      // 背景图:盒子的大小 = 2:1  将来控制背景图的移动来实现放大的效果查看 background-position
      background-size: 800px 800px;
      background-color: #f8f8f8;
    }

    &_description {
      display: flex;
      flex-direction: column;
      text-align: left;
      .thing-state {
        height: 26px;
        line-height: 26px;

        .state {
          font-weight: 500;
          color: #4684e2;
          background: rgba(70, 132, 226, 0.1);
          border-radius: 2px;
          padding: 5px 8px;
          margin-right: 16px;
        }

        span {
          font-size: 14px;
          color: #152844;
        }
      }

      .thing-name {
        line-height: 32px;
        margin: 16px 0;
        color: #0f1111 !important;
        font-size: 15px !important;
        font-weight: 400 !important;
        font-style: normal !important;
        text-transform: none !important;
        text-decoration: none !important;
      }

      .translators,
      .authors {
        line-height: 18px;
        font-size: 14px;
        margin: 8px 0;
        align-items: flex-start;
        justify-content: flex-start;

        .name {
          color: #315c9e;
          white-space: normal;
        }
      }

      .tags {
        position: absolute;
        bottom: 20px;
        margin-top: 16px;

        .category-box {
          color: #152844;
          font-size: 14px;

          .title {
            color: #787878;
          }
        }
      }
    }
  }
  .detail-content_top_right {
    .pointer {
      cursor: pointer;
    }

    .count-item {
      height: 64px;
      align-items: center;
      cursor: pointer;
    }

    .count-img {
      flex: 0 0 32px;
      margin-right: 24px;
      font-size: 0;

      img {
        width: 100%;
        display: block;
      }
    }

    .count-box {
      position: relative;
      border-bottom: 1px solid #cedce4;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      height: 100%;
    }

    .count-text-box {
      font-size: 0;

      .count-title {
        color: #152844;
        font-weight: 600;
        font-size: 16px;
        line-height: 18px;
        display: block;
        height: 18px;
      }
    }

    .count-num-box {
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
      color: #152844;
    }
  }
  .detail-content_middle_main {
    .order-view {
      position: relative;
      color: #6c6c6c;
      font-size: 14px;
      line-height: 40px;
      margin-bottom: 30px;
      box-sizing: border-box;

      .title {
        margin-right: 8px;
      }

      .tab {
        margin-right: 20px;
        cursor: pointer;
        color: #5f77a6;
        font-size: 16px;
        cursor: pointer;
      }

      .tab-select {
        color: #152844;
        font-weight: 600;
      }

      .tab-underline {
        position: absolute;
        bottom: 0;
        left: 84px;
        width: 16px;
        height: 4px;
        background: #4684e2;
        -webkit-transition: left 0.3s;
        transition: left 0.3s;
      }
    }

    .thing-intro {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      row-gap: 20px;
      column-gap: 20px;
    }
  }
  .detail-content_middle_right {
    .title {
      font-weight: 600;
      font-size: 18px;
      line-height: 26px;
      color: #152844;
      margin-bottom: 12px;
    }

    .things {
      border-top: 1px solid #cedce4;

      .thing-item {
        min-width: 255px;
        max-width: 255px;
        position: relative;
        flex: 1;
        margin-right: 20px;
        height: fit-content;
        overflow: hidden;
        margin-top: 26px;
        margin-bottom: 36px;
        padding-bottom: 24px;
        border-bottom: 1px #e1e1e1 solid;
        cursor: pointer;

        .img-view {
          height: 200px;
          width: 255px;

          img {
            height: 200px;
            width: 186px;
            overflow: hidden;
            margin: 0 auto;
            background-size: contain;
            object-fit: contain;
          }
        }

        .info-view {
          overflow: hidden;
          padding: 0 16px;
          .thing-name {
            line-height: 32px;
            margin-top: 12px;
            color: #0f1111 !important;
            font-size: 15px !important;
            font-weight: 400 !important;
            font-style: normal !important;
            text-transform: none !important;
            text-decoration: none !important;
          }

          .price {
            color: #ff7b31;
            font-size: 20px;
            line-height: 20px;
            margin-top: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
  }
}

.flex-view {
  display: flex;
}

.hidden-lg {
  display: none !important;
}
.buy-btn {
  cursor: pointer;
  display: block;
  background: #4684e2;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  width: 110px;
  outline: none;
  border: none;
  margin-top: 18px;
}

.buy-btn img {
  width: 12px;
  margin-right: 2px;
  vertical-align: middle;
}

.buy-btn span {
  vertical-align: middle;
}

.buy-way {
  overflow: hidden;

  .title {
    font-weight: 600;
    font-size: 18px;
    height: 26px;
    line-height: 26px;
    color: #152844;
    margin-bottom: 12px;
  }
}

.thing-content-view {
  margin-top: 40px;
  padding-bottom: 50px;
}

.main-content {
  flex: 1;

  .text {
    color: #484848;
    font-size: 16px;
    line-height: 26px;
    padding-left: 12px;
    margin: 11px 0;
    white-space: pre-wrap;
  }
}

.main-tab {
  border-bottom: 1px solid #cedce4;
}

.flex-view {
  display: flex;
}

.thing-comment {
  .title {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    height: 22px;
    color: #152844;
    margin: 24px 0 12px;
  }

  .publish {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .mine-img {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 40px;
      flex: 0 0 40px;
      margin-right: 12px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }

    .content-input {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      background: #f6f9fb;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      color: #484848;
      padding: 5px 12px;
      white-space: nowrap;
      outline: none;
      border: 0px;
    }

    .send-btn {
      margin-left: 10px;
      background: #4684e2;
      border-radius: 4px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      outline: none;
      border: 0px;
      cursor: pointer;
    }
  }

  .tab-view {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 24px 0;

    .count-text {
      color: #484848;
      float: left;
    }

    .tab-box {
      color: #5f77a6;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .tab-select {
        color: #152844;
      }

      span {
        cursor: pointer;
      }
    }

    .line {
      width: 1px;
      height: 12px;
      margin: 0 12px;
      background: #cedce4;
    }
  }
}

.comments-list {
  .comment-item {
    .flex-item {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding-top: 16px;

      .avator {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40px;
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        margin-right: 12px;
        border-radius: 50%;
        cursor: pointer;
      }

      .person {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .name {
        color: #152844;
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        height: 22px;
        cursor: pointer;
      }

      .time {
        color: #5f77a6;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        margin-top: 2px;
      }

      .float-right {
        color: #4684e2;
        font-size: 14px;
        float: right;

        span {
          margin-left: 19px;
          cursor: pointer;
        }

        .num {
          color: #152844;
          margin-left: 6px;
          cursor: auto;
        }
      }
    }
  }
}

.comment-content {
  margin-top: 8px;
  color: #484848;
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #cedce4;
  margin-left: 52px;
  overflow: hidden;
  word-break: break-word;
}

.infinite-loading-container {
  clear: both;
  text-align: center;
}

.a-price-symbol {
  top: -0.5em;
  font-size: 12px;
}
.a-price {
  color: #0f1111;
  font-size: 21px;
}
.userModel {
  .content {
    display: flex;
    .content_item {
      .img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }
}
</style>
