<template>
  <div class="faq-search-wrapper">
    <!-- 搜索框 -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索常见问题，例如：Clash 导入失败、机场推荐..."
        class="search-input"
        @input="onSearch"
      />
      <button v-if="searchQuery" @click="clearSearch" class="clear-btn">×</button>
    </div>

    <!-- 热门问题 -->
    <div v-if="!searchQuery && hotQuestions.length" class="hot-questions">
      <h3 class="section-title">🔥 热门问题</h3>
      <div class="hot-list">
        <a
          v-for="(item, index) in hotQuestions"
          :key="index"
          :href="item.link"
          class="hot-item"
        >
          <span class="hot-rank">{{ index + 1 }}</span>
          <span class="hot-text">{{ item.question }}</span>
        </a>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-if="searchQuery && searchResults.length" class="search-results">
      <div class="result-header">
        找到 <strong>{{ searchResults.length }}</strong> 个相关问题
      </div>
      <div class="result-list">
        <a
          v-for="(item, index) in searchResults"
          :key="index"
          :href="item.link"
          class="result-item"
        >
          <div class="result-question" v-html="highlightText(item.question)"></div>
          <div v-if="item.category" class="result-category">{{ item.category }}</div>
        </a>
      </div>
    </div>

    <!-- 无结果 -->
    <div v-if="searchQuery && !searchResults.length" class="no-results">
      <div class="no-results-icon">🤔</div>
      <div class="no-results-text">没有找到相关问题</div>
      <div class="no-results-tip">试试换个关键词，或浏览下方分类查看全部问题</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';

const searchQuery = ref('');

// 热门问题（手动精选前 10 个高频问题）
const hotQuestions = [
  { question: '机场和 VPN 有什么区别？', link: '#q-basics-2' },
  { question: 'Clash 订阅链接如何导入？', link: '#q-import-1' },
  { question: '为什么晚高峰速度变慢？', link: '#q-troubleshooting-3' },
  { question: '哪些机场支持 Netflix 4K 解锁？', link: '#q-unlock-1' },
  { question: '什么是 IEPL 和 IPLC 专线？', link: '#q-lines-1' },
  { question: '如何防止机场跑路？', link: '#q-run-away-1' },
  { question: '学生党适合买多少钱的套餐？', link: '#q-buying-value-1' },
  { question: 'ChatGPT 为什么显示不可用地区？', link: '#q-unlock-2' },
  { question: '一个账号可以几台设备同时用？', link: '#q-accounts-devices-2' },
  { question: '机场推荐榜单可信吗？', link: '#q-rankings-trust-1' },
];

// 完整问题库（从实际 FAQ 中提取，简化版）
const allQuestions = [
  // 基础概念
  { question: '什么是机场？', category: '基础概念', link: '#basics' },
  { question: '机场和 VPN 有什么区别？', category: '基础概念', link: '#basics' },
  { question: '什么是订阅链接？', category: '基础概念', link: '#basics' },
  { question: '什么是节点？', category: '基础概念', link: '#basics' },
  { question: '科学上网合法吗？', category: '基础概念', link: '#basics' },
  { question: '什么是 Clash、V2Ray、Shadowrocket？', category: '基础概念', link: '#basics' },
  { question: 'SSR、Trojan、VMess 是什么？', category: '基础概念', link: '#basics' },
  { question: 'GFW 是什么？', category: '基础概念', link: '#basics' },

  // 新手入门
  { question: '第一次用机场该怎么选？', category: '新手入门', link: '#getting-started' },
  { question: '新手买多少钱的套餐合适？', category: '新手入门', link: '#getting-started' },
  { question: '机场月付还是年付划算？', category: '新手入门', link: '#getting-started' },
  { question: '需要准备多少个备用机场？', category: '新手入门', link: '#getting-started' },

  // 订阅导入
  { question: 'Clash 订阅链接如何导入？', category: '订阅导入', link: '#import' },
  { question: '小火箭订阅链接导入教程？', category: '订阅导入', link: '#import' },
  { question: 'V2Ray 如何导入订阅？', category: '订阅导入', link: '#import' },
  { question: '订阅链接导入失败怎么办？', category: '订阅导入', link: '#import' },
  { question: '订阅更新后节点消失了？', category: '订阅导入', link: '#import' },
  { question: '可以把订阅链接分享给朋友吗？', category: '订阅导入', link: '#import' },

  // 客户端选择
  { question: 'Windows 用什么客户端最好？', category: '客户端选择', link: '#clients' },
  { question: 'macOS 推荐什么客户端？', category: '客户端选择', link: '#clients' },
  { question: 'iOS 小火箭在哪下载？', category: '客户端选择', link: '#clients' },
  { question: 'Android 用什么客户端？', category: '客户端选择', link: '#clients' },
  { question: 'Clash Verge 和 Clash for Windows 区别？', category: '客户端选择', link: '#clients' },
  { question: '路由器能刷机场吗？', category: '客户端选择', link: '#clients' },
  { question: '电视盒子怎么科学上网？', category: '客户端选择', link: '#clients' },
  { question: '游戏主机能用机场吗？', category: '客户端选择', link: '#clients' },

  // 故障排查
  { question: '为什么晚高峰速度变慢？', category: '故障排查', link: '#troubleshooting' },
  { question: '节点连不上怎么办？', category: '故障排查', link: '#troubleshooting' },
  { question: 'YouTube 能打开但加载很慢？', category: '故障排查', link: '#troubleshooting' },
  { question: '延迟很低但网速很慢？', category: '故障排查', link: '#troubleshooting' },
  { question: '所有节点突然全挂了？', category: '故障排查', link: '#troubleshooting' },
  { question: 'Clash 显示连接超时？', category: '故障排查', link: '#troubleshooting' },
  { question: '连上节点但是没网？', category: '故障排查', link: '#troubleshooting' },
  { question: 'DNS 污染是什么？', category: '故障排查', link: '#troubleshooting' },
  { question: '代理规则和全局模式区别？', category: '故障排查', link: '#troubleshooting' },
  { question: 'IPv6 需要关闭吗？', category: '故障排查', link: '#troubleshooting' },
  { question: 'TUN 模式是什么？', category: '故障排查', link: '#troubleshooting' },

  // 线路科普
  { question: '什么是 IEPL 和 IPLC 专线？', category: '线路科普', link: '#lines' },
  { question: '中转线路和直连有什么区别？', category: '线路科普', link: '#lines' },
  { question: 'BGP 中转是什么？', category: '线路科普', link: '#lines' },
  { question: 'CN2 GIA 线路好在哪？', category: '线路科普', link: '#lines' },
  { question: '什么是隧道中转？', category: '线路科普', link: '#lines' },
  { question: '为什么专线比普通线路贵？', category: '线路科普', link: '#lines' },
  { question: '游戏加速需要什么线路？', category: '线路科普', link: '#lines' },
  { question: '直连、中转、专线怎么选？', category: '线路科普', link: '#lines' },
  { question: '什么是公网 IP 和内网 IP？', category: '线路科普', link: '#lines' },
  { question: '什么是倍率流量？', category: '线路科普', link: '#lines' },

  // 流媒体与 AI 解锁
  { question: '哪些机场支持 Netflix 4K 解锁？', category: '流媒体与AI', link: '#unlock' },
  { question: 'ChatGPT 为什么显示不可用地区？', category: '流媒体与AI', link: '#unlock' },
  { question: '什么是原生 IP 和住宅 IP？', category: '流媒体与AI', link: '#unlock' },
  { question: 'Disney+ 需要什么节点？', category: '流媒体与AI', link: '#unlock' },
  { question: 'TikTok 解锁需要注意什么？', category: '流媒体与AI', link: '#unlock' },
  { question: 'Claude 为什么提示地区限制？', category: '流媒体与AI', link: '#unlock' },
  { question: 'Spotify 能用机场听吗？', category: '流媒体与AI', link: '#unlock' },
  { question: 'YouTube Premium 合租安全吗？', category: '流媒体与AI', link: '#unlock' },
  { question: 'Midjourney 需要美国节点吗？', category: '流媒体与AI', link: '#unlock' },
  { question: 'Gemini 为什么访问不了？', category: '流媒体与AI', link: '#unlock' },
  { question: '流媒体解锁检测工具推荐？', category: '流媒体与AI', link: '#unlock' },
  { question: '为什么有些节点 Netflix 能看有些不行？', category: '流媒体与AI', link: '#unlock' },
  { question: 'Apple Music 和 Spotify 区域怎么改？', category: '流媒体与AI', link: '#unlock' },
  { question: 'HBO Max 需要美国原生 IP 吗？', category: '流媒体与AI', link: '#unlock' },
  { question: 'ChatGPT Plus 注册教程？', category: '流媒体与AI', link: '#unlock' },
  { question: 'OpenAI API 为什么被封？', category: '流媒体与AI', link: '#unlock' },
  { question: '用机场登录 ChatGPT 会被封号吗？', category: '流媒体与AI', link: '#unlock' },

  // 防跑路与应急
  { question: '如何防止机场跑路？', category: '防跑路', link: '#run-away' },
  { question: '机场跑路前有什么征兆？', category: '防跑路', link: '#run-away' },
  { question: '机场跑路了怎么办？', category: '防跑路', link: '#run-away' },
  { question: '买了年付机场跑了能追回吗？', category: '防跑路', link: '#run-away' },
  { question: '机场倒闭前会通知用户吗？', category: '防跑路', link: '#run-away' },
  { question: '备用机场怎么选？', category: '防跑路', link: '#run-away' },
  { question: '敏感时期机场会炸吗？', category: '防跑路', link: '#run-away' },
  { question: '机场维护一般多久？', category: '防跑路', link: '#run-away' },
  { question: '机场 TG 群被封说明什么？', category: '防跑路', link: '#run-away' },

  // 榜单与信息甄别
  { question: '机场推荐榜单可信吗？', category: '信息甄别', link: '#rankings-trust' },
  { question: '如何识别虚假测速图？', category: '信息甄别', link: '#rankings-trust' },
  { question: 'YouTube 测评视频靠谱吗？', category: '信息甄别', link: '#rankings-trust' },
  { question: '机场推荐返利链接是什么？', category: '信息甄别', link: '#rankings-trust' },
  { question: '如何判断机场是自营还是代理？', category: '信息甄别', link: '#rankings-trust' },
  { question: '机场官网写的「稳定三年」可信吗？', category: '信息甄别', link: '#rankings-trust' },
  { question: '为什么不同榜单推荐的机场完全不同？', category: '信息甄别', link: '#rankings-trust' },
  { question: '机场自己说的用户数可信吗？', category: '信息甄别', link: '#rankings-trust' },
  { question: '如何验证机场是否真的有专线？', category: '信息甄别', link: '#rankings-trust' },
  { question: '机场客服态度能反映机场质量吗？', category: '信息甄别', link: '#rankings-trust' },

  // 账号与设备
  { question: '一个账号可以几台设备同时用？', category: '账号设备', link: '#accounts-devices' },
  { question: '设备数限制是怎么算的？', category: '账号设备', link: '#accounts-devices' },
  { question: '可以和朋友共享账号吗？', category: '账号设备', link: '#accounts-devices' },
  { question: '换手机需要重新买吗？', category: '账号设备', link: '#accounts-devices' },
  { question: '账号被封了怎么办？', category: '账号设备', link: '#accounts-devices' },
  { question: '忘记机场账号密码了怎么办？', category: '账号设备', link: '#accounts-devices' },
  { question: '可以改绑邮箱吗？', category: '账号设备', link: '#accounts-devices' },

  // 安全、隐私与合规
  { question: '机场能看到我的上网记录吗？', category: '安全隐私', link: '#q-security-privacy-1' },
  { question: '机场会保存我的浏览历史吗？', category: '安全隐私', link: '#q-security-privacy-2' },
  { question: '机场订阅链接泄露后有什么风险？', category: '安全隐私', link: '#q-security-privacy-3' },
  { question: '机场订阅链接可以放在在线转换器里吗？', category: '安全隐私', link: '#q-security-privacy-4' },
  { question: '如何安全下载 Clash 客户端？', category: '安全隐私', link: '#q-security-privacy-5' },
  { question: '机场客户端需要关闭杀毒软件吗？', category: '安全隐私', link: '#q-security-privacy-6' },
  { question: '机场登录密码和邮箱密码要一样吗？', category: '安全隐私', link: '#q-security-privacy-7' },
  { question: '机场支付时要注意什么？', category: '安全隐私', link: '#q-security-privacy-8' },
  { question: '机场是否适合处理敏感工作资料？', category: '安全隐私', link: '#q-security-privacy-9' },
  { question: '使用机场时应该开全局模式吗？', category: '安全隐私', link: '#q-security-privacy-10' },
  { question: '为什么不建议在公共 Wi-Fi 下登录机场后台？', category: '安全隐私', link: '#q-security-privacy-11' },
  { question: '机场更换域名后如何确认是真官网？', category: '安全隐私', link: '#q-security-privacy-12' },
  { question: '机场可以记录我的真实 IP 吗？', category: '安全隐私', link: '#q-security-privacy-13' },
  { question: '机场服务在不同地区使用有什么合规风险？', category: '安全隐私', link: '#q-security-privacy-14' },
  { question: '如何减少机场账号被盗或被封的风险？', category: '安全隐私', link: '#q-security-privacy-15' },
];

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return [];

  const query = searchQuery.value.toLowerCase().trim();
  return allQuestions.filter(item =>
    item.question.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );
});

const onSearch = () => {
  // 搜索逻辑已通过 computed 实现
};

const clearSearch = () => {
  searchQuery.value = '';
};

// 通过搜索结果或外部链接直达问题时，自动展开对应折叠项
const openQuestionFromHash = () => {
  if (typeof window === 'undefined' || !window.location.hash) return;
  const targetId = decodeURIComponent(window.location.hash.slice(1));
  if (!targetId.startsWith('q-')) return;
  nextTick(() => {
    const target = document.getElementById(targetId);
    if (target && target.tagName.toLowerCase() === 'details') {
      target.open = true;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

onMounted(() => {
  openQuestionFromHash();
  window.addEventListener('hashchange', openQuestionFromHash);
});

const highlightText = (text) => {
  if (!searchQuery.value) return text;
  const regex = new RegExp(`(${searchQuery.value})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};
</script>

<style scoped>
.faq-search-wrapper {
  margin: 32px 0 48px;
}

/* 搜索框 */
.search-box {
  position: relative;
  max-width: 720px;
  margin: 0 auto 32px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  pointer-events: none;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 50px;
  font-size: 15px;
  border: 2px solid #e4e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s;
  background: #fff;
  color: #1e2433;
}

.search-input:focus {
  border-color: #1565c0;
  box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.1);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  border: none;
  background: #e5e7eb;
  border-radius: 50%;
  font-size: 20px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #d1d5db;
  color: #374151;
}

/* 热门问题 */
.hot-questions {
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e2433;
  margin: 0 0 16px 0;
}

.hot-list {
  display: grid;
  gap: 10px;
}

.hot-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e4e8f0;
  border-radius: 8px;
  text-decoration: none;
  color: #1e2433;
  transition: all 0.2s;
}

.hot-item:hover {
  border-color: #1565c0;
  background: rgba(21, 101, 192, 0.02);
  transform: translateX(4px);
}

.hot-rank {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #1565c0, #1976d2);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.hot-text {
  font-size: 15px;
  font-weight: 500;
}

/* 搜索结果 */
.search-results {
  max-width: 900px;
  margin: 0 auto;
}

.result-header {
  font-size: 14px;
  color: #596580;
  margin-bottom: 16px;
}

.result-header strong {
  color: #1565c0;
  font-weight: 700;
}

.result-list {
  display: grid;
  gap: 10px;
}

.result-item {
  display: block;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #e4e8f0;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
}

.result-item:hover {
  border-color: #1565c0;
  background: rgba(21, 101, 192, 0.02);
  transform: translateX(4px);
}

.result-question {
  font-size: 15px;
  font-weight: 500;
  color: #1e2433;
  margin-bottom: 4px;
}

.result-question :deep(mark) {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 4px;
  border-radius: 3px;
}

.result-category {
  font-size: 12px;
  color: #596580;
  background: #f0f4fa;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 无结果 */
.no-results {
  text-align: center;
  padding: 48px 20px;
  color: #596580;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results-text {
  font-size: 18px;
  font-weight: 600;
  color: #1e2433;
  margin-bottom: 8px;
}

.no-results-tip {
  font-size: 14px;
}

/* 暗色模式 */
[data-theme="dark"] .search-input {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

[data-theme="dark"] .search-input:focus {
  border-color: #42a5f5;
  box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.1);
}

[data-theme="dark"] .hot-item,
[data-theme="dark"] .result-item {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

[data-theme="dark"] .hot-item:hover,
[data-theme="dark"] .result-item:hover {
  border-color: #42a5f5;
  background: rgba(66, 165, 245, 0.05);
}

[data-theme="dark"] .section-title,
[data-theme="dark"] .result-question,
[data-theme="dark"] .no-results-text {
  color: #f9fafb;
}

[data-theme="dark"] .result-header,
[data-theme="dark"] .result-category,
[data-theme="dark"] .no-results {
  color: #d1d5db;
}

[data-theme="dark"] .result-category {
  background: #374151;
}

/* 移动端 */
@media (max-width: 768px) {
  .search-input {
    font-size: 14px;
    padding: 12px 44px 12px 46px;
  }

  .hot-item,
  .result-item {
    padding: 10px 12px;
  }

  .hot-text,
  .result-question {
    font-size: 14px;
  }
}
</style>
