# Devin Fitness - カロリー・栄養管理アプリケーション

MyFitnessPalのような毎日の摂取カロリーと栄養価を管理するWebアプリケーション

## 📋 プロジェクト概要

Devin Fitnessは、ユーザーが日々の食事を記録し、カロリーや栄養素を追跡して健康的な生活をサポートするWebアプリケーションです。直感的なUIと包括的な機能により、効果的な栄養管理を実現します。

## 🎯 主要機能

### 1. 食事記録・カロリー追跡
- **食品データベース検索**: 数十万件の食品データから簡単検索
- **バーコードスキャン**: スマートフォンカメラでの商品登録
- **カスタム食品登録**: オリジナル食品・レシピの作成
- **食事時間別記録**: 朝食・昼食・夕食・間食の分類管理
- **分量調整**: グラム、カップ、個数など柔軟な単位設定
- **クイック追加**: よく食べる食品のお気に入り登録

### 2. 栄養素分析・マクロ追跡
- **カロリー自動計算**: 摂取・消費カロリーのリアルタイム計算
- **三大栄養素追跡**: タンパク質・炭水化物・脂質の詳細分析
- **微量栄養素表示**: ビタミン・ミネラル・食物繊維等
- **栄養バランス可視化**: 円グラフ・棒グラフでの直感的表示
- **目標値設定**: 個人に合わせたカスタム栄養目標

### 3. 目標設定・進捗管理
- **個人プロフィール**: 年齢・性別・身長・体重・活動レベル設定
- **目標体重設定**: 減量・増量・維持の目標管理
- **期間設定**: 短期・長期目標の柔軟な設定
- **進捗追跡**: 日次・週次・月次の詳細レポート
- **体重変化グラフ**: 視覚的な進捗確認

### 4. 運動・活動追跡
- **運動データベース**: 300種類以上のエクササイズデータ
- **消費カロリー計算**: 運動強度・時間に基づく自動計算
- **フィットネストラッカー連携**: Apple Health、Google Fit対応
- **歩数カウント**: 日常活動の自動記録
- **カスタム運動**: オリジナルワークアウトの登録

### 5. データ可視化・レポート
- **ダッシュボード**: 一目で分かる日次サマリー
- **栄養摂取傾向**: 週次・月次の栄養バランス分析
- **体重変化チャート**: 長期間の体重推移表示
- **カロリー収支**: 摂取・消費の詳細バランス
- **食事パターン分析**: 食習慣の傾向把握

### 6. ユーザー管理・認証
- **セキュアログイン**: JWT認証による安全なアクセス
- **プロフィール管理**: 個人情報の安全な保存・更新
- **データ同期**: クラウドベースのデータ保存
- **プライバシー設定**: データ共有レベルの細かな制御
- **エクスポート機能**: データのCSV出力

### 7. 通知・リマインダー
- **食事記録リマインダー**: カスタマイズ可能な通知時間
- **水分摂取通知**: 適切な水分補給のサポート
- **目標達成通知**: マイルストーン到達時の祝福メッセージ
- **週次レポート**: 進捗サマリーの定期配信

## 🛠️ 技術スタック

### フロントエンド (React中心)
```
Core Framework:
- React 18+ (Hooks, Context API)
- TypeScript (型安全性)
- Vite (高速ビルドツール)

UI/UXライブラリ:
- Material-UI (MUI) / Chakra UI (コンポーネントライブラリ)
- Styled-components / Emotion (CSS-in-JS)
- Framer Motion (アニメーション)
- React Hook Form (フォーム管理)
- Yup / Zod (バリデーション)

状態管理:
- Redux Toolkit / Zustand (グローバル状態)
- React Query / SWR (サーバー状態)
- React Context (ローカル状態)

ルーティング・ナビゲーション:
- React Router v6 (SPA routing)
- React Helmet (SEO対応)

データ可視化:
- Chart.js / Recharts (グラフ・チャート)
- D3.js (カスタムビジュアライゼーション)

PWA・モバイル対応:
- Workbox (Service Worker)
- React PWA (プログレッシブWebアプリ)
- React Responsive (レスポンシブデザイン)

開発・テストツール:
- ESLint + Prettier (コード品質)
- Jest + React Testing Library (テスト)
- Storybook (コンポーネント開発)
- React DevTools (デバッグ)
```

### バックエンド
```
API Framework:
- Node.js + Express.js / Fastify
- TypeScript (型安全性)

認証・セキュリティ:
- JWT (JSON Web Tokens)
- bcrypt (パスワードハッシュ化)
- Helmet.js (セキュリティヘッダー)
- CORS (クロスオリジン対応)

データベース:
- PostgreSQL (メインDB)
- Redis (キャッシュ・セッション)
- Prisma / TypeORM (ORM)

ファイル・画像処理:
- Multer (ファイルアップロード)
- Sharp (画像処理)
- AWS S3 / Cloudinary (画像ストレージ)
```

### 外部API・連携
```
食品データ:
- USDA Food Data Central API
- Open Food Facts API
- カスタム食品データベース

バーコード:
- UPC Database API
- Barcode Lookup API

フィットネス連携:
- Apple HealthKit
- Google Fit API
- Fitbit API

決済 (プレミアム機能):
- Stripe API
- PayPal API
```

### インフラ・デプロイ
```
ホスティング:
- Vercel / Netlify (フロントエンド)
- Railway / Heroku (バックエンド)
- AWS / Google Cloud (スケーラブル構成)

CI/CD:
- GitHub Actions
- Vercel Auto Deploy

監視・分析:
- Google Analytics
- Sentry (エラー監視)
- LogRocket (ユーザー行動分析)
```

## 📱 対応プラットフォーム

- **デスクトップ**: Chrome, Firefox, Safari, Edge
- **モバイル**: iOS Safari, Android Chrome
- **PWA**: オフライン対応、ホーム画面追加可能
- **タブレット**: iPad, Android タブレット最適化

## 🚀 開発ロードマップ

### Phase 1: MVP (最小実行可能製品)
- [ ] ユーザー認証システム
- [ ] 基本的な食事記録機能
- [ ] カロリー計算・表示
- [ ] シンプルなダッシュボード

### Phase 2: コア機能
- [ ] 栄養素詳細追跡
- [ ] 目標設定・進捗管理
- [ ] データ可視化（基本グラフ）
- [ ] 食品データベース拡充

### Phase 3: 拡張機能
- [ ] 運動追跡機能
- [ ] バーコードスキャン
- [ ] 外部API連携
- [ ] 高度なレポート機能

### Phase 4: プレミアム機能
- [ ] 詳細栄養分析
- [ ] カスタムレシピ機能
- [ ] データエクスポート
- [ ] プレミアムサポート

## 🏗️ プロジェクト構成

```
devin-fitness/
├── frontend/                 # React フロントエンド
│   ├── public/              # 静的ファイル
│   ├── src/
│   │   ├── components/      # 再利用可能コンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   ├── store/          # 状態管理
│   │   ├── services/       # API通信
│   │   ├── utils/          # ユーティリティ関数
│   │   └── types/          # TypeScript型定義
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js バックエンド
│   ├── src/
│   │   ├── controllers/    # APIコントローラー
│   │   ├── models/         # データモデル
│   │   ├── routes/         # ルート定義
│   │   ├── middleware/     # ミドルウェア
│   │   ├── services/       # ビジネスロジック
│   │   └── utils/          # ユーティリティ
│   ├── package.json
│   └── tsconfig.json
├── shared/                  # 共通型定義・ユーティリティ
├── docs/                   # ドキュメント
├── docker-compose.yml      # 開発環境
└── README.md
```

## 🔧 開発環境セットアップ

### 前提条件
- Node.js 18+
- npm / yarn / pnpm
- PostgreSQL 14+
- Redis (オプション)

### インストール手順

1. **リポジトリクローン**
```bash
git clone https://github.com/haginot/devin-fitness.git
cd devin-fitness
```

2. **依存関係インストール**
```bash
# フロントエンド
cd frontend
npm install

# バックエンド
cd ../backend
npm install
```

3. **環境変数設定**
```bash
# backend/.env
DATABASE_URL="postgresql://username:password@localhost:5432/devin_fitness"
JWT_SECRET="your-secret-key"
USDA_API_KEY="your-usda-api-key"
```

4. **データベースセットアップ**
```bash
cd backend
npm run db:migrate
npm run db:seed
```

5. **開発サーバー起動**
```bash
# バックエンド (ポート3001)
cd backend
npm run dev

# フロントエンド (ポート3000)
cd frontend
npm run dev
```

## 📊 データベース設計

### 主要テーブル
- `users` - ユーザー情報
- `foods` - 食品マスターデータ
- `food_entries` - 食事記録
- `exercises` - 運動マスターデータ
- `exercise_entries` - 運動記録
- `user_goals` - ユーザー目標設定
- `weight_entries` - 体重記録

## 🧪 テスト戦略

### フロントエンド
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress / Playwright
- **Component Tests**: Storybook + Chromatic
- **Performance Tests**: Lighthouse CI

### バックエンド
- **Unit Tests**: Jest + Supertest
- **Integration Tests**: API endpoint testing
- **Database Tests**: Test database with fixtures
- **Load Tests**: Artillery.js

## 🔒 セキュリティ対策

- JWT認証によるセキュアなAPI アクセス
- パスワードのbcryptハッシュ化
- SQL インジェクション対策 (Prisma ORM)
- XSS対策 (DOMPurify)
- CSRF対策 (SameSite cookies)
- レート制限 (express-rate-limit)
- HTTPS強制 (本番環境)

## 📈 パフォーマンス最適化

- **フロントエンド**:
  - Code splitting (React.lazy)
  - Image optimization (WebP, lazy loading)
  - Bundle analysis (webpack-bundle-analyzer)
  - Service Worker caching

- **バックエンド**:
  - Database indexing
  - Redis caching
  - API response compression
  - CDN integration

## 🤝 コントリビューション

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 👥 開発チーム

- **Project Lead**: Takahiro Hagino (@haginot)
- **Frontend**: React/TypeScript specialists
- **Backend**: Node.js/PostgreSQL experts
- **UI/UX**: Design system architects

## 📞 サポート・お問い合わせ

- **Issues**: [GitHub Issues](https://github.com/haginot/devin-fitness/issues)
- **Discussions**: [GitHub Discussions](https://github.com/haginot/devin-fitness/discussions)
- **Email**: hagino@metapod.jp

---

**Built with ❤️ using React, TypeScript, and modern web technologies**
