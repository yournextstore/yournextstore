<p align="center">
  <a href="https://yournextstore.com">
    <img src="public/logo.svg" height="128">
  </a>
</p>

<h1 align="center">Your Next Store</h1>

<p align="center">
  <strong>Open-source AI-native Next.js e-commerce template.</strong>
</p>
<p align="center">
Powered by Stripe. Built for AI coding tools.
</p>

<div align="center">
  <a href="https://demo.yournextstore.com">
    <img src="public/screenshot.png" alt="Your Next Store Demo" width="800" />
  </a>
  <p><strong>Live Demo:</strong> <a href="https://demo.yournextstore.com">demo.yournextstore.com</a></p>
</div>

<div align="center">
  <a href="https://github.com/yournextstore/yournextstore/stargazers"><img src="https://img.shields.io/github/stars/yournextstore/yournextstore?style=for-the-badge&logo=github&labelColor=181717&color=181717" alt="GitHub Stars" /></a>
  <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,YNS_API_KEY&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png"><img src="https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel&labelColor=000" alt="Deploy with Vercel" /></a>
  <a href="https://yournextstore.com/discord"><img src="https://img.shields.io/discord/1206629600483082341?style=for-the-badge&logo=discord&logoColor=white&labelColor=5865F2&color=5865F2" alt="Discord" /></a>
  <a href="https://www.producthunt.com/posts/your-next-store"><img src="https://img.shields.io/badge/Product%20Hunt-720-DA552F?style=for-the-badge&logo=producthunt&logoColor=white&labelColor=DA552F" alt="Product Hunt" /></a>
</div>

<br/>

| | |
|:---|:---|
| **AI-Friendly Codebase** | Ships with [AGENTS.md](AGENTS.md) — idiomatic patterns, Commerce Kit SDK with typed methods. Claude Code, Cursor, and Codex work out of the box |
| **Stripe-Native** | Direct Stripe API integration — checkout, billing, subscriptions |
| **Next.js 16** | App Router, React Server Components, React Compiler |
| **Open Source** | Self-host anywhere, deploy to Vercel in one click |

## Quick Start

```bash
git clone https://github.com/yournextstore/yournextstore.git
cd yournextstore && bun install
cp .env.example .env.local   # Add your YNS_API_KEY from https://yns.store/manage/settings/api
bun dev
```

Open [localhost:3000](http://localhost:3000) — your store is running.

## Why AI Tools Work Better Here

| | |
|---|---|
| **Familiar patterns** | Idiomatic Next.js App Router (Server Components, Server Actions, `"use cache"`) — matches what LLMs have seen thousands of times |
| **Commerce Kit SDK** | Methods like `productBrowse()` and `cartUpsert()` have defined input/output shapes. LLMs write correct code when they know the contracts |
| **Well-defined domain** | Products, variants, carts, checkout — the data models already exist with clear types. No need for the LLM to invent them |
| **AGENTS.md** | Full project context, SDK examples, Biome rules, and validation checklist — AI agents understand the codebase before writing a single line |

## Tech Stack

- **Next.js 16** — App Router, React Server Components, React Compiler
- **Bun** — Fast JavaScript runtime and package manager
- **Commerce Kit SDK** — Headless commerce API integration
- **Tailwind CSS v4** — Utility-first styling
- **Shadcn UI** — 50+ accessible components built on Radix UI
- **TypeScript** — Strict type-safe development
- **Biome** — Lightning-fast linter and formatter

## Prerequisites

- [Node.js 24+](https://nodejs.org/)
- [Bun 1.0+](https://bun.sh/)
- YNS API key from [https://yns.store/manage/settings/api](https://yns.store/manage/settings/api)

### Environment Variables

Copy `.env.example` to `.env.local` and set:

- `YNS_API_KEY` — Your API token from the admin panel

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for coding conventions and PR checklist.

## Next Steps

Refer to the [API documentation](https://yns.store/manage/settings/api) for details on fetching products, managing carts, and building on top of YNS.

## Star History

<a href="https://star-history.com/#yournextstore/yournextstore&Date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=yournextstore/yournextstore&type=Date&theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=yournextstore/yournextstore&type=Date" />
    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=yournextstore/yournextstore&type=Date" width="600" />
  </picture>
</a>
