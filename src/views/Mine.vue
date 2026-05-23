<template>
  <div class="wrapper">
    <van-nav-bar
      title="我的"
      style="background: linear-gradient(to right, #fff1eb, #ace0f9)"
    />

    <!-- 用户信息头部 -->
    <div class="user-header">
      <div class="user-header-bg"></div>
      <div class="user-info" @click="goToLogin" v-if="!isLoggedIn">
        <van-image
          round
          width="16vw"
          height="16vw"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
          class="avatar"
        />
        <span class="login-text">点击登录</span>
        <van-icon name="arrow" color="#fff" size="4vw" />
      </div>
      <div class="user-info logged-in" v-else>
        <van-image
          round
          width="16vw"
          height="16vw"
          :src="userInfo.accountImg || 'https://img.yzcdn.cn/vant/cat.jpeg'"
          class="avatar"
        />
        <div class="user-detail">
          <span class="nickname">{{ userInfo.accountName || '用户' }}</span>
          <span class="phone">{{ displayPhone }}</span>
        </div>
        <van-icon
          :name="phoneVisible ? 'eye-o' : 'closed-eye'"
          color="#fff"
          size="5vw"
          @click="phoneVisible = !phoneVisible"
        />
      </div>
    </div>

    <!-- 我的资产 -->
    <div class="assets-bar">
      <div class="asset-item">
        <span class="asset-val">0</span>
        <span class="asset-label">余额</span>
      </div>
      <div class="asset-item">
        <span class="asset-val">0</span>
        <span class="asset-label">积分</span>
      </div>
      <div class="asset-item">
        <span class="asset-val">0</span>
        <span class="asset-label">优惠券</span>
      </div>
    </div>

    <!-- 我的订单 -->
    <div class="section-card">
      <div class="section-title" @click="goToOrders">
        <span>我的订单</span>
        <div class="section-title-right">
          <span class="all-orders">全部订单</span>
          <van-icon name="arrow" color="#999" size="3.5vw" />
        </div>
      </div>
      <div class="order-icons">
        <div class="order-item" @click="goToOrders('pending')">
          <van-icon name="balance-o" size="6vw" color="#494949" />
          <span>待付款</span>
        </div>
        <div class="order-item" @click="goToOrders('receiving')">
          <van-icon name="send-gift-o" size="6vw" color="#494949" />
          <span>待收货</span>
        </div>
        <div class="order-item" @click="goToOrders('comment')">
          <van-icon name="comment-o" size="6vw" color="#494949" />
          <span>待评价</span>
        </div>
      </div>
    </div>

    <!-- 功能入口 -->
    <div class="section-card">
      <van-cell
        title="收货地址"
        icon="location-o"
        is-link
        @click="goToAddress"
      />
      <van-cell
        title="我的收藏"
        icon="star-o"
        is-link
        @click="goToFavorites"
      />
      <van-cell
        title="客服中心"
        icon="service-o"
        is-link
        @click="goToService"
      />
    </div>

    <!-- 设置 -->
    <div class="section-card">
      <van-cell
        title="设置"
        icon="setting-o"
        is-link
        @click="goToSettings"
      />
      <van-cell
        title="关于我们"
        icon="info-o"
        is-link
        @click="goToAbout"
      />
    </div>

    <!-- 退出登录 -->
    <div class="logout-wrap" v-if="isLoggedIn">
      <van-button
        round
        block
        @click="handleLogout"
        style="background: linear-gradient(to right, #009966, #3cba92)"
      >
        退出登录
      </van-button>
    </div>

    <!-- 注销账号 -->
    <div class="logout-wrap" v-if="isLoggedIn">
      <van-button
        round
        block
        @click="handleCancelAccount"
        style="background: linear-gradient(to right, #e8932b, #d4751e)"
      >
        注销账号
      </van-button>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showConfirmDialog, showSuccessToast } from 'vant';
import Footer from '@/components/Footer.vue';
import { getSessionStorage, setSessionStorage } from '@/common.js';

const router = useRouter();

const isLoggedIn = ref(false);
const userInfo = ref({});
const phoneVisible = ref(false);

const displayPhone = computed(() => {
  const phone = userInfo.value.accountId || '';
  if (!phoneVisible.value && phone.length === 11) {
    return phone.slice(0, 3) + '****' + phone.slice(7);
  }
  return phone;
});

onMounted(() => {
  const account = getSessionStorage('account');
  if (account) {
    isLoggedIn.value = true;
    userInfo.value = account;
  }
});

const goToLogin = () => {
  if (!isLoggedIn.value) {
    router.push('/login');
  }
};

const goToOrders = (type) => {
  if (!isLoggedIn.value) {
    router.push('/login');
    return;
  }
  router.push({ path: '/orders', query: { type } });
};

const goToAddress = () => {
  showSuccessToast('功能开发中');
};

const goToFavorites = () => {
  showSuccessToast('功能开发中');
};

const goToService = () => {
  showSuccessToast('功能开发中');
};

const goToSettings = () => {
  showSuccessToast('功能开发中');
};

const goToAbout = () => {
  showSuccessToast('功能开发中');
};

const handleLogout = () => {
  showConfirmDialog({
    title: '提示',
    message: '确定要退出登录吗？',
  })
    .then(() => {
      setSessionStorage('account', null);
      isLoggedIn.value = false;
      userInfo.value = {};
      showSuccessToast('已退出登录');
    })
    .catch(() => {});
};

const handleCancelAccount = () => {
  showConfirmDialog({
    title: '警告',
    message: '注销后所有数据将被永久删除且无法恢复，确定要注销账号吗？',
  })
    .then(() => {
      setSessionStorage('account', null);
      isLoggedIn.value = false;
      userInfo.value = {};
      showSuccessToast('账号已注销');
    })
    .catch(() => {});
};
</script>

<style scoped>
.wrapper {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 16vw;
}

/* 用户信息头部 */
.user-header {
  position: relative;
  height: 38vw;
  overflow: hidden;
}

.user-header-bg {
  position: absolute;
  top: -10vw;
  left: 0;
  right: 0;
  height: 55vw;
  background: linear-gradient(to right, #009966, #3cba92);
  border-radius: 0 0 50% 50%;
}

.user-info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 8vw 5vw 0;
  color: #fff;
}

.user-info.logged-in {
  padding-top: 10vw;
}

.avatar {
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.login-text {
  margin-left: 3vw;
  font-size: 4.5vw;
  flex: 1;
}

.user-detail {
  display: flex;
  flex-direction: column;
  margin-left: 3vw;
  flex: 1;
}

.nickname {
  font-size: 5vw;
  font-weight: 600;
}

.phone {
  font-size: 3.2vw;
  margin-top: 1vw;
  opacity: 0.8;
}

/* 资产栏 */
.assets-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  margin: -6vw 4vw 0;
  padding: 4vw 0;
  border-radius: 3vw;
  position: relative;
  z-index: 2;
  box-shadow: 0 1vw 3vw rgba(0, 0, 0, 0.06);
}

.asset-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-val {
  font-size: 5vw;
  font-weight: 700;
  color: #009966;
}

.asset-label {
  font-size: 3.2vw;
  color: #999;
  margin-top: 1.5vw;
}

/* 区块卡片 */
.section-card {
  background: #fff;
  margin: 3vw 4vw;
  border-radius: 3vw;
  overflow: hidden;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4vw;
  font-size: 4vw;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f5f5f5;
}

.section-title-right {
  display: flex;
  align-items: center;
}

.all-orders {
  font-size: 3.5vw;
  color: #999;
  font-weight: 400;
  margin-right: 1vw;
}

/* 订单图标行 */
.order-icons {
  display: flex;
  justify-content: space-around;
  padding: 4vw 0;
}

.order-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vw;
  font-size: 3.2vw;
  color: #666;
}

/* 退出登录 */
.logout-wrap {
  margin: 6vw 4vw;
}
</style>
