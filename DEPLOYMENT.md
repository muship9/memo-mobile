# Vercel デプロイメント設定ガイド

## セットアップ手順

### 1. Vercelプロジェクト作成
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. "Add New Project"をクリック
3. GitHubリポジトリ `memo-mobile` を選択
4. Framework Preset: "Vite" を選択
5. Build Command: `bun run build` (自動設定済み)
6. Output Directory: `dist` (自動設定済み)

### 2. 環境変数設定
Vercelダッシュボードの Project Settings > Environment Variables で以下を設定:

**本番環境 (Production):**
```
GITHUB_TOKEN=ghp_your_token_here
NODE_ENV=production
```

**プレビュー環境 (Preview):**
```
GITHUB_TOKEN=ghp_your_token_here
NODE_ENV=development
```

### 3. 自動デプロイの仕組み
Vercelがリポジトリと連携することで自動デプロイが実行されます:

- GitHub Actionsは不要 - VercelのGitHub統合を利用
- 必要な環境変数はVercel側のみで管理
- シンプルで安全な構成

### 4. 自動デプロイメント動作

**mainブランチ:**
- pushすると本番環境に自動デプロイ
- カスタムドメインが設定されていればそちらにも反映

**PRブランチ:**
- PR作成時にプレビュー環境を自動作成
- 各PRに固有のURLが割り当てられる
- コミットごとに自動更新

### 5. 手動デプロイ (オプション)
```bash
# Vercel CLIをインストール
bun add -g vercel

# 初回のみ: プロジェクトリンク
vercel link

# プレビューデプロイ
vercel

# 本番デプロイ
vercel --prod
```

## 設定ファイル

### vercel.json
プロジェクトルートの `vercel.json` でビルド設定とデプロイ条件を管理。

### GitHub Actions
`.github/workflows/ci.yml` で基本的なCI（lint, typecheck, build）を実行。デプロイはVercelが自動で行います。

## トラブルシューティング

**ビルドエラー:**
- `bun run build` がローカルで成功することを確認
- TypeScriptエラーがないことを確認

**環境変数エラー:**
- Vercelダッシュボードで環境変数が正しく設定されているか確認
- GitHub Actions のシークレットが設定されているか確認

**デプロイが実行されない:**
- GitHub Actions の実行ログを確認
- VercelのDeploymentログを確認