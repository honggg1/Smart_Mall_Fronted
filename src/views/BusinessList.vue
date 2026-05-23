<template>
  <div class="wrapper">
    <NavBar :title="currentCategoryName" />

    <!-- 水平分类选择器 -->
    <div class="category-selector">
      <div class="category-scroll" ref="categoryScrollRef">
        <div
          v-for="item in categories"
          :key="item.categoryId"
          class="category-chip"
          :class="{ active: selectedCategoryId === item.categoryId }"
          @click="onSelectCategory(item)"
        >
          <img :src="getCategoryImg(item.categoryCover)" />
          <span>{{ item.categoryName }}</span>
        </div>
      </div>
    </div>

    <!-- 商家列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        :loading="loadingMore"
        :finished="finished"
        finished-text="—— 到底了 ——"
        @load="onLoadMore"
        offset="10"
      >
        <ul class="business">
          <li v-for="item in pagedBusinessList" :key="item.businessId" @click="toBusinessDetail(item.businessId)">
            <div class="img-wrapper">
              <div class="business-feature" :class="getFeatureClass(item.featureTag)">{{ item.featureTag || '新店' }}</div>
              <img :src="getBusinessImg(item.businessImg)" @error="onImgError" />
              <van-badge v-if="item.monthlySales" :content="formatSalesBadge(item.monthlySales)" max="99" class="cart-badge">
                <div class="child" />
              </van-badge>
            </div>
            <div class="business-info">
              <h3 class="business-info-name">{{ item.businessName }}</h3>
              <div class="business-info-row2">
                <div class="business-info-star">
                  <van-rate :model-value="getDisplayRating(item)" :size="14" color="#ff9933" void-icon="star" void-color="#eee" readonly allow-half/>
                  <span>{{ getDisplayRating(item) }} · 月售{{ item.monthlySales || 0 }}单</span>
                </div>
                <span class="business-delivery-tag">{{ item.deliveryTag || '商家专送' }}</span>
              </div>
              <div class="business-info-delivery">
                <span>&#165;{{ item.starPrice || 0 }} 起送</span>
                <span class="delivery-split">|</span>
                <span>&#165;{{ item.deliveryPrice || 0 }} 配送</span>
              </div>
              <div class="business-info-explain">
                <span>{{ item.businessExplain }}</span>
              </div>
            </div>
          </li>
        </ul>
        <van-empty v-if="!loadingMore && allBusinesses.length === 0" description="该分类暂无商家" />
      </van-list>
    </van-pull-refresh>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Footer from '@/components/Footer.vue'
import NavBar from '@/components/NavBar.vue'
import { get } from '@/api/index.js'
import defaultCategoryImg from '@/assets/category/cat01-meishi.svg'

const router = useRouter()
const route = useRoute()

const refreshing = ref(false)
const loadingMore = ref(false)
const finished = ref(false)
const currentPage = ref(1)
const pageSize = 10

// ==================== 分类 ====================
const categories = ref([])
const selectedCategoryId = ref(null)

const currentCategoryName = computed(() => {
  const cat = categories.value.find(c => c.categoryId === selectedCategoryId.value)
  return cat ? cat.categoryName : (route.query.categoryName || '全部分类')
})

const loadCategories = () => {
  return get('/category/list').then(res => {
    if (res.data.code === 20000) {
      categories.value = res.data.resultData || []
    }
  }).catch(e => console.log('分类加载失败', e))
}

const initSelectedCategory = () => {
  if (categories.value.length === 0) return
  const queryId = route.query.categoryId
  if (queryId) {
    const match = categories.value.find(c => String(c.categoryId) === String(queryId))
    selectedCategoryId.value = match ? match.categoryId : categories.value[0].categoryId
  } else {
    selectedCategoryId.value = categories.value[0].categoryId
  }
}

const onSelectCategory = (item) => {
  if (selectedCategoryId.value === item.categoryId) return
  selectedCategoryId.value = item.categoryId
  currentPage.value = 1
  finished.value = false
  allBusinesses.value = []
  loadBusinesses(item.categoryId)
  scrollToSelectedChip()
}

const scrollToSelectedChip = () => {
  nextTick(() => {
    const container = categoryScrollRef.value
    if (!container) return
    const chip = container.querySelector('.category-chip.active')
    if (chip) {
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  })
}

const categoryScrollRef = ref(null)

// ==================== 商家列表 ====================
const allBusinesses = ref([])

const pagedBusinessList = computed(() => {
  return allBusinesses.value.slice(0, currentPage.value * pageSize)
})

const loadBusinesses = (categoryId) => {
  const url = categoryId
    ? `/business/listByCategory?categoryId=${categoryId}`
    : '/business/list'
  return get(url).then(res => {
    if (res.data.code === 20000) {
      allBusinesses.value = res.data.resultData || []
    }
  }).catch(e => console.log('商家加载失败', e))
}

const onLoadMore = () => {
  loadingMore.value = true
  currentPage.value++
  nextTick(() => {
    finished.value = currentPage.value * pageSize >= allBusinesses.value.length
    loadingMore.value = false
  })
}

const onRefresh = () => {
  Promise.all([loadCategories(), loadBusinesses(selectedCategoryId.value)]).then(() => {
    initSelectedCategory()
    currentPage.value = 1
    finished.value = pagedBusinessList.value.length >= allBusinesses.value.length
    refreshing.value = false
  })
}

// ==================== 辅助方法 ====================
const getCategoryImg = (img) => {
  if (!img) return defaultCategoryImg
  if (img.startsWith('data:image')) return img
  return `data:image/png;base64,${img}`
}

const getBusinessImg = (img) => {
  if (!img) return ''
  if (img.startsWith('data:image')) return img
  if (img.startsWith('http')) return img
  return `data:image/png;base64,${img}`
}

const onImgError = (e) => {
  e.target.style.display = 'none'
}

const formatSalesBadge = (sales) => {
  if (sales > 99) return '99+'
  return String(sales)
}

const getDisplayRating = (item) => item.rating > 0 ? item.rating : 5.0

const getFeatureClass = (feature) => {
  const map = {
    '新店': 'feature-new',
    '热卖': 'feature-hot',
    '人气': 'feature-popular',
    '推荐': 'feature-recommend',
    '健康': 'feature-health',
  }
  return map[feature] || 'feature-new'
}

const toBusinessDetail = (businessId) => {
  router.push({ path: '/businessDetail', query: { businessId } })
}

// ==================== 初始化 ====================
onMounted(async () => {
  await loadCategories()
  initSelectedCategory()
  await loadBusinesses(selectedCategoryId.value)
  nextTick(() => {
    scrollToSelectedChip()
    finished.value = pagedBusinessList.value.length >= allBusinesses.value.length
  })
})
</script>

<style scoped>
.wrapper { width: 100%; height: 100%; background: #f8f8f8; }

/* ===== 分类选择器 ===== */
.category-selector {
  background: #fff;
  padding: 2vw 0;
  box-shadow: 0 0.5vw 2vw rgba(0,0,0,0.05);
}

.category-scroll {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 2vw;
  gap: 2vw;
}

.category-scroll::-webkit-scrollbar {
  display: none;
}

.category-chip {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 22vw;
  padding: 2vw 0;
  border-radius: 2vw;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s, transform 0.2s;
}

.category-chip img {
  width: 10vw;
  height: 10vw;
  border-radius: 2vw;
  object-fit: cover;
  margin-bottom: 1vw;
}

.category-chip span {
  font-size: 3vw;
  color: #555;
  white-space: nowrap;
}

.category-chip.active {
  background: linear-gradient(to right, #fff1eb, #ace0f9);
}

.category-chip.active span {
  color: #333;
  font-weight: 700;
}

.category-chip:active {
  transform: scale(0.95);
}

/* ===== 商家列表 ===== */
.business {
  width: 100%; padding: 3vw 3vw 15vw; box-sizing: border-box;
}
.business li {
  width: 100%; box-sizing: border-box; padding: 3vw;
  background: #fff; border-radius: 3vw; margin-bottom: 3vw;
  display: flex; align-items: flex-start; cursor: pointer; user-select: none;
  box-shadow: 0 0.5vw 2vw rgba(0,0,0,0.05);
  transition: transform 0.15s, box-shadow 0.15s;
}
.business li:active {
  transform: scale(0.98); box-shadow: 0 0.3vw 1.2vw rgba(0,0,0,0.08);
}

.business .img-wrapper {
  width: 22vw; flex-shrink: 0; position: relative;
  border-radius: 2vw; overflow: hidden;
}
.business .img-wrapper img {
  width: 18vw; height: 18vw; border-radius: 2vw; object-fit: cover; display: block;
}
.business .img-wrapper .cart-badge {
  position: absolute; top: -1.5vw; right: 1vw; z-index: 2;
}

.business-feature {
  width: 16vw; height: 3.6vw; font-weight: 600; font-size: 2.1vw; color: #fff;
  position: absolute; left: -3.5vw; top: 0.5vw;
  display: flex; justify-content: center; align-items: flex-end;
  padding-bottom: 0.2vw; box-sizing: border-box;
  transform-origin: 50% 100%; transform: rotate(-45deg);
  box-shadow: rgba(0,0,0,0.25) 0.05vw 0.05vw 0.4vw;
  z-index: 1;
}
.feature-new       { background-color: #a55eea; border-bottom: 0.1vw solid #8854d0; }
.feature-hot       { background-color: #ff6b6b; border-bottom: 0.1vw solid #ee5a24; }
.feature-recommend { background-color: #ffa502; border-bottom: 0.1vw solid #e17055; }
.feature-health    { background-color: #2ed573; border-bottom: 0.1vw solid #1abc9c; }
.feature-popular   { background-color: #ff4757; border-bottom: 0.1vw solid #c44569; }

.business-info {
  flex: 1; padding-left: 2.5vw; overflow: hidden; min-width: 0;
}

.business-info-name {
  font-size: 4vw; color: #222; font-weight: 700;
  margin: 0 0 1.2vw 0; padding: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.business-info-row2 {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1.2vw;
}
.business-info-star {
  display: flex; align-items: center; font-size: 2.8vw; white-space: nowrap; flex-shrink: 0;
  margin: 0; padding: 0;
}
.business-info-star :deep(.van-rate) {
  padding-left: 0; margin-left: 0;
}
.business-info-star :deep(.van-rate__item:first-child) {
  padding-left: 0;
}
.business-info-star span {
  color: #999; margin-left: 1.5vw; font-size: 2.4vw;
}
.business-delivery-tag {
  background: #1989fa; color: #fff; font-size: 2.4vw; border-radius: 0.6vw;
  padding: 0.3vw 1.5vw; white-space: nowrap; flex-shrink: 0;
}

.business-info-delivery {
  display: flex; align-items: center; color: #888; font-size: 2.7vw;
  margin-bottom: 1.2vw; gap: 1.5vw;
}
.delivery-split { color: #ddd; }

.business-info-explain { display: flex; align-items: center; }
.business-info-explain span {
  border: 0.1vw solid #eee; font-size: 2.5vw; color: #999; border-radius: 0.8vw;
  padding: 0.2vw 2vw; background: #fafafa; max-width: 100%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
</style>
