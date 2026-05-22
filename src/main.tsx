import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ConfirmProvider } from './context/confirmContext.tsx'
import { DataProvider } from './context/dataContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DataProvider>
        <ConfirmProvider>
          <App />
        </ConfirmProvider>
      </DataProvider>
    </BrowserRouter>  
  </StrictMode>,
)
