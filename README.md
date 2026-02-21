# memo-mobile

個人用メモを閲覧・編集する PWA アプリケーション

## 概要

memo-mobile は、GitHub リポジトリに保存されたマークダウンファイルを管理できる PWA（Progressive Web App）です。モバイルデバイスでの使用を想定した、シンプルで直感的なインターフェースを提供します。

## 主な機能

- 📝 マークダウンファイルの作成、編集、削除
- 📁 階層フォルダー構造の表示・管理
- 🔍 ファイル検索・フィルタリング
- 🌐 GitHub API を通じたリポジトリ連携
- 📱 レスポンシブデザイン（モバイルファースト）
- ⚡ オフライン対応（PWA）

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **状態管理**: Context API + useReducer
- **スタイリング**: CSS Modules
- **API**: GitHub REST API
- **PWA**: Vite PWA Plugin

## セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. 環境変数の設定

`.env` ファイルを作成し、GitHub Personal Access Token を設定してください：

```env
VITE_GITHUB_TOKEN=your_personal_access_token_here
```

GitHub Personal Access Token は以下の権限が必要です：
- `repo` (プライベートリポジトリにアクセスする場合)
- `public_repo` (パブリックリポジトリのみの場合)

### 3. 開発サーバーの起動

```bash
bun run dev
```

### 4. ビルド

```bash
bun run build
```

## 使用方法

1. アプリケーションを開く
2. GitHub のユーザー名とリポジトリ名を入力
3. Personal Access Token を設定
4. ファイル一覧からメモを選択して編集

## アーキテクチャ

本アプリケーションは3層アーキテクチャで構成されています：

- **API層**: GitHub API との通信を担当
- **ビジネスロジック層**: アプリケーションの状態管理とロジック
- **UI層**: React コンポーネントによる表示

## 開発

### リント・型チェック

```bash
bun run lint
bun run typecheck
```

### PWA として使用

ビルド後、対応ブラウザでアクセスすると「ホーム画面に追加」オプションが表示されます。
