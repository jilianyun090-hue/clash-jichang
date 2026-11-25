#!/usr/bin/env node
/**
 * 定时运行 Bing 流量监控
 * 添加到 package.json 的 scripts 中
 */

import { CronJob } from 'cron';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 每天晚上 8 点运行一次
const job = new CronJob('0 20 * * *', () => {
  console.log(`\n⏰ 定时任务触发 - ${new Date().toLocaleString('zh-CN')}`);

  const script = path.join(__dirname, 'bing-traffic-monitor.mjs');
  const child = spawn('node', [script], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  child.on('error', (error) => {
    console.error('❌ 执行出错:', error);
  });
});

console.log('🚀 Bing 流量监控定时任务已启动');
console.log('⏱️  每天 20:00 (晚8点) 运行一次');
job.start();
