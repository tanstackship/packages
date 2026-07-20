# Python Packages

> Python 包集合，与 TanStack Ship 生态相关

## 📦 包列表

| 包名 | PyPI | 描述 | 状态 |
|------|------|------|------|
| `utm-parse` | ✅ | UTM 解析库 | 🔄 开发中 |
| `short-link-parse` | 📋 | 短链接解析 | 📋 计划 |
| `stripe-webhook` | 📋 | Stripe Webhook 处理 | 📋 计划 |

## 🚀 发布到 PyPI

### 方式 1: 直接发布

```bash
cd python/utm-parse
pip install build twine

# 构建
python -m build

# 发布
twine upload dist/*
```

### 方式 2: GitHub Actions

使用 `.github/workflows/python-publish.yml`

## 🔗 外链价值

| 平台 | DR | 外链位置 |
|------|-----|----------|
| pypi.org | 92 | 包页面 |
| pyranks.com | 45 | 排名 |
| libraries.io | 58 | 依赖追踪 |

## 📁 包结构

```
python/
├── utm-parse/
│   ├── pyproject.toml
│   ├── src/
│   │   └── utm_parse/
│   │       ├── __init__.py
│   │       └── parser.py
│   └── README.md
└── short-link-parse/
    └── ...
```

## 🔧 开发

```bash
# 本地安装开发
cd python/utm-parse
pip install -e .

# 测试
pytest
```
