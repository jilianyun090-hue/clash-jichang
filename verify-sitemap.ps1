# 验证 sitemap 中是否还有99吧机场的引用
# 在移除99吧机场后运行此脚本检查

param(
    [string]$Url = "https://clash-jichang.com/sitemap.xml",
    [switch]$Local
)

if ($Local) {
    Write-Host "正在读取本地 sitemap..." -ForegroundColor Cyan
    $content = Get-Content "docs/.vuepress/dist/sitemap.xml" -Raw
} else {
    Write-Host "正在从 $Url 获取 sitemap..." -ForegroundColor Cyan
    try {
        $content = (Invoke-WebRequest -Uri $Url -UseBasicParsing).Content
    } catch {
        Write-Host "获取 sitemap 时出错: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# 检查99bar引用
$pattern99bar = '99bar|99ba\.net'
$matches99bar = [regex]::Matches($content, $pattern99bar, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

if ($matches99bar.Count -gt 0) {
    Write-Host "⚠️  警告: 在 sitemap 中发现 $($matches99bar.Count) 处99吧的引用!" -ForegroundColor Yellow
    Write-Host ""

    # 提取包含99bar的URL
    $urlPattern = '<loc>([^<]*99bar[^<]*)</loc>'
    $urlMatches = [regex]::Matches($content, $urlPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    if ($urlMatches.Count -gt 0) {
        Write-Host "包含99bar的URL:" -ForegroundColor Yellow
        foreach ($match in $urlMatches) {
            Write-Host "  - $($match.Groups[1].Value)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "✅ sitemap 中未发现99吧的引用" -ForegroundColor Green
}

Write-Host ""

# 统计总URL数
$urlPattern = '<loc>([^<]+)</loc>'
$allUrls = [regex]::Matches($content, $urlPattern)
Write-Host "sitemap 中的总URL数: $($allUrls.Count)" -ForegroundColor Cyan

# 统计机场评测页面数
$airportUrls = $allUrls | Where-Object { $_.Groups[1].Value -match '/airport/[^/]+$' }
Write-Host "机场评测页面数: $($airportUrls.Count)" -ForegroundColor Cyan

Write-Host ""

# 提取并分组最后修改日期
$lastmodPattern = '<lastmod>(.*?)</lastmod>'
$lastmodMatches = [regex]::Matches($content, $lastmodPattern)

if ($lastmodMatches.Count -gt 0) {
    $dates = @{}
    foreach ($match in $lastmodMatches) {
        $date = $match.Groups[1].Value.Substring(0, 10)
        if ($dates.ContainsKey($date)) {
            $dates[$date]++
        } else {
            $dates[$date] = 1
        }
    }

    Write-Host "最近修改日期:" -ForegroundColor Cyan
    $dates.GetEnumerator() | Sort-Object Name -Descending | Select-Object -First 5 | ForEach-Object {
        Write-Host "  $($_.Name): $($_.Value) 个页面"
    }

    $mostRecent = ($dates.GetEnumerator() | Sort-Object Name -Descending | Select-Object -First 1).Name
    Write-Host ""
    Write-Host "最近更新: $mostRecent" -ForegroundColor Green
}
