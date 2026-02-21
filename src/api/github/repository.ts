/**
 * GitHub リポジトリ操作 API
 */

import { ApiClient } from '../client'
import type { GitHubFileResponse } from './types'
import type { FileTreeItem } from '../../types'

/**
 * ファイルがMarkdownファイルかどうかを判定
 */
const isMarkdownFile = (fileName: string): boolean => {
  return /\.(md|txt|markdown)$/i.test(fileName)
}

/**
 * GitHub Repository API Factory
 */
export const createGitHubRepositoryApi = (token: string, repo: string) => {
  const client = ApiClient('https://api.github.com', {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
  })

  /**
   * リポジトリ内のファイル・フォルダ一覧を取得
   */
  const getContents = async (path: string = ''): Promise<GitHubFileResponse[]> => {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path
    const apiPath = `/repos/${repo}/contents/${normalizedPath}`
    return client.get<GitHubFileResponse[]>(apiPath)
  }

  /**
   * ファイルツリーを再帰的に取得（Markdownファイルのみ）
   */
  const getFileTree = async (path: string = ''): Promise<FileTreeItem[]> => {
    try {
      const items = await getContents(path)
      const tree: FileTreeItem[] = []
      
      for (const item of items) {
        if (item.type === 'dir') {
          tree.push({ 
            type: 'folder', 
            name: item.name,
            path: item.path,
          })
          // 再帰的にサブフォルダを取得
          try {
            const subTree = await getFileTree(item.path)
            tree.push(...subTree)
          } catch (error) {
            console.warn(`Failed to get contents of ${item.path}:`, error)
          }
        } else if (isMarkdownFile(item.name)) {
          tree.push({ 
            type: 'file', 
            name: item.name,
            path: item.path,
            sha: item.sha,
            size: item.size,
          })
        }
      }
      
      return tree
    } catch (error) {
      throw new Error(`ファイル一覧の取得に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * フォルダ内の直接の子要素のみを取得
   */
  const getFolderContents = async (path: string): Promise<FileTreeItem[]> => {
    try {
      const items = await getContents(path)
      
      return items.map(item => ({
        type: item.type === 'dir' ? 'folder' as const : 'file' as const,
        name: item.name,
        path: item.path,
        sha: item.sha,
        size: item.size,
      })).filter(item => 
        item.type === 'folder' || isMarkdownFile(item.name)
      )
    } catch (error) {
      throw new Error(`フォルダ内容の取得に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * リポジトリ統計情報を取得
   */
  const getRepositoryStats = async (): Promise<{
    totalFiles: number
    totalFolders: number
    lastUpdated: Date | null
  }> => {
    try {
      const tree = await getFileTree()
      const totalFiles = tree.filter(item => item.type === 'file').length
      const totalFolders = tree.filter(item => item.type === 'folder').length
      
      // 最終更新日時は別途commits APIから取得する必要があるが、
      // ここでは簡易実装として現在時刻を返す
      return {
        totalFiles,
        totalFolders,
        lastUpdated: new Date()
      }
    } catch (error) {
      throw new Error(`統計情報の取得に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return {
    getContents,
    getFileTree,
    getFolderContents,
    getRepositoryStats,
  }
}

// 後方互換性のためのクラス風ラッパー
export const GitHubRepositoryApi = createGitHubRepositoryApi