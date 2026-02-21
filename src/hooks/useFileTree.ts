/**
 * ファイルツリー管理のビジネスロジック
 */

import { useState, useCallback, useEffect } from 'react'
import { useNb } from './useNb'
import { GitHubApiFactory } from '../api'
import type { FileTreeItem } from '../types'

interface UseFileTreeReturn {
  // State
  expandedFolders: Set<string>
  refreshing: boolean
  
  // Actions
  loadFileTree: () => Promise<void>
  refreshFileTree: () => Promise<void>
  toggleFolder: (folderPath: string) => void
  handleFileClick: (item: FileTreeItem) => Promise<void>
  handleNewFile: () => void
  handleLogout: () => void
  
  // Data
  buildTree: () => { rootItems: FileTreeItem[]; folderMap: Map<string, FileTreeItem[]>; isExpanded: (path: string) => boolean }
}

export function useFileTree(): UseFileTreeReturn {
  const { 
    token, 
    repo, 
    fileTree, 
    setFileTree, 
    setCurrentScreen, 
    setFile,
    setLoading,
    setError
  } = useNb()
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [refreshing, setRefreshing] = useState(false)

  const loadFileTree = useCallback(async () => {
    if (!token || !repo) return
    
    setLoading(true)
    setError(null)
    
    try {
      const apiFactory = GitHubApiFactory(token, repo)
      const repositoryApi = apiFactory.repository()
      const tree = await repositoryApi.getFileTree()
      setFileTree(tree)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'ファイル一覧の取得に失敗しました')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [token, repo, setLoading, setError, setFileTree])

  const refreshFileTree = useCallback(() => {
    setRefreshing(true)
    return loadFileTree()
  }, [loadFileTree])

  const toggleFolder = useCallback((folderPath: string) => {
    setExpandedFolders(prev => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(folderPath)) {
        newExpanded.delete(folderPath)
      } else {
        newExpanded.add(folderPath)
      }
      return newExpanded
    })
  }, [])

  const handleFileClick = useCallback(async (item: FileTreeItem) => {
    if (!token || !repo) return
    
    if (item.type === 'folder') {
      toggleFolder(item.path)
    } else {
      // ファイルを開く
      setLoading(true)
      try {
        const apiFactory = GitHubApiFactory(token, repo)
        const filesApi = apiFactory.files()
        const fileContent = await filesApi.getFileContent(item.path)
        
        setFile(item.path, fileContent.content, fileContent.sha)
        setCurrentScreen('edit')
      } catch (error) {
        setError(error instanceof Error ? error.message : 'ファイルの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }
  }, [token, repo, toggleFolder, setLoading, setError, setFile, setCurrentScreen])

  const handleNewFile = useCallback(() => {
    setCurrentScreen('new')
  }, [setCurrentScreen])

  const handleLogout = useCallback(() => {
    if (confirm('ログアウトしますか？設定したToken情報が削除されます。')) {
      localStorage.removeItem('nb_token')
      localStorage.removeItem('nb_repo')
      window.location.reload()
    }
  }, [])

  // Build hierarchical tree structure data for rendering
  const buildTree = useCallback(() => {
    const folderMap = new Map<string, FileTreeItem[]>()
    const rootItems: FileTreeItem[] = []

    fileTree.forEach(item => {
      const pathParts = item.path.split('/')
      if (pathParts.length === 1) {
        rootItems.push(item)
      } else {
        const parentPath = pathParts.slice(0, -1).join('/')
        if (!folderMap.has(parentPath)) {
          folderMap.set(parentPath, [])
        }
        folderMap.get(parentPath)!.push(item)
      }
    })

    return {
      rootItems,
      folderMap,
      isExpanded: (path: string) => expandedFolders.has(path)
    }
  }, [fileTree, expandedFolders])

  // 初回ロード
  useEffect(() => {
    if (token && repo) {
      loadFileTree()
    }
  }, [token, repo, loadFileTree])

  return {
    expandedFolders,
    refreshing,
    loadFileTree,
    refreshFileTree,
    toggleFolder,
    handleFileClick,
    handleNewFile,
    handleLogout,
    buildTree,
  }
}