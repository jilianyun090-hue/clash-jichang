# 检查 sitemap 中的最后修改日期
$url = "https://clash-jichang.com/sitemap.xml"
$content = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content

# 提取 lastmod 条目
$pattern = '<lastmod>(.*?)</lastmod>'
$matches = [regex]::Matches($content, $pattern)

Write-Host "发现 $($matches.Count) 个 lastmod 条目" -ForegroundColor Cyan
Write-Host ""

# 按日期分组并计数
$dates = @{}
foreach ($match in $matches) {
    $date = $match.Groups[1].Value.Substring(0, 10)  # 获取 YYYY-MM-DD
    if ($dates.ContainsKey($date)) {
        $dates[$date]++
    } else {
        $dates[$date] = 1
    }
}

# 排序并显示
$dates.GetEnumerator() | Sort-Object Name -Descending | ForEach-Object {
    Write-Host "$($_.Name): $($_.Value) 个页面"
}

Write-Host ""
Write-Host "最近更新: $($dates.GetEnumerator() | Sort-Object Name -Descending | Select-Object -First 1 -ExpandProperty Name)" -ForegroundColor Green
