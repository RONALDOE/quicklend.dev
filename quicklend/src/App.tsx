// @ts-nocheck 
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.tsx";
import Home from "./pages/Home.tsx";
import { Provider } from "./utils/userContext.tsx";
import LoanCalculator from "./pages/LoanCalculator.tsx";
import Customers from "./pages/Customers.tsx";
import Loans from "./pages/Loans.tsx";
import CustomersById from "./pages/CustomersById.tsx";
import Settings from "./pages/Settings.tsx";
import LoanVerify from "@pages/LoanVerify.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import Payments  from "@pages/Payments.tsx";
function App() {
  const [serverActive, setServerActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const [, updateRender] = useState(); // Create a dummy state variable

  useEffect(() => {
    const checkServer = async () => {
      setIsLoading(true);
      try {
        await axios.get("http://localhost:3001");
        setServerActive(true);
      } catch (error) {
        setError(true);
        console.log(error);
      }
      setIsLoading(false);
    };

    checkServer();
  }, [updateRender]);

  return (
    <HashRouter>
      {!isLoading && (
        <Provider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/loanCalculator" element={<LoanCalculator />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomersById />} />
            <Route path="/loans" element={<Loans/>} />
            <Route path="/settings" element={<Settings/>} />
            <Route path="/loan" element={<LoanVerify />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </Provider>
      )}
      {isLoading && (
        <div className="fixed bottom-0 left-0 right-0 top-0 flex  items-center justify-center bg-black bg-opacity-50">
          <div className="lds-dual-ring"></div>
        </div>
      )}
      {error && (
        <div className="fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex w-96 flex-col rounded bg-white px-2 py-2 shadow-md">
            <p className="mb-10 mt-4 text-center text-xl font-bold">
              {" "}
              Problema con la inicializacion del servidor
            </p>

            <div className="o-circle c-container__circle o-circle__sign--failure">
              <div className="o-circle__sign"></div>
            </div>
            <button
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none"
              onClick={() => setError(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </HashRouter>
  );
}

export default App;
