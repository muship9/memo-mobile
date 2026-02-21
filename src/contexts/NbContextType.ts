import { createContext } from 'react'
import type { NbContextType } from '../types'

export const NbContext = createContext<NbContextType | undefined>(undefined)
