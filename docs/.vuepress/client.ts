import { defineClientConfig } from "vuepress/client";

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {},
  rootComponents: [],

  // 植物标本馆动态装饰效果
  mounted() {
    // 创建漂浮的植物叶片装饰
    const createFloatingLeaves = () => {
      const container = document.querySelector('body');
      if (!container) return;

      // 清理已存在的叶片
      const existingLeaves = document.querySelectorAll('.floating-botanical-leaf');
      existingLeaves.forEach(leaf => leaf.remove());

      const leafCount = 8; // 增加叶片数量

      for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'floating-botanical-leaf';
        leaf.style.cssText = `
          position: fixed;
          width: ${40 + Math.random() * 40}px;
          height: ${40 + Math.random() * 40}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 1;
          opacity: ${0.08 + Math.random() * 0.12};
          animation: float-leaf ${6 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 3}s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 Q70 30 75 50 Q70 70 50 90 Q40 70 35 50 Q40 30 50 10' fill='none' stroke='${i % 2 === 0 ? '%235a705a' : '%23c49b48'}' stroke-width='1.5' opacity='0.6'/%3E%3Cpath d='M50 20 L50 80' stroke='${i % 2 === 0 ? '%235a705a' : '%23c49b48'}' stroke-width='0.8' opacity='0.5'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
        `;

        container.appendChild(leaf);
      }
    };

    // 页面加载时创建
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        setTimeout(createFloatingLeaves, 500);
      });

      // 路由切换时重新创建
      const observer = new MutationObserver(() => {
        createFloatingLeaves();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // 导航栏装饰视差效果
    if (typeof window !== 'undefined') {
      let ticking = false;

      const handleScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const navbarDecorations = document.querySelectorAll('.vp-navbar::before, .vp-navbar::after');

            navbarDecorations.forEach((decoration, index) => {
              if (decoration instanceof HTMLElement) {
                const speed = index === 0 ? 0.3 : 0.5;
                decoration.style.transform = `translateY(${scrollY * speed}px)`;
              }
            });

            ticking = false;
          });

          ticking = true;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  }
});
