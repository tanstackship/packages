# TanStack Ship Supabase Template

> Complete Supabase setup for SaaS apps with UTM tracking, analytics, and more.

[![Supabase](https://img.shields.io/badge/Supabase-tanstackship.com-blue)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/supabase](https://tanstackship.com/docs)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Features

- 📊 Analytics tables
- 🎯 UTM tracking
- 👥 User attribution
- 📈 Funnels
- 🛒 E-commerce schema

## Quick Start

```bash
# Apply migrations
supabase db push

# Use in your app
const { data } = await supabase.rpc('track_page_view', {
  p_user_id: userId,
  p_url: '/dashboard',
  p_utm_source: 'google',
})
```

## Structure

```
supabase-template/
├── migrations/
│   └── 001_analytics.sql
└── functions/
```

## License

MIT © [Huifer](https://tanstackship.com/about)
