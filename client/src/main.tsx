// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UsersProvider } from './contexts/UsersContext.tsx'
import { ConversationsProvider } from './contexts/ConversationsContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <BrowserRouter>
      <UsersProvider>
        <ConversationsProvider>
          <App />
          </ConversationsProvider>
        </UsersProvider>
    </BrowserRouter>
  // </StrictMode>
)
