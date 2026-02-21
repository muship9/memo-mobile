/**
 * ファイル作成のビジネスロジック
 */

import { useState, useCallback, useMemo } from 'react'
import { useNb } from './useNb'
import { GitHubApiFactory, fileUtils } from '../api'

interface Template {
  type: 'daily' | 'meeting' | 'note'
  name: string
  icon: string
  generateFileName: () => string
  generateContent: () => string
}

interface UseFileCreatorReturn {
  // State
  fileName: string
  content: string
  isCreating: boolean
  
  // Actions
  setFileName: (fileName: string) => void
  setContent: (content: string) => void
  handleCreate: () => Promise<void>
  handleCancel: () => void
  applyTemplate: (templateType: string) => void
  
  // Data
  templates: Template[]
  
  // Validation
  fileNameError: string | null
}

export function useFileCreator(): UseFileCreatorReturn {
  const {
    token,
    repo,
    setCurrentScreen,
    setFile,
    setError,
  } = useNb()
  
  const [fileName, setFileNameState] = useState('')
  const [content, setContentState] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [fileNameError, setFileNameError] = useState<string | null>(null)

  const getTodayDate = useCallback(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }, [])

  const templates: Template[] = useMemo(() => [
    {
      type: 'daily',
      name: '📅 Daily Note',
      icon: '📅',
      generateFileName: () => `daily/${getTodayDate()}.md`,
      generateContent: () => `# ${getTodayDate()}\n\n## Today's Tasks\n- [ ] \n\n## Notes\n\n`
    },
    {
      type: 'meeting',
      name: '👥 Meeting',
      icon: '👥',
      generateFileName: () => `meetings/${getTodayDate()}-meeting.md`,
      generateContent: () => `# Meeting Notes - ${getTodayDate()}\n\n## Attendees\n- \n\n## Agenda\n1. \n\n## Discussion\n\n## Action Items\n- [ ] \n`
    },
    {
      type: 'note',
      name: '📝 Blank Note',
      icon: '📝',
      generateFileName: () => `notes/`,
      generateContent: () => `# \n\n## Overview\n\n## Details\n\n`
    }
  ], [getTodayDate])

  const setFileName = useCallback((newFileName: string) => {
    setFileNameState(newFileName)
    
    // リアルタイムバリデーション
    if (newFileName.trim()) {
      const validation = fileUtils.validateFilePath(newFileName)
      if (!validation.isValid) {
        setFileNameError(validation.error || null)
      } else {
        setFileNameError(null)
      }
    } else {
      setFileNameError(null)
    }
  }, [])

  const setContent = useCallback((newContent: string) => {
    setContentState(newContent)
  }, [])

  const applyTemplate = useCallback((templateType: string) => {
    const template = templates.find(t => t.type === templateType)
    if (template) {
      setFileName(template.generateFileName())
      setContent(template.generateContent())
    }
  }, [templates, setFileName, setContent])

  const validateInputs = useCallback((): boolean => {
    if (!fileName.trim()) {
      setFileNameError('ファイル名を入力してください')
      return false
    }

    const validation = fileUtils.validateFilePath(fileName)
    if (!validation.isValid) {
      setFileNameError(validation.error || null)
      return false
    }

    setFileNameError(null)
    return true
  }, [fileName])

  const handleCreate = useCallback(async () => {
    if (!token || !repo || !validateInputs()) return
    
    setIsCreating(true)
    setError(null)
    
    try {
      // ファイル名に拡張子を自動追加
      const finalPath = fileUtils.ensureMarkdownExtension(fileName.trim())
      
      // デフォルトコンテンツを生成（contentが空の場合）
      const finalContent = content.trim() || fileUtils.generateDefaultContent(finalPath)
      
      const apiFactory = GitHubApiFactory(token, repo)
      const filesApi = apiFactory.files()
      
      const result = await filesApi.createFile(
        finalPath,
        finalContent,
        `Create ${finalPath} from nb mobile`
      )
      
      // 成功時の処理：新規作成したファイルをエディタで開く
      setFile(finalPath, finalContent, result.content.sha)
      setCurrentScreen('edit')
      
    } catch (error) {
      let errorMessage = 'ファイルの作成に失敗しました'
      
      if (error instanceof Error) {
        if (error.message.includes('422') || error.message.includes('already exists')) {
          errorMessage = 'このファイルは既に存在します'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsCreating(false)
    }
  }, [token, repo, fileName, content, validateInputs, setError, setFile, setCurrentScreen])

  const handleCancel = useCallback(() => {
    if ((fileName.trim() || content.trim()) && !confirm('入力内容を破棄してもよろしいですか？')) {
      return
    }
    setCurrentScreen('list')
  }, [fileName, content, setCurrentScreen])

  return {
    fileName,
    content,
    isCreating,
    setFileName,
    setContent,
    handleCreate,
    handleCancel,
    applyTemplate,
    templates,
    fileNameError,
  }
}