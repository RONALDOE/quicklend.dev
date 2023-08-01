import { Link } from "react-router-dom";

export default function Topbar() {
  return (
    <div className="h-12 w-full bg-blue-500 shadow left-0 z-20">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <h2 className="text-xl font-bold">DOSE</h2>
        <ul className="space-x-6 flex items-center">
          <li>
            <Link to="/home" className="">
              Inicio
            </Link>
          </li>
          <li>
          <Link to="/loanCalculator" className="">
              Calculadora de prestamos
            </Link>
          </li>
          <li>
          <Link to="/customers" className="">
              Clientes
            </Link>
          </li>
          <li>
            <a href="#" className=" ">
              Settings
            </a>
          </li>
          <li>
            <a href="#" className=" ">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
