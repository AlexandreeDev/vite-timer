
import {ThemeProvider} from 'styled-components'
import { defaultTheme } from "./components/styles/themes/default"
import { GlobalStyle } from "./components/styles/themes/global"
import {BrowserRouter} from 'react-router-dom'
import { Router } from './Router'
import { CyclesContextProvider } from './Contexts/CyclesContext'

export function App() {

  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
      <CyclesContextProvider>
      <Router />
      </CyclesContextProvider>
      </BrowserRouter>

    <GlobalStyle />
    </ThemeProvider>
    

  
  )
}
