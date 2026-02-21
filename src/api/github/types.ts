/**
 * GitHub API 専用の型定義
 */

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

export interface GitHubCreateFileRequest {
  message: string
  content: string
  sha?: string
}

export interface GitHubDeleteFileRequest {
  message: string
  sha: string
}

export interface GitHubRepositoryInfo {
  name: string
  full_name: string
  private: boolean
  owner: {
    login: string
  }
  permissions?: {
    push: boolean
    pull: boolean
  }
}