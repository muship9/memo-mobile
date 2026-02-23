/**
 * GitHub ファイル操作 API
 */

import { ApiClient } from '../client'
import type { 
  GitHubFileResponse, 
  GitHubFileContent, 
  GitHubCommitResponse,
  GitHubCreateFileRequest,
  GitHubDeleteFileRequest
} from './types'

/**
 * UTF-8安全なBase64エンコード
 */
const encodeBase64Content = (content: string): string => {
  const encoder = new TextEncoder()
  const utf8Bytes = encoder.encode(content)
  const binaryString = String.fromCharCode(...utf8Bytes)
  return btoa(binaryString)
}

/**
 * UTF-8安全なBase64デコード
 */
const decodeBase64Content = (base64Content: string): string => {
  const cleanBase64 = base64Content.replace(/\n/g, '')
  const binaryString = atob(cleanBase64)
  const bytes = new Uint8Array(binaryString.length)
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new TextDecoder('utf-8').decode(bytes)
}

/**
 * パスの正規化
 */
const normalizePath = (path: string): string => {
  return path.replace(/^\/+/, '').replace(/\/+$/, '')
}

/**
 * GitHub Files API ファクトリー
 */
export const createGitHubFilesApi = (token: string, repo: string) => {
  const client = ApiClient('https://api.github.com', {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  })

  /**
   * ファイル内容を取得
   */
  const getFileContent = async (path: string): Promise<GitHubFileContent> => {
    try {
      const normalizedPath = normalizePath(path)
      const apiPath = `/repos/${repo}/contents/${normalizedPath}`
      const data = await client.get<GitHubFileResponse>(apiPath)
      
      // 空ファイルの場合、contentが存在しないか空なので空文字列として扱う
      const content = data.content ? decodeBase64Content(data.content) : ''
      
      return {
        content,
        sha: data.sha,
      }
    } catch (error) {
      throw new Error(`ファイルの読み込みに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * ファイルを保存（更新）
   */
  const saveFile = async (
    path: string,
    content: string,
    sha: string,
    message: string = 'Update from nb mobile'
  ): Promise<GitHubCommitResponse> => {
    try {
      const normalizedPath = normalizePath(path)
      const apiPath = `/repos/${repo}/contents/${normalizedPath}`
      
      const requestData: GitHubCreateFileRequest = {
        message,
        content: encodeBase64Content(content),
        sha,
      }
      
      return await client.put<GitHubCommitResponse>(apiPath, requestData)
    } catch (error) {
      throw new Error(`ファイルの保存に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * ファイルが存在するかチェック
   */
  const fileExists = async (path: string): Promise<boolean> => {
    try {
      const normalizedPath = normalizePath(path)
      const apiPath = `/repos/${repo}/contents/${normalizedPath}`
      await client.get(apiPath)
      return true
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * 新規ファイルを作成
   */
  const createFile = async (
    path: string,
    content: string,
    message: string = 'Create from nb mobile'
  ): Promise<GitHubCommitResponse> => {
    try {
      const normalizedPath = normalizePath(path)
      
      // ファイルの存在チェック
      if (await fileExists(normalizedPath)) {
        throw new Error('このファイルは既に存在します')
      }
      
      const apiPath = `/repos/${repo}/contents/${normalizedPath}`
      
      const requestData: GitHubCreateFileRequest = {
        message,
        content: encodeBase64Content(content),
      }
      
      return await client.put<GitHubCommitResponse>(apiPath, requestData)
    } catch (error) {
      if (error instanceof Error && error.message.includes('422')) {
        throw new Error('このファイルは既に存在します')
      }
      throw new Error(`ファイルの作成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * ファイルを削除
   */
  const deleteFile = async (
    path: string,
    sha: string,
    message: string = 'Delete from nb mobile'
  ): Promise<GitHubCommitResponse> => {
    try {
      const normalizedPath = normalizePath(path)
      const apiPath = `/repos/${repo}/contents/${normalizedPath}`
      
      const requestData: GitHubDeleteFileRequest = {
        message,
        sha,
      }
      
      return await client.request<GitHubCommitResponse>(apiPath, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })
    } catch (error) {
      throw new Error(`ファイルの削除に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * ファイル履歴を取得
   */
  const getFileHistory = async (path: string, limit: number = 10): Promise<unknown[]> => {
    try {
      const normalizedPath = normalizePath(path)
      const apiPath = `/repos/${repo}/commits`
      
      return await client.get(apiPath, {
        path: normalizedPath,
        per_page: limit.toString(),
      })
    } catch (error) {
      throw new Error(`ファイル履歴の取得に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return {
    getFileContent,
    saveFile,
    createFile,
    deleteFile,
    fileExists,
    getFileHistory,
  }
}

/**
 * ファイル操作のユーティリティ関数
 */
export const fileUtils = {
  /**
   * ファイル名の拡張子を自動追加
   */
  ensureMarkdownExtension: (fileName: string): string => {
    if (!fileName.endsWith('.md') && !fileName.endsWith('.txt') && !fileName.endsWith('.markdown')) {
      return `${fileName}.md`
    }
    return fileName
  },

  /**
   * ファイルパスのバリデーション
   */
  validateFilePath: (path: string): { isValid: boolean; error?: string } => {
    if (!path.trim()) {
      return { isValid: false, error: 'ファイルパスを入力してください' }
    }

    if (path.includes('..')) {
      return { isValid: false, error: '不正なパスが含まれています' }
    }

    if (path.startsWith('/') || path.endsWith('/')) {
      return { isValid: false, error: 'ファイルパスの形式が正しくありません' }
    }

    return { isValid: true }
  },

  /**
   * デフォルトコンテンツの生成
   */
  generateDefaultContent: (fileName: string): string => {
    const name = fileName.replace(/\.(md|txt|markdown)$/i, '')
    const today = new Date().toISOString().split('T')[0]
    
    return `# ${name}\n\nCreated: ${today}\n\n`
  }
}

// 後方互換性のためのクラス風ラッパー
export const GitHubFilesApi = createGitHubFilesApi