/**
 * GitHub セットアップフローのビジネスロジック
 */

import { useState, useCallback } from 'react'
import { useNb } from './useNb'
import { authUtils, GitHubApiFactory } from '../api'

interface UseGitHubSetupReturn {
  // State
  token: string
  repo: string
  isValidating: boolean
  
  // Actions
  setToken: (token: string) => void
  setRepo: (repo: string) => void
  handleSave: () => Promise<void>
  
  // Validation
  tokenError: string | null
  repoError: string | null
}

export function useGitHubSetup(): UseGitHubSetupReturn {
  const { setConfig, setCurrentScreen, setError } = useNb()
  const [token, setTokenState] = useState('')
  const [repo, setRepoState] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [repoError, setRepoError] = useState<string | null>(null)

  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken)
    // リアルタイムバリデーション
    if (newToken.trim() && !authUtils.validateTokenFormat(newToken)) {
      setTokenError('GitHub Token の形式が正しくありません')
    } else {
      setTokenError(null)
    }
  }, [])

  const setRepo = useCallback((newRepo: string) => {
    setRepoState(newRepo)
    // リアルタイムバリデーション
    if (newRepo.trim() && !authUtils.validateRepositoryFormat(newRepo)) {
      setRepoError('リポジトリ名の形式が正しくありません（例: username/repository）')
    } else {
      setRepoError(null)
    }
  }, [])

  const validateInputs = useCallback((): boolean => {
    let isValid = true
    
    if (!token.trim()) {
      setTokenError('GitHub Token を入力してください')
      isValid = false
    } else if (!authUtils.validateTokenFormat(token)) {
      setTokenError('GitHub Token の形式が正しくありません')
      isValid = false
    } else {
      setTokenError(null)
    }

    if (!repo.trim()) {
      setRepoError('リポジトリ名を入力してください')
      isValid = false
    } else if (!authUtils.validateRepositoryFormat(repo)) {
      setRepoError('リポジトリ名の形式が正しくありません（例: username/repository）')
      isValid = false
    } else {
      setRepoError(null)
    }

    return isValid
  }, [token, repo])

  const handleSave = useCallback(async () => {
    if (!validateInputs()) {
      return
    }
    
    setIsValidating(true)
    setError(null)
    
    try {
      // 入力値のサニタイズ
      const sanitized = authUtils.sanitizeInputs(token, repo)
      
      // GitHub API接続テスト
      const apiFactory = GitHubApiFactory(sanitized.token, sanitized.repo)
      const validationResult = await apiFactory.validateSetup()
      
      if (!validationResult.isValid) {
        throw new Error(validationResult.error || '接続に失敗しました')
      }
      
      // 成功時の処理
      setConfig(sanitized.token, sanitized.repo)
      setCurrentScreen('list')
      setError(null)
      
    } catch (error) {
      let errorMessage = '設定の保存に失敗しました'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setIsValidating(false)
    }
  }, [token, repo, validateInputs, setConfig, setCurrentScreen, setError])

  return {
    token,
    repo,
    isValidating,
    setToken,
    setRepo,
    handleSave,
    tokenError,
    repoError,
  }
}