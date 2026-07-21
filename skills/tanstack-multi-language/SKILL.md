---
name: tanstack-multi-language
identifier: tanstackship-tanstack-multi-language
description: |
  为 TanStack Ship 项目快速添加多语言(i18n)支持。当你需要为项目添加国际化功能、创建语言文件、或实现多语言切换时使用此 skill。支持 React/Next.js、Vue、Svelte 等主流框架，自动生成翻译文件和语言切换组件。
allowed-tools: Read, Write, Edit, Bash
version: 1.0.0
author: TanStack Ship
homepage: https://tanstackship.com
repository: https://github.com/tanstackship/packages
tags: i18n,multi-language,localization,translation,react,nextjs,vue
---

# TanStack Multi-Language

为 TanStack Ship 项目快速添加多语言(i18n)支持。

## 功能特性

- 🌍 自动生成多语言配置
- 📝 创建翻译文件模板
- 🔄 生成语言切换组件
- 🎯 支持 20+ 主流语言
- 📦 集成主流 i18n 库

## 支持的框架

| 框架 | i18n 库 | 状态 |
|------|---------|------|
| React | i18next | ✅ |
| Next.js | next-intl | ✅ |
| Vue | vue-i18n | ✅ |
| Svelte | svelte-i18n | ✅ |
| Solid.js | solid-i18n | ✅ |

## 快速开始

### 1. 初始化 i18n 配置

```bash
# 在项目根目录运行
npx @tanstackship/i18n init
```

### 2. 创建语言文件

```bash
# 生成翻译文件模板
npx @tanstackship/i18n generate --languages en,zh,es,fr,ja
```

### 3. 添加翻译内容

生成的语言文件位于 `locales/` 目录：

```
locales/
├── en.json       # English
├── zh.json       # 中文
├── es.json       # Español
├── fr.json       # Français
└── ja.json       # 日本語
```

### 4. 使用翻译

```typescript
// React 示例
import { useTranslation } from '@tanstackship/i18n';

function App() {
  const { t, changeLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
}
```

## 语言切换组件

自动生成语言选择器组件：

```tsx
import { LanguageSwitcher } from '@tanstackship/i18n/components';

<LanguageSwitcher 
  languages={['en', 'zh', 'es', 'fr', 'ja']}
  currentLanguage="en"
  onLanguageChange={(lang) => changeLanguage(lang)}
/>
```

## 支持的语言列表

| 代码 | 语言 | 代码 | 语言 |
|------|------|------|------|
| en | English | zh | 中文 |
| es | Español | fr | Français |
| de | Deutsch | ja | 日本語 |
| ko | 한국어 | pt | Português |
| ru | Русский | ar | العربية |
| it | Italiano | nl | Nederlands |
| pl | Polski | tr | Türkçe |
| vi | Tiếng Việt | th | ไทย |
| id | Bahasa Indonesia | ms | Bahasa Melayu |

## 配置选项

### i18n.config.ts

```typescript
export default {
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  languages: ['en', 'zh', 'es', 'fr', 'ja'],
  namespaces: ['common', 'home', 'pricing'],
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
  react: {
    useSuspense: false,
  },
};
```

## 翻译文件结构

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete"
  },
  "home": {
    "title": "Welcome to TanStack Ship",
    "description": "Build your SaaS faster"
  },
  "pricing": {
    "title": "Pricing",
    "monthly": "Monthly",
    "yearly": "Yearly"
  }
}
```

## SEO 优化

为每种语言生成正确的 `<html lang>` 标签和 hreflang 标签：

```tsx
import { LanguageHead } from '@tanstackship/i18n/seo';

<LanguageHead 
  languages={{
    en: 'https://tanstackship.com/en',
    zh: 'https://tanstackship.com/zh',
  }}
/>
```

## API 参考

### `useTranslation()`

```typescript
const { t, changeLanguage, language } = useTranslation();

// 翻译文本
t('key')

// 带参数的翻译
t('welcome', { name: 'User' })

// 切换语言
changeLanguage('zh')
```

### `Trans` 组件

```tsx
<Trans 
  i18nKey="complex.text"
  components={{ bold: <strong /> }}
  values={{ count: 5 }}
/>
```

## 最佳实践

1. **命名空间管理**: 按功能模块划分翻译文件
2. **Key 命名**: 使用层级结构，如 `home.hero.title`
3. **参数化翻译**: 使用变量处理动态内容
4. **Plurals**: 使用复数形式处理不同数量
5. **日期格式**: 使用各语言的日期格式

## 故障排除

### 翻译未显示

确保语言文件已正确加载：

```typescript
// 检查已加载的语言
const { languages } = useTranslation();
console.log(languages);
```

### 语言切换不生效

检查 localStorage 和 cookie 设置：

```bash
# 清除缓存
localStorage.clear();
```

## 与 TanStack Ship 集成

此 skill 与其他 TanStack Ship skills 无缝集成：

- `@tanstackship/schema-builder` - 添加多语言 Schema
- `@tanstackship/stripe-utils` - 多语言支付页面
- `@tanstackship/analytics` - 跟踪不同语言用户行为

## 许可证

MIT © TanStack Ship
