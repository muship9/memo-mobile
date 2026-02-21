import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { FileTreeItem, ScreenType, NbContextType } from '../types'
import { NbContext } from './NbContextType'

interface NbProviderProps {
  children: ReactNode
}

export function NbProvider({ children }: NbProviderProps) {
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('nb_token')
  )
  const [repo, setRepo] = useState<string | null>(() => 
    localStorage.getItem('nb_repo')
  )
  
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    return (token && repo) ? 'list' : 'setup'
  })
  
  const [currentFile, setCurrentFile] = useState<string | null>(null)
  const [currentContent, setCurrentContent] = useState('')
  const [currentSha, setCurrentSha] = useState<string | null>(null)
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('nb_token', token)
    } else {
      localStorage.removeItem('nb_token')
    }
  }, [token])

  useEffect(() => {
    if (repo) {
      localStorage.setItem('nb_repo', repo)
    } else {
      localStorage.removeItem('nb_repo')
    }
  }, [repo])

  const setConfig = (newToken: string, newRepo: string) => {
    setToken(newToken)
    setRepo(newRepo)
    setError(null)
  }

  const setFile = (path: string, content: string, sha: string) => {
    setCurrentFile(path)
    setCurrentContent(content)
    setCurrentSha(sha)
  }

  const value: NbContextType = {
    token,
    repo,
    setConfig,
    currentScreen,
    setCurrentScreen,
    currentFile,
    currentContent,
    currentSha,
    setFile,
    setCurrentContent,
    fileTree,
    setFileTree,
    loading,
    setLoading,
    error,
    setError,
  }

  return <NbContext.Provider value={value}>{children}</NbContext.Provider>
}

