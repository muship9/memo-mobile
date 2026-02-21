/**
 * ファイル編集のビジネスロジック
 */

import { useState, useEffect, useCallback } from 'react'
import { useNb } from './useNb'
import { GitHubApiFactory } from '../api'

interface UseFileEditorReturn {
  // State
  editedContent: string
  isSaving: boolean
  hasChanges: boolean
  
  // Actions
  setEditedContent: (content: string) => void
  handleSave: () => Promise<void>
  handleBack: () => void
  
  // Utils
  getFileName: () => string
  getFilePath: () => string
  canSave: boolean
}

export function useFileEditor(): UseFileEditorReturn {
  const {
    token,
    repo,
    currentFile,
    currentContent,
    currentSha,
    setCurrentContent,
    setCurrentScreen,
    setError,
  } = useNb()
  
  const [editedContent, setEditedContentState] = useState(currentContent)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // 現在のファイル内容が変更された時に同期
  useEffect(() => {
    setEditedContentState(currentContent)
  }, [currentContent])
  
  // 変更検知
  useEffect(() => {
    setHasChanges(editedContent !== currentContent)
  }, [editedContent, currentContent])

  const setEditedContent = useCallback((content: string) => {
    setEditedContentState(content)
  }, [])

  const handleSave = useCallback(async () => {
    if (!token || !repo || !currentFile || !currentSha || !hasChanges) return
    
    setIsSaving(true)
    setError(null)
    
    try {
      const apiFactory = GitHubApiFactory(token, repo)
      const filesApi = apiFactory.files()
      
      await filesApi.saveFile(
        currentFile,
        editedContent,
        currentSha,
        `Update ${currentFile} from nb mobile`
      )
      
      // 成功時の処理
      setCurrentContent(editedContent)
      setHasChanges(false)
      setError(null)
      
      // 成功通知
      alert('保存しました')
      
    } catch (error) {
      setError(error instanceof Error ? error.message : '保存に失敗しました')
    } finally {
      setIsSaving(false)
    }
  }, [token, repo, currentFile, currentSha, editedContent, hasChanges, setCurrentContent, setError])

  const handleBack = useCallback(() => {
    if (hasChanges) {
      if (!confirm('変更を破棄してもよろしいですか？')) {
        return
      }
    }
    setCurrentScreen('list')
  }, [hasChanges, setCurrentScreen])

  const getFileName = useCallback((): string => {
    if (!currentFile) return ''
    const parts = currentFile.split('/')
    return parts[parts.length - 1]
  }, [currentFile])

  const getFilePath = useCallback((): string => {
    return currentFile || ''
  }, [currentFile])

  const canSave = !isSaving && hasChanges && Boolean(currentFile && currentSha)

  return {
    editedContent,
    isSaving,
    hasChanges,
    setEditedContent,
    handleSave,
    handleBack,
    getFileName,
    getFilePath,
    canSave,
  }
}