import { useContext } from 'react'
import { NbContext } from '../contexts/NbContextType'

export const useNb = () => {
  const context = useContext(NbContext)
  if (!context) {
    throw new Error('useNb must be used within NbProvider')
  }
  return context
}