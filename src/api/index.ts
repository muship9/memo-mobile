/**
 * API層の統一エクスポート
 */

// GitHub API
import { GitHubAuthApi, authUtils } from './github/auth'
import { GitHubRepositoryApi } from './github/repository'
import { GitHubFilesApi, fileUtils } from './github/files'

export { GitHubAuthApi, authUtils, GitHubRepositoryApi, GitHubFilesApi, fileUtils }

// 型定義
export type * from './github/types'

// クライアント
export { ApiClient } from './client'
export type { ApiError } from './client'

/**
 * GitHub APIファクトリー - 関数型アプローチ
 */
export const createGitHubApiFactory = (token: string, repo: string) => {
  const auth = () => GitHubAuthApi(token)
  const repository = () => GitHubRepositoryApi(token, repo)
  const files = () => GitHubFilesApi(token, repo)

  /**
   * 全APIの準備ができているかテスト
   */
  const validateSetup = async (): Promise<{
    isValid: boolean
    error?: string
  }> => {
    try {
      const authApi = auth()
      const result = await authApi.validateTokenAndRepository(repo)
      return result
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return {
    auth,
    repository,
    files,
    validateSetup,
  }
}

// 後方互換性のためのクラス風ラッパー
export const GitHubApiFactory = createGitHubApiFactory