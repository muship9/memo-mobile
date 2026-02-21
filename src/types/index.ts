export interface FileTreeItem {
  type: 'file' | 'folder'
  name: string
  path: string
  sha?: string
  size?: number
}

export interface GitHubFileResponse {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: 'file' | 'dir'
  content?: string
  encoding?: string
}

export interface GitHubFileContent {
  content: string
  sha: string
}

export interface GitHubCommitResponse {
  content: {
    name: string
    path: string
    sha: string
  }
  commit: {
    sha: string
    message: string
  }
}

export type ScreenType = 'setup' | 'list' | 'edit' | 'new'

export interface NbContextType {
  // 設定
  token: string | null
  repo: string | null
  setConfig: (token: string, repo: string) => void
  
  // 画面遷移
  currentScreen: ScreenType
  setCurrentScreen: (screen: ScreenType) => void
  
  // ファイル編集
  currentFile: string | null
  currentContent: string
  currentSha: string | null
  setFile: (path: string, content: string, sha: string) => void
  setCurrentContent: (content: string) => void
  
  // ファイルツリー
  fileTree: FileTreeItem[]
  setFileTree: (tree: FileTreeItem[]) => void
  
  // ローディング状態
  loading: boolean
  setLoading: (loading: boolean) => void
  
  // エラー状態
  error: string | null
  setError: (error: string | null) => void
}