<template>
  <div class="airport-comparison-tool">
    <div class="tool-header">
      <h2 class="tool-title">✈️ 机场对比工具</h2>
      <p class="tool-desc">选择 2-3 个机场进行全方位对比，找到最适合你的那一个</p>
    </div>

    <!-- 机场选择器 -->
    <div class="airport-selector">
      <div
        v-for="(airport, index) in selectedAirports"
        :key="index"
        class="selector-slot"
      >
        <select
          v-model="selectedAirports[index]"
          class="airport-select"
          @change="onAirportChange"
        >
          <option value="">选择机场 {{ index + 1 }}</option>
          <option
            v-for="item in availableAirports"
            :key="item.id"
            :value="item.id"
            :disabled="selectedAirports.includes(item.id) && selectedAirports[index] !== item.id"
          >
            {{ item.name }}
          </option>
        </select>
      </div>

      <button
        v-if="selectedAirports.length < 3"
        @click="addSlot"
        class="add-slot-btn"
      >
        + 添加对比
      </button>
    </div>

    <!-- 对比表格 -->
    <div v-if="comparisonData.length > 0" class="comparison-table-wrapper">
      <table class="comparison-table">
        <thead>
          <tr>
            <th class="feature-col">对比项</th>
            <th v-for="item in comparisonData" :key="item.id" class="airport-col">
              {{ item.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- 月付价格 -->
          <tr>
            <td class="feature-name">💰 月付价格</td>
            <td v-for="item in comparisonData" :key="item.id" :class="getBestClass('price', item.price)">
              {{ item.price }}
            </td>
          </tr>

          <!-- 线路类型 -->
          <tr>
            <td class="feature-name">🛤️ 线路类型</td>
            <td v-for="item in comparisonData" :key="item.id" :class="getBestClass('line', item.line)">
              {{ item.line }}
            </td>
          </tr>

          <!-- 流量 -->
          <tr>
            <td class="feature-name">📊 月流量</td>
            <td v-for="item in comparisonData" :key="item.id">
              {{ item.traffic }}
            </td>
          </tr>

          <!-- 设备数 -->
          <tr>
            <td class="feature-name">📱 同时在线设备</td>
            <td v-for="item in comparisonData" :key="item.id">
              {{ item.devices }}
            </td>
          </tr>

          <!-- Netflix -->
          <tr>
            <td class="feature-name">🎬 Netflix 解锁</td>
            <td v-for="item in comparisonData" :key="item.id">
              <span :class="getCheckClass(item.netflix)">{{ item.netflix ? '✓' : '✗' }}</span>
            </td>
          </tr>

          <!-- ChatGPT -->
          <tr>
            <td class="feature-name">🤖 ChatGPT 支持</td>
            <td v-for="item in comparisonData" :key="item.id">
              <span :class="getCheckClass(item.chatgpt)">{{ item.chatgpt ? '✓' : '✗' }}</span>
            </td>
          </tr>

          <!-- 运营时长 -->
          <tr>
            <td class="feature-name">⏱️ 运营时长</td>
            <td v-for="item in comparisonData" :key="item.id" :class="getBestClass('years', item.years)">
              {{ item.years }}
            </td>
          </tr>

          <!-- 试用 -->
          <tr>
            <td class="feature-name">🎁 试用/退款</td>
            <td v-for="item in comparisonData" :key="item.id">
              {{ item.trial }}
            </td>
          </tr>

          <!-- 官网链接 -->
          <tr class="link-row">
            <td class="feature-name">🔗 官网</td>
            <td v-for="item in comparisonData" :key="item.id">
              <a :href="item.link" target="_blank" rel="noopener" class="visit-btn">
                访问官网
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">📋</div>
      <div class="empty-text">请至少选择 1 个机场开始对比</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedAirports = ref(['', '']);

// 机场数据库 - 完整列表(与 airport/README.md 同步)
const availableAirports = [
  { id: 'jilianyun', name: '极连云', price: '8元/月起', line: 'IPLC专线', traffic: '60GB', devices: '不限', netflix: true, chatgpt: true, years: '3年+', trial: '无', link: 'https://haozevpn.jlyvipaff.com/#/?code=KUKfOY13' },
  { id: 'guangnianti', name: '光年梯', price: '7.5元/月起', line: '物理内网专线', traffic: '50GB', devices: '不限', netflix: true, chatgpt: true, years: '4年+', trial: '无', link: 'https://gnt001.gntvipaff.cc/#/?code=j1ufpE44' },
  { id: 'feimao', name: '飞猫云', price: '25元/月起', line: 'IPLC专线', traffic: '150GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://flycat.flycatvipaff.cc/#/?code=1arEKHqh' },
  { id: 'yuntu', name: '云图机场', price: '25元/月起', line: '金融级专线', traffic: '150GB', devices: '5台', netflix: true, chatgpt: true, years: '3年+', trial: '无', link: 'https://super.ytjcok.org/#/register?code=qPHQtI9a' },
  { id: 'kexinyun', name: '可信云', price: '8元/月起', line: 'IEPL专线', traffic: '60GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://haibing822.kosingaff.com/#/register?code=zcjBlIde' },
  { id: 'sujie', name: '速界', price: '7.5元/月起', line: 'IPLC专线', traffic: '50GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://everett7623.speedworldaff.com/#/register?code=r7IOqoY7' },
  { id: 'kuaili', name: '快狸', price: '10元/月起', line: 'IPLC专线', traffic: '30GB', devices: '3台', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://yyo649929.kuailiaff.com/#/register?code=G56QwHto' },
  { id: 'bianyuanjiedian', name: '边缘节点', price: '9元/月起', line: 'IEPL专线', traffic: '45GB', devices: '3台', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://zoio.edgenovaaff.cc/#/register?code=Oy1wZvzJ' },
  { id: 'guangsuyun', name: '光速云', price: '8.25元/月起', line: 'IPLC专线', traffic: '59GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://kjlq01.gsyvipaff.cc/#/?code=b1OTkTeL' },
  { id: 'yingzi', name: '影子', price: '18.8元/月起', line: 'IEPL专线', traffic: '150GB', devices: '5台', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://www.yingzi01.com/register?code=X7XPN1cS' },
  { id: 'bianjie', name: '边界云机场', price: '12.33元/月起', line: 'IEPL专线', traffic: '50GB', devices: '3台', netflix: true, chatgpt: true, years: '2年+', trial: '3天退款', link: 'https://www.lvpn.cc/r/6UQDZT' },
  { id: 'nice', name: 'Nice加速', price: '10元/月起', line: '家宽专线', traffic: '40GB', devices: '不限', netflix: true, chatgpt: true, years: '1年+', trial: '无', link: 'https://web.nicecc.cc/#/register?code=7nNS5xdG' },
  { id: 'lingmao', name: '灵猫网络', price: '7.08元/月起', line: 'IPLC专线', traffic: '45GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://haozevpn.civetaff.com/#/?code=1pboeliL' },
  { id: 'xingdaomeng', name: '星岛梦', price: '16元/月起', line: 'IPLC专线', traffic: '100GB', devices: '不限', netflix: true, chatgpt: true, years: '3年+', trial: '无', link: 'https://wuyou202001.xdmvipaff.cc/#/?code=olWCiAhj' },
  { id: 'quanqiuyun', name: '全球云', price: '20元/月起', line: 'IPLC专线', traffic: '120GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://haozevpn.gcvipaff.cc/#/?code=WRQJc2v4' },
  { id: 'shunyun', name: '瞬云机场', price: '8.25元/月起', line: 'ANYCAST专线', traffic: '59GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://ccc.jichang.best/#/register?code=o4I4kToe' },
  { id: 'huanyuyun', name: '寰宇云机场', price: '7.42元/月起', line: 'IPLC专线', traffic: '60GB', devices: '5台', netflix: true, chatgpt: true, years: '3年+', trial: '无', link: 'https://vip3.huanyuyunbest.com/#/register?code=K6h5VWw2' },
  { id: 'lumina', name: 'Lumina', price: '10元/月起', line: '专线', traffic: '200GB', devices: '3台', netflix: true, chatgpt: true, years: '1年+', trial: '无', link: 'https://luminak.net/?token=lumina#/register?code=dCgHyjFi' },
  { id: 'pinhaolian', name: '拼好连', price: '9.9元/月起', line: 'IPLC专线', traffic: '100GB', devices: '不限', netflix: true, chatgpt: true, years: '1年+', trial: '无', link: 'https://sxzofrnamc.runwayhz.com/#/register?code=A63zaSvx' },
  { id: '99ba', name: '99吧', price: '7.5元/月起', line: 'IEPL专线', traffic: '66GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://99vpn.bar/#/register?code=Uni7IOJh' },
  { id: 'jinyun', name: '锦云', price: '6元/月起', line: 'IPLC专线', traffic: '50GB', devices: '3台', netflix: true, chatgpt: false, years: '2年+', trial: '无', link: 'https://w2.whengdl.com/#/register?code=BIGc8qrQ' },
  { id: 'jisuyun', name: '极速云机场', price: '8.25元/月起', line: 'IEPL专线', traffic: '800GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://tg.sintotgch.com/#/register?code=RENHYxqv' },
  { id: 'shanshuiyun', name: '山水云', price: '14.99元/月起', line: 'IPLC专线', traffic: '100GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://ss2.byvvcsx.com/#/register?code=jkziWeb8' },
  { id: 'miaomiaoyun', name: '秒秒云', price: '14元/月起', line: 'IEPL专线', traffic: '128GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://141.11.77.26/#/register?code=g3bq7bpK' },
  { id: 'xundavpn', name: '迅达VPN', price: '15元/月起', line: 'IPLC专线', traffic: '150GB', devices: '5台', netflix: true, chatgpt: false, years: '2年+', trial: '无', link: 'https://sulianproxy.com/register?code=lfITU4zy' },
  { id: 'edgex', name: 'Edge-X机场', price: '16.8元/月起', line: 'IEPL专线', traffic: '100GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://edge-invite.net/#/register?code=73ienU2h' },
  { id: 'keda', name: '可达加速器', price: '10元/月起', line: 'IPLC专线', traffic: '100GB', devices: '3台', netflix: true, chatgpt: false, years: '1年+', trial: '无', link: 'https://1.mkd997.com/#/register?code=JgTY5JiT' },
  { id: 'naiyun', name: '奈云', price: '10.6元/月起', line: 'IEPL专线', traffic: '168GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://airportgo.org/go.php' },
  { id: 'yinyun', name: '隐云', price: '25元/月起', line: 'IPLC专线', traffic: '150GB', devices: '5台', netflix: true, chatgpt: false, years: '2年+', trial: '无', link: 'https://airportgo.org/go.php' },
  { id: 'shanhai', name: '山海机场', price: '6元/月起', line: 'IEPL专线', traffic: '45GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://shanhai.sbs/#/register?code=qVTbPfWP' },
  { id: 'lizione', name: 'LiZione', price: '10元/月起', line: 'IPLC专线', traffic: '100GB', devices: '3台', netflix: true, chatgpt: false, years: '2年+', trial: '无', link: 'https://lizione.vip?path=register&code=Wmf3jYMy' },
  { id: 'duolaameng', name: '哆啦A梦', price: '10元/月起', line: 'IEPL专线', traffic: '100GB', devices: '不限', netflix: true, chatgpt: true, years: '1年+', trial: '无', link: 'https://store.yyds2-doraemon.site/login/register?invite_code=5VxQMw0k' },
  { id: 'dageyun', name: '大哥云', price: '19.9元/月起', line: 'IPLC专线', traffic: '100GB', devices: '5台', netflix: true, chatgpt: false, years: '3年+', trial: '试用', link: 'https://airportgo.org/go.php' },
  { id: 'longmaoyun', name: '龙猫云', price: '15元/月起', line: 'IEPL专线', traffic: '150GB', devices: '5台', netflix: true, chatgpt: false, years: '2年+', trial: '无', link: 'https://airportgo.org/go.php' },
  { id: 'feiniao', name: '飞鸟机场', price: '15元/月起', line: 'IPLC专线', traffic: '100GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://airportgo.org/go.php' },
  { id: 'qingyunti', name: '青云梯', price: '8元/月起', line: 'IEPL专线', traffic: '60GB', devices: '不限', netflix: true, chatgpt: true, years: '2年+', trial: '无', link: 'https://airportgo.org/go.php' },
  { id: 'huayun', name: '花云(FlowerCloud)', price: '10.67元/月起', line: 'IPLC专线', traffic: '20GB', devices: '3台', netflix: true, chatgpt: false, years: '5年+', trial: '无', link: 'https://api-flowercloud.com/aff.php?aff=16018' },
];

const comparisonData = computed(() => {
  return selectedAirports.value
    .filter(id => id)
    .map(id => availableAirports.find(a => a.id === id))
    .filter(Boolean);
});

const onAirportChange = () => {
  // 自动触发对比
};

const addSlot = () => {
  if (selectedAirports.value.length < 3) {
    selectedAirports.value.push('');
  }
};

const getBestClass = (type, value) => {
  if (comparisonData.value.length < 2) return '';

  if (type === 'price') {
    const prices = comparisonData.value.map(a => parseInt(a.price));
    const minPrice = Math.min(...prices);
    return parseInt(value) === minPrice ? 'best-value' : '';
  }

  if (type === 'line') {
    return value.includes('IEPL') || value.includes('IPLC') ? 'best-value' : '';
  }

  if (type === 'years') {
    const years = comparisonData.value.map(a => parseInt(a.years));
    const maxYears = Math.max(...years);
    return parseInt(value) === maxYears ? 'best-value' : '';
  }

  return '';
};

const getCheckClass = (value) => {
  return value ? 'check-yes' : 'check-no';
};
</script>

<style scoped>
.airport-comparison-tool {
  margin: 0 0 48px 0;
  padding: 32px;
  background: linear-gradient(135deg, #FBF9F5 0%, #F7F4EF 100%);
  border-radius: 16px;
  border: 1px solid #E7E1D7;
}

.tool-header {
  text-align: center;
  margin-bottom: 32px;
}

.tool-title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2421;
  margin: 0 0 8px 0;
}

.tool-desc {
  font-size: 15px;
  color: #5C635D;
  margin: 0;
}

/* 选择器 */
.airport-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
}

.selector-slot {
  flex: 1;
  min-width: 200px;
  max-width: 280px;
}

.airport-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 2px solid #E7E1D7;
  border-radius: 8px;
  background: #FFFFFF;
  color: #1F2421;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
}

.airport-select:hover {
  border-color: #C4612F;
}

.airport-select:focus {
  border-color: #C4612F;
  box-shadow: 0 0 0 3px rgba(196, 97, 47, 0.1);
}

.add-slot-btn {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: #C4612F;
  background: #FFFFFF;
  border: 2px dashed #C4612F;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-slot-btn:hover {
  background: rgba(196, 97, 47, 0.05);
  border-style: solid;
}

/* 对比表格 */
.comparison-table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
}

.comparison-table thead {
  background: linear-gradient(135deg, #C4612F, #A94E22);
  color: #fff;
}

.comparison-table th {
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

.comparison-table .feature-col {
  width: 30%;
  min-width: 140px;
}

.comparison-table .airport-col {
  text-align: center;
}

.comparison-table tbody tr {
  border-bottom: 1px solid #E7E1D7;
  transition: background 0.2s;
}

.comparison-table tbody tr:hover {
  background: rgba(196, 97, 47, 0.02);
}

.comparison-table tbody tr:last-child {
  border-bottom: none;
}

.comparison-table td {
  padding: 14px 16px;
  font-size: 14px;
  text-align: center;
}

.feature-name {
  font-weight: 600;
  color: #1F2421;
  text-align: left !important;
  background: #FBF9F5;
}

.best-value {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  font-weight: 700;
  color: #065f46;
  position: relative;
}

.best-value::before {
  content: '⭐';
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
}

.check-yes {
  color: #10b981;
  font-size: 18px;
  font-weight: 700;
}

.check-no {
  color: #dc2626;
  font-size: 18px;
  font-weight: 700;
  opacity: 0.4;
}

.link-row {
  background: #FBF9F5;
}

.visit-btn {
  display: inline-block;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #C4612F;
  border-radius: 999px;
  text-decoration: none;
  transition: all 0.2s;
}

.visit-btn:hover {
  background: #A94E22;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 97, 47, 0.3);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #5C635D;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
}

/* 暗色模式 */
[data-theme="dark"] .airport-comparison-tool {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-color: #374151;
}

[data-theme="dark"] .tool-title {
  color: #f9fafb;
}

[data-theme="dark"] .tool-desc {
  color: #d1d5db;
}

[data-theme="dark"] .airport-select {
  background: #1f2937;
  border-color: #374151;
  color: #f9fafb;
}

[data-theme="dark"] .add-slot-btn {
  background: #1f2937;
  color: #42a5f5;
  border-color: #42a5f5;
}

[data-theme="dark"] .comparison-table-wrapper {
  background: #1f2937;
}

[data-theme="dark"] .comparison-table thead {
  background: linear-gradient(135deg, #42a5f5, #64b5f6);
}

[data-theme="dark"] .comparison-table tbody tr {
  border-bottom-color: #374151;
}

[data-theme="dark"] .feature-name {
  color: #f9fafb;
  background: #374151;
}

[data-theme="dark"] .link-row {
  background: #374151;
}

[data-theme="dark"] .comparison-table td {
  color: #d1d5db;
}

/* 移动端 */
@media (max-width: 768px) {
  .airport-comparison-tool {
    padding: 20px;
  }

  .tool-title {
    font-size: 22px;
  }

  .airport-selector {
    flex-direction: column;
  }

  .selector-slot {
    max-width: 100%;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 10px 8px;
    font-size: 13px;
  }

  .visit-btn {
    padding: 6px 14px;
    font-size: 13px;
  }
}
</style>
