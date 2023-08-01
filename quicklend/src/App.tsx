import {HashRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import { Provider } from './utils/userContext.tsx'
import LoanCalculator from './pages/LoanCalculator.tsx'
import Customers from './pages/Customers.tsx'
function App() {

  return (
    <Provider>
    <HashRouter>
      <Routes>
    <Route path='/'  element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/loanCalculator" element={<LoanCalculator/>} />
        <Route path="/customers" element={<Customers/>} />
      </Routes>
    </HashRouter> 
    </Provider>
  )
}

export default App
