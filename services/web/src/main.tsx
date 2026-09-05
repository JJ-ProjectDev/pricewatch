import './styles.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { WatchlistProvider } from './contexts/WatchlistContext'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <WatchlistProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </WatchlistProvider>
    </AuthProvider>
  </BrowserRouter>
)
