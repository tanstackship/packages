# Homebrew Tap

> TanStack Ship 的 Homebrew 包

## 📦 包列表

| Formula | 描述 | 状态 |
|---------|------|------|
| `utm-cli` | UTM 参数解析 CLI | 🔄 开发中 |

## 🔗 外链价值

| 平台 | DR | 外链位置 |
|------|-----|----------|
| github.com | 96 | Tap 仓库 |
| brew.sh | 92 | 文档页面 |

## 📁 结构

```
homebrew-tap/
├── README.md
├── Formula/
│   └── utm-cli.rb
└── utm-cli/
    └── main.go
```

## 🚀 安装

```bash
# 添加 tap
brew tap tanstackship/tap

# 安装
brew install utm-cli

# 使用
utm parse "https://example.com?utm_source=google"
```

## 🔧 开发 Formula

```ruby
class UtmCli < Formula
  desc "UTM parameter parsing CLI"
  homepage "https://tanstackship.com"
  url "https://github.com/tanstackship/homebrew-tap/releases/download/v0.1.0/utm-cli"
  sha256 "..."

  def install
    bin.install "utm-cli"
  end
end
```
