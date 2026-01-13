import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LoadingContextProvider } from './providers/LoadingContextProvider.tsx'
import { AuthContextProvider } from './providers/AuthContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </LoadingContextProvider>
  </StrictMode>,
)
