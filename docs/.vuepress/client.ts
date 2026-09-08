import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {},
  rootComponents: [],

  // 植物标本馆动态效果
  onMounted() {
    if (typeof window === 'undefined') return

    // 页面滚动视差效果
    let ticking = false

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY
          const navbar = document.querySelector('.vp-navbar')
          const heroDecorations = document.querySelectorAll('.vp-hero-info-wrapper::before, .vp-hero-info-wrapper::after')

          // 导航栏装饰视差
          if (navbar) {
            const navBefore = navbar.querySelector('::before') as HTMLElement
            const navAfter = navbar.querySelector('::after') as HTMLElement

            if (navBefore) navBefore.style.transform = `translateY(${scrolled * 0.3}px)`
            if (navAfter) navAfter.style.transform = `translateY(${scrolled * 0.2}px)`
          }

          ticking = false
        })

        ticking = true
      }
    })

    // 动态生成漂浮的植物标本点缀
    const createFloatingLeaves = () => {
      const main = document.querySelector('main')
      if (!main) return

      const leafCount = 5

      for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div')
        leaf.className = 'floating-botanical-decoration'
        leaf.style.cssText = `
          position: fixed;
          width: ${30 + Math.random() * 40}px;
          height: ${30 + Math.random() * 40}px;
          top: ${Math.random() * 100}%;
          left: ${Math.random() * 100}%;
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 Q70 30 75 50 Q70 70 50 90 Q40 70 35 50 Q40 30 50 10' fill='none' stroke='%23${i % 2 === 0 ? '5a705a' : 'c49b48'}' stroke-width='1.5'/%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          animation: float-leaf ${6 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 3}s;
        `

        document.body.appendChild(leaf)
      }
    }

    // 等待DOM加载完成后创建装饰
    setTimeout(createFloatingLeaves, 500)
  }
})
