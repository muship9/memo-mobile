/**
 * GitHub 認証・接続テスト API
 */

import { ApiClient } from '../client'
import type { GitHubRepositoryInfo } from './types'

/**
 * GitHub Auth API ファクトリー
 */
export const createGitHubAuthApi = (token: string) => {
  const client = ApiClient('https://api.github.com', {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  })

  /**
   * GitHub接続をテスト（認証確認）
   */
  const testConnection = async (): Promise<boolean> => {
    try {
      await client.get('/user')
      return true
    } catch {
      return false
    }
  }

  /**
   * リポジトリアクセス権限をテスト
   */
  const testRepositoryAccess = async (repo: string): Promise<GitHubRepositoryInfo> => {
    return client.get<GitHubRepositoryInfo>(`/repos/${repo}`)
  }

  /**
   * トークンとリポジトリの組み合わせをテスト
   */
  const validateTokenAndRepository = async (repo: string): Promise<{
    isValid: boolean
    repository?: GitHubRepositoryInfo
    error?: string
  }> => {
    try {
      // まず認証をテスト
      const connectionValid = await testConnection()
      if (!connectionValid) {
        return {
          isValid: false,
          error: 'GitHub Token が無効です'
        }
      }

      // 次にリポジトリアクセスをテスト
      const repository = await testRepositoryAccess(repo)
      
      return {
        isValid: true,
        repository
      }
    } catch (error: unknown) {
      let errorMessage = 'リポジトリにアクセスできません'
      
      if (error && typeof error === 'object' && 'status' in error) {
        const statusError = error as { status: number }
        if (statusError.status === 404) {
          errorMessage = 'リポジトリが見つからないか、アクセス権限がありません'
        } else if (statusError.status === 403) {
          errorMessage = 'リポジトリへのアクセス権限がありません'
        }
      }
      
      return {
        isValid: false,
        error: errorMessage
      }
    }
  }

  return {
    testConnection,
    testRepositoryAccess,
    validateTokenAndRepository,
  }
}

/**
 * ユーティリティ関数
 */
export const authUtils = {
  /**
   * GitHub Token の形式をバリデーション
   */
  validateTokenFormat: (token: string): boolean => {
    return /^gh[ps]_[A-Za-z0-9_]{36,251}$/.test(token)
  },

  /**
   * リポジトリ名の形式をバリデーション
   */
  validateRepositoryFormat: (repo: string): boolean => {
    return /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo)
  },

  /**
   * 入力値のサニタイズ
   */
  sanitizeInputs: (token: string, repo: string) => {
    return {
      token: token.trim(),
      repo: repo.trim().toLowerCase()
    }
  }
}

// 後方互換性のためのクラス風ラッパー
export const GitHubAuthApi = createGitHubAuthApi