import { defineClientConfig } from "vuepress/client";
import UmamiStats from "./components/UmamiStats.vue";

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component("UmamiStats", UmamiStats);
  },
  setup() {},
  rootComponents: [],
});

// 植物标本馆动态装饰效果 - 在页面加载后执行
if (typeof window !== 'undefined') {
  // 创建漂浮的植物叶片装饰
  const createFloatingLeaves = () => {
    const container = document.querySelector('body');
    if (!container) return;

    // 清理已存在的叶片
    const existingLeaves = document.querySelectorAll('.floating-botanical-leaf');
    existingLeaves.forEach(leaf => leaf.remove());

    const leafCount = 12; // 增加到12片叶子

    for (let i = 0; i < leafCount; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'floating-botanical-leaf';

      const size = 50 + Math.random() * 60; // 50-110px
      const leftPos = Math.random() * 100;
      const topPos = Math.random() * 100;
      const duration = 5 + Math.random() * 5; // 5-10秒
      const delay = Math.random() * 4;
      const opacity = 0.15 + Math.random() * 0.2; // 0.15-0.35
      const color = i % 3 === 0 ? '%235a705a' : (i % 3 === 1 ? '%23c49b48' : '%238a9d8a');

      leaf.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        left: ${leftPos}%;
        top: ${topPos}%;
        pointer-events: none;
        z-index: 1;
        opacity: ${opacity};
        animation: float-leaf ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 Q70 30 75 50 Q70 70 50 90 Q40 70 35 50 Q40 30 50 10' fill='none' stroke='${color}' stroke-width='2' opacity='0.7'/%3E%3Cpath d='M50 20 L50 80' stroke='${color}' stroke-width='1.2' opacity='0.6'/%3E%3Cpath d='M50 40 Q65 45 70 55' fill='none' stroke='${color}' stroke-width='1' opacity='0.5'/%3E%3Cpath d='M50 40 Q35 45 30 55' fill='none' stroke='${color}' stroke-width='1' opacity='0.5'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      `;

      container.appendChild(leaf);
    }

    console.log('✓ 植物标本装饰已加载:', leafCount, '片叶子');
  };

  // 页面加载时创建
  window.addEventListener('load', () => {
    setTimeout(createFloatingLeaves, 300);
  });

  // DOM内容加载完成时也尝试创建
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(createFloatingLeaves, 300);
    });
  } else {
    setTimeout(createFloatingLeaves, 300);
  }

  // 路由切换时重新创建
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      setTimeout(createFloatingLeaves, 500);
    }
  }, 1000);
}

// ========== 顶部滚动进度条 ==========
if (typeof window !== 'undefined') {
  const initScrollProgressBar = () => {
    // 避免重复创建
    let bar = document.getElementById('scroll-progress-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'scroll-progress-bar';
      document.body.appendChild(bar);
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (bar) bar.style.width = Math.min(100, progress).toFixed(2) + '%';
    };

    window.removeEventListener('scroll', updateProgress);
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  };

  // 页面加载后初始化
  window.addEventListener('load', () => setTimeout(initScrollProgressBar, 200));
  if (document.readyState !== 'loading') {
    setTimeout(initScrollProgressBar, 200);
  }

  // SPA 路由切换后重新绑定（重置进度）
  let _lastPath2 = location.pathname;
  setInterval(() => {
    if (location.pathname !== _lastPath2) {
      _lastPath2 = location.pathname;
      setTimeout(() => {
        const bar = document.getElementById('scroll-progress-bar');
        if (bar) bar.style.width = '0%';
        initScrollProgressBar();
      }, 400);
    }
  }, 800);
}
