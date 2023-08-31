import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";


export default function Topbar() {
  const location = useLocation();
  const activeStyle = 'outline-2 outline-blue-200 outline outline-offset-2  bg-blue-200'
  return (
    <div className="h-12 w-full bg-blue-600 shadow left-0 z-20">
      <div className="container mx-auto h-full flex items-center justify-around px-4">
        <h2 className="text-xl font-bold">DOSECOM</h2>
        <ul className="space-x-6 flex flex-row  items-center">
          <li>
            <Link to="/home" className={`px-4 pb-1  rounded-2xl hover:outline-2 hover:outline-blue-200 hover:outline hover:outline-offset-2  hover:bg-blue-200 
            ${   location.pathname === '/home' ? activeStyle : ''
             } `}>
              Inicio
            </Link>
          </li>
          <li>
          <Link to="/loanCalculator" className={`px-4 pb-1  rounded-2xl hover:outline-2 hover:outline-blue-200 hover:outline hover:outline-offset-2  hover:bg-blue-200 
            ${   location.pathname === '/loanCalculator' ? activeStyle : ''
             } `}
          >
              Calculadora
            </Link>
          </li>
          <li>
          <Link to="/customers" className={`px-4 pb-1  rounded-2xl hover:outline-2 hover:outline-blue-200 hover:outline hover:outline-offset-2  hover:bg-blue-200 
            ${   location.pathname === '/customers' ? activeStyle : ''
             } `}>
              Clientes
            </Link>
          </li>
          <li>
            <Link to="/loan" className={`px-4 pb-1  rounded-2xl hover:outline-2 hover:outline-blue-200 hover:outline hover:outline-offset-2  hover:bg-blue-200 
            ${   location.pathname === '/loan' ? activeStyle : ''
             } `}>
              Settings
            </Link>
          </li>
          <li>
            <a href="#" className={`px-4 pb-1  rounded-2xl hover:outline-2 hover:outline-blue-200 hover:outline hover:outline-offset-2  hover:bg-blue-200 
            ${   location.pathname === '' ? activeStyle : ''
             } `}>
              Logout
            </a>
          </li>
        </ul>
      <h2 className="text-xl font-bold">      <Clock />
</h2>
      </div>

    </div>
  );
}


const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();

  const formattedHours = hours > 12 ? hours - 12 : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  const amPm = hours >= 12 ? "PM" : "AM";

  return (
    <div>
      <p>
        {formattedHours}:{formattedMinutes} {amPm}
      </p>
    </div>
  );
};

