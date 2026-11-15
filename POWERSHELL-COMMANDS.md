# PowerShell 站点地图管理命令

## 验证站点地图(生产环境)

检查线上 sitemap 是否还有99吧的引用:

```powershell
.\verify-sitemap.ps1
```

## 验证站点地图(本地构建)

在部署前检查本地构建的 sitemap:

```powershell
.\verify-sitemap.ps1 -Local
```

## 检查最后修改日期

查看页面最后更新时间:

```powershell
.\check-lastmod.ps1
```

## 替代方案: 单行命令查看最近更新

```powershell
(Invoke-WebRequest -Uri "https://clash-jichang.com/sitemap.xml" -UseBasicParsing).Content | Select-String -Pattern "<lastmod>(.*?)</lastmod>" -AllMatches | ForEach-Object { $_.Matches } | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Descending | Select-Object -First 10
```

## 为什么需要这些脚本?

- Windows PowerShell 默认没有 `grep` 命令
- `Invoke-WebRequest` 替代 `curl`
- `Select-String` 替代 `grep`
- 使用正则表达式提取数据

## 构建后的验证流程

1. 构建网站: `npm run build` 或 `yarn build`
2. 验证本地 sitemap: `.\verify-sitemap.ps1 -Local`
3. 验证通过后部署
4. 验证线上环境: `.\verify-sitemap.ps1`
