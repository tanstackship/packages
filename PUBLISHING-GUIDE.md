# TanStack Ship - 完整发布指南

> 20+ 平台发布指南

---

## 📦 已发布的包

| 平台 | 状态 |
|------|------|
| ✅ npm (@huifer/*) | 14个包已发布 |
| ✅ crates.io | 2个crate已发布 |

---

## 🚀 待发布的包

### 1. Python (PyPI)

**包**: `tanstack-utm-parse`

**准备**:
```bash
cd python/utm-parse
```

**发布命令**:
```bash
# 安装构建工具
pip install build twine

# 构建
python -m build

# 发布到 PyPI
twine upload dist/*
```

**需要**: [pypi.org](https://pypi.org) 账号 + API Token

---

### 2. Go (pkg.go.dev)

**包**: `github.com/tanstackship/packages/go/utm-parse`

**发布**: 自动同步到 pkg.go.dev（通过 GitHub releases）

**发布命令**:
```bash
cd go/utm-parse

# 创建 tag
git tag v0.1.0
git push origin v0.1.0
```

**用户安装**:
```bash
go get github.com/tanstackship/packages/go/utm-parse
```

---

### 3. Java (Maven Central)

**包**: `com.tanstackship:utm-parse`

**发布**: 需要 Sonatype 账号

**发布命令**:
```bash
cd java/utm-parse

# 配置 Sonatype (~/.m2/settings.xml)
mvn clean deploy -DskipTests
```

**需要**: [Sonatype](https://issues.sonatype.org) 账号 + GPG 密钥

---

### 4. .NET (NuGet)

**包**: `TanStackShip.UtmParse`

**发布命令**:
```bash
cd .net/TanStackShip.UtmParse

# 打包
dotnet pack -c Release

# 发布
dotnet nuget push bin/Release/*.nupkg --api-key YOUR_NUGET_API_KEY
```

**需要**: [nuget.org](https://nuget.org) API Key

---

### 5. Ruby (RubyGems)

**包**: `tanstack_utm_parse`

**发布命令**:
```bash
cd ruby/utm_parse

# 构建 gem
gem build utm_parse.gemspec

# 发布
gem push tanstack_utm_parse-0.1.0.gem
```

**需要**: [rubygems.org](https://rubygems.org) 账号

---

### 6. PHP (Packagist)

**包**: `tanstackship/utm-parse`

**发布**: 
1. 在 [packagist.org](https://packagist.org) 提交包
2. 或使用 GitHub Actions 自动同步

**需要**: Packagist 账号

---

### 7. Dart/Flutter (pub.dev)

**包**: `utm_parse`

**发布命令**:
```bash
cd dart-pub/utm_parse

# 登录
dart pub login

# 发布
dart pub publish
```

**需要**: [pub.dev](https://pub.dev) 账号 + 2FA

---

### 8. Swift (SPM)

**包**: 通过 GitHub 自动发布

**用户使用**:
```swift
// 在 Package.swift 中添加
.package(url: "https://github.com/tanstackship/packages", from: "1.0.0")
```

**需要**: GitHub 账号（已就绪）

---

### 9. CocoaPods

**包**: `UtmParse`

**发布命令**:
```bash
cd cocoapods/UtmParse

# 验证
pod lib lint

# 发布
pod trunk push
```

**需要**: CocoaPods Trunk 账号

---

### 10. Docker Hub

**包**: `tanstackship/utm-worker`

**构建和发布**:
```bash
cd docker/utm-worker

# 构建
docker build -t tanstackship/utm-worker:latest .

# 登录
docker login

# 发布
docker push tanstackship/utm-worker:latest
```

**需要**: [Docker Hub](https://hub.docker.com) 账号

---

### 11. Homebrew Tap

**包**: `utm-cli`

**发布**:
1. Fork [homebrew-core](https://github.com/Homebrew/homebrew-core)
2. 添加 formula 或使用 tap

**使用**:
```bash
brew tap tanstackship/tap
brew install utm-cli
```

---

## 📋 各平台 Token/API Key 获取方式

| 平台 | Token 类型 | 获取链接 |
|------|------------|----------|
| PyPI | API Token | pypi.org/manage/account/ |
| RubyGems | API Key | rubygems.org/settings/api-key |
| NuGet | API Key | nuget.org/#profile |
| Docker Hub | Password/Token | hub.docker.com/settings/security |
| CocoaPods | Trunk Session | `pod trunk register` |
| Maven Central | GPG + Sonatype | issues.sonatype.org |

---

## 🎯 发布优先级

1. **PyPI** - 最重要，SEO 价值高
2. **pub.dev** - Flutter 开发者
3. **RubyGems** - Ruby 开发者
4. **NuGet** - .NET 开发者
5. **Maven Central** - Java 开发者
6. **Docker Hub** - DevOps
7. **CocoaPods** - iOS 开发者
8. **Packagist** - PHP 开发者

---

## ✅ 发布检查清单

发布前确认：

- [ ] README 包含 https://tanstackship.com 链接
- [ ] package.json/repository 指向正确仓库
- [ ] 版本号正确
- [ ] License 正确 (MIT)
- [ ] Author/Email 正确 (about@tanstackship.com)
