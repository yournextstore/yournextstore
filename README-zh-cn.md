# Your Next Store

<div align="center">
<table>
<tr>
<td>
	<a href="https://yournextstore.com/discord"><img src="https://img.shields.io/discord/1206629600483082341?style=for-the-badge&logo=discord&logoColor=white&labelColor=%235865F2&color=%23555" alt="Join Discord" /></a>
</td>
<td>
	<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_CURRENCY&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
</td>
<td>
<a href="https://www.producthunt.com/posts/your-next-store?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-your&#0045;next&#0045;store">
	<picture>
		<source
			media="(prefers-color-scheme: dark)"
			srcSet="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=459751&theme=dark"
		/>
		<img
			src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=459751&theme=light"
			height="36"
			alt="Your&#0032;Next&#0032;Store - E&#0045;Commerce&#0032;with&#0032;Stripe&#0032;as&#0032;the&#0032;backend | Product Hunt"
		/>
	</picture>
</a>
</td>
</tr>
</table>

👉 [demo.yournextstore.com](https://demo.yournextstore.com/) 👈

</div>

## 演示

https://github.com/user-attachments/assets/64197310-29bd-4dd3-a736-1494340e20e8

## 前提条件

### Node.js 20+

我们正式支持当前的 LTS 版本——在撰写本文时是 v20 版本。YNS 应该可以在 v18、v20 和 v22 上运行。如果你在使用这些版本时遇到问题，请报告给我们！

#### 安装 Node.js

请根据此处的说明选择适合你的操作系统进行操作：[nodejs.org/en/download](https://nodejs.org/en/download)

### pnpm 9+

我们正式支持 pnpm v9 版本，同时会尽最大努力保持与 npm 和 yarn 兼容。

#### 安装 pnpm

安装 pnpm 最简单的方法是通过 Node.js Corepack。在 YNS 文件夹中，运行以下命令：

```bash
corepack enable
corepack install
```

或者，根据此处的说明选择适合你的操作系统进行操作：[pnpm.io/installation](https://pnpm.io/installation)

## 创建 Stripe 账户

YNS 与 [Stripe](https://stripe.com) 紧密整合，因此你需要有一个 Stripe 账户才能使用 Your Next Store。根据以下 Stripe 的说明来[创建一个账户](https://dashboard.stripe.com/register)。

需切记的是， Stripe 有两种不同的工作模式：**测试模式 (Test Mode)** 和 **生产模式 (Production Mode)**。对于在本地开发和测试目的，你应该使用**测试模式**。通过这种方式，Stripe 将不会产生实际扣款，你可以使用特殊的测试凭证，例如信用卡号码和 BLIK 号码来完成支付。更多详情，请参阅 [Stripe 测试文档](https://docs.stripe.com/testing)。

一旦您准备好将产品销售给真实客户，就必须在 Stripe 中将**测试模式 (Test Mode)** 切换到**生产模式 (Production Mode)**，并生成新的凭据。

> [!TIP]提示
> 这个步骤将需要通过 Stripe 的额外验证，我们建议你即刻开始该步骤。

## 添加环境变量

要使 YNS 正常运行，你将需要定义几个环境变量。对于本地开发和测试环境，你可以创建一个空白 `.env` 文件，并将 `.env.example` 中的内容复制到其中。

要在生产环境中设置 env 变量，你需要查阅你的托管服务提供商的文档。

### 必需的环境变量

- `ENABLE_EXPERIMENTAL_COREPACK` – 仅适用于 Vercel：设置为 `1` 以启用 Corepack
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` – Stripe 发布密钥 (publishable key)
- `STRIPE_SECRET_KEY` – Stripe 密钥 (secret key)
- `STRIPE_CURRENCY` – 用于确定你的商店的货币。目前只允许使用单一货币，应该使用三个字母的 ISO 代码（例如 `usd`）。
- `NEXT_PUBLIC_URL` – **在 Vercel 上可选** 不带结尾斜杠的商店 URL 网址，例如 `https://demo.yournextstore.com`。首次构建时，你应将其设置为任何有效的 URL，例如 `http://localhost:3000`。

https://github.com/yournextstore/.github/assets/200613/01d27f69-00dc-446e-bc81-5dea2587f346

### 可选的环境变量

- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` – Umami 服务网站分析 ID
- `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` – **预览功能**：未来新闻通讯表单功能的端点 (endpoint)。它应该接受带有 JSON `{ email: string }` 的 POST 请求，并返回 JSON `{ status: number }`。
- `STRIPE_WEBHOOK_SECRET` – **预览功能**：处理 Stripe 事件的 Stripe 网络钩子 (webhook) 密钥。请在底下阅读更多信息。
- `ENABLE_STRIPE_TAX` – **预览功能**: 设置为任意值（例如 `1`）以在 YNS 中启用 Stripe 税务功能。请在底下阅读更多信息。
- `NEXT_PUBLIC_LANGUAGE` - 商店语言。

## 运行商店

完成上述步骤后，运行 `pnpm install` 安装所需的依赖项，然后运行 `pnpm dev` 启动。Your Next Store 将运行在 [localhost:3000](http://localhost:3000) 上。

## 添加产品

Your Next Store 从 Stripe 获取所有产品、价格、描述和类别数据。因此，如果你已经熟悉 Stripe，那你会很快上手！

要在 YNS 中显示，你需要先在 Stripe 管理面板中添加产品。登录后，点击左侧边栏中的**更多**，然后选择**产品目录**。你也可以使用直接链接：

- **测试模式 (Test Mode)**： [dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
- **生产模式 (Production Mode)**: [dashboard.stripe.com/products](https://dashboard.stripe.com/products)

然后，点击**添加产品**，并填入所有必填信息：

- 名称
- 描述
- 价格 – 目前只支持 _一次性 (One-off) 定价_，
- 一张产品图

### 元数据 (Metadata)

此外，Your Next Store 使用元数据来提供更多有关产品的信息。你可以指定以下元数据字段：

| 字段      | 必填 | 描述                                                                     |
| ---------- | :------: | ------------------------------------------------------------------------------- |
| `slug`     |   是    | 用于产品 URL 网址。需要是唯一的，变体除外。      |
| `category` |    否    | 用于产品类别。                                |
| `order`    |    否    | 用于对产品进行排序。较小的数字优先显示。 |
| `variant`  |    否    | 变体产品标识。请在底下阅读更多信息。                              |

现在你应该能在 Your Next Store 中看到所有添加的产品。

## 变体

Your Next Store 支持简单的变体产品。要创建带变体的产品，你必须在 Stripe 中添加多个产品，并使用相同的 `slug` 元数据字段。YNS 使用 `variant` 元数据字段来区分同一产品的不同变体。例如，你有一件有多个尺寸的 T 恤产品，你可以创建三个产品，`slug` 字段均为 `t-shirt`，`variant` 字段分别为 `small`、`medium` 和 `large`。

变体显示在产品页面上。变体可以有不同的价格、描述和图片。值得注意的是，为了获得最佳浏览体验，同一产品的所有变体的`类别`都应该相同。

> [!NOTE]备注
> 我们之后计划在内置的管理面板中添加编辑产品和变体的功能。如果你有任何想法或建议，请告诉我们！

## Stripe 网络钩子 (Webhooks)

Your Next Store 使用 Stripe 网络钩子处理来自 Stripe 的事件。目前，该端点用于自动重新验证购物车页面和创建税务交易（如果启用）。要设置网络钩子，请参考 Stripe 文档。具体步骤取决于你是否在 Stripe 账户中激活了 Stripe 工作台：[docs.stripe.com/webhooks#add-a-webhook-endpoint](https://docs.stripe.com/webhooks#add-a-webhook-endpoint).

网络钩子的端点是 `https://{YOUR_DOMAIN}/api/stripe-webhook`。唯一必需的事件是 `payment_intent.successed`。在 Stripe 中配置网络钩子后，将 `STRIPE_WEBHOOK_SECRET` 变量值设置为 Stripe 创建的密钥 (secret key)。

> [!NOTE]备注
> 我们之后计划为网络钩子中添加支持更多事件，以改善用户体验。

## Stripe 税务

Your Next Store 集成了 Stripe 税务的预览功能。要启用它，请将 `ENABLE_STRIPE_TAX` 环境变量值设置为任何值（例如 `1`）。

为正常运运行此功能，你必须在 Stripe 管理面板中完成税务相关设置：[dashboard.stripe.com/register/tax](https://dashboard.stripe.com/register/tax)。在启用功能并配置后，税费会基于产品价格自动计算并添加到总价格中。

- 产品价格 - 可以含税或不含税
- 产品税码
- 客户地址
- 客户税号

> [!WARNING]警告
> 该功能仍处于早期阶段，可能存在不支持的极端情况。我们正在积极改进它，如果你遇到任何问题或有任何建议，请告诉我们！

## 生产部署

### Vercel

要在 Vercel 上部署，请点击以下按钮，设置你的 GitHub 仓库和环境变量，然后点击**部署 (Deploy)**。确保将 `ENABLE_EXPERIMENTAL_COREPACK` 变量值设置为 `1`。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore&env=ENABLE_EXPERIMENTAL_COREPACK,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_CURRENCY&envDescription=Read%20more%20about%20required%20env%20variables%20in%20YNS&envLink=https%3A%2F%2Fgithub.com%2Fyournextstore%2Fyournextstore%2Ftree%2Fupcoming%3Ftab%3Dreadme-ov-file%23add-environmental-variables&project-name=yournextstore&repository-name=yournextstore&demo-title=Your%20Next%20Store&demo-description=A%20Next.js%20boilerplate%20for%20building%20your%20online%20store%20instantly%3A%20simple%2C%20quick%2C%20powerful.&demo-url=https%3A%2F%2Fdemo.yournextstore.com%2F&demo-image=https%3A%2F%2Fyournextstore.com%2Fdemo.png)

### 自建 VPS

即将发布。

### Docker

要在 Docker 上部署，请参照以下步骤：

1. 复制本仓库到一个空白文件夹中，并按[此处描述](#add-environment-variables)在仓库中创建 .env 文件
2. 在 .env 文件中设置变量 DOCKER=1
3. 运行 `pnpm run docker:build`
4. 然后，运行 `pnpm run docker:run` 启动容器

## 以上

YNS 每天都在优化，我们积极寻求反馈意见以改进我们的工作。如果你有任何疑问，请随时通过 Discord 与我们联系。

## FAQ

### 为什么你们有时候使用 `structuredClone` 将数据从服务器传递到客户端组件？

只有某些特定类型的数据可以从服务器直接传递到客户端。来自 Stripe SDK 的数据通常包含类实例。为了解决这个问题，我们使用 `structuredClone` 来消除它们，只向客户端传递普通对象。