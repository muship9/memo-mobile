import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NbProvider } from './contexts/NbContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NbProvider>
      <App />
    </NbProvider>
  </StrictMode>,
)
