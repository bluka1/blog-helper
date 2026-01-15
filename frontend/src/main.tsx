import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LoadingContextProvider } from './providers/LoadingContextProvider.tsx'
import { AuthContextProvider } from './providers/AuthContextProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { PostsProvider } from './providers/PostsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingContextProvider>
        <AuthContextProvider>
          <PostsProvider>
            <App />
          </PostsProvider>
        </AuthContextProvider>
      </LoadingContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
