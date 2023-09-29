// @ts-nocheck 
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@utils/userContext";
import axios from "axios";

interface Error {
  state: boolean;
  msg: string;
}

export default function Login() {
  const [user, setUsername] = useState("");
  const [error, setError] = useState<Error>({ state: false, msg: "" });
  const [count, setCount] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState<string | null>(null);
  const [typedCode, setTypedCode] = useState<string>("");
  const [email, setEmail] = useState("");
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [showRecovery, setShowRecovery] = useState<boolean>(false);
  const [showRecoveryForm, setShowRecoveryForm] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [recoveringPassword, setRecoveringPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { saveUser } = useUserContext();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        saveUser(data.user);
        document.cookie = `token=${token}; max-age=${
          3600 * 1
        }; path=/; samesite=strict`;
        navigate("/home");
      } else {
        setError({ state: true, msg: "Usuario o contraseña incorrectos" });
        if (count >= 2) {
          setShowRecovery(true);
          return;
        }
        setCount(count + 1);
      }
    } catch (error) {
      console.error("Error al realizar el inicio de sesión", error);
      setError({ state: true, msg: "Usuario o contraseña incorrectos" });
    }
  };

  const handleRecoverPassword = async () => {
    try {
      // Enviar una solicitud POST para recuperación de contraseña
      const response = await axios.post(
        "http://localhost:3001/api/auth/send-recovery-email",
        {
          email: email,
        },
      );

      if (response.status === 200 && response.data.code) {
        setShowCodeInput(true);
        setShowRecoveryForm(false);
        setCode(response.data.code);
      } else {
        setError({state: true, msg: "Error al enviar codigo"})

        console.error("Error al enviar el correo de recuperación");
    }
} catch (error) {
        setError({state: true, msg: "Correo Electronico No Encontrado"})
      console.error("Error al solicitar recuperación de contraseña", error);
    }
  };

  const handleVerifyCode = async () => {
    if (typedCode === code) {
      setShowCodeInput(false);
      setRecoveringPassword(true);
    } else {
      console.error("Código de verificación incorrecto");
      setError({ state: true, msg: "Codigo de verificación incorrecto" });
    }
  };

  const handleChangePassword = async () => {

    if(newPassword !== newPasswordConfirm){
        setError({state: true, msg: "Las contraseñas no coinciden"})
        return
    }
    try {
      const response = await fetch("http://localhost:3001/api/auth/changePassword", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: newPassword }),
      });

      if (response.ok) {
        console.log("Contraseña cambiada exitosamente");
        setRecoveringPassword(false);
      } else {
        console.error("Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña", error);
    }
  };

  return (
    <div className="loginContainer flex h-screen items-center justify-end">
      <div className="mr-5 flex h-[40rem] w-96 flex-col items-center justify-center gap-4 rounded-xl border border-slate-400 bg-white p-2">
        <FontAwesomeIcon
          icon={faUserAlt}
          size="4x"
          className="circle border-[3px] border-blue-700 p-5 text-blue-700"
        />
        <div className="w-2/3">
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Usuario
          </label>
          <input
            type="text"
            id="username"
            className="block w-full  rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
            value={user}
            onChange={(e) => {
              setError({ state: false, msg: "" });
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="w-2/3">
          <label className="mb-2 block text-sm font-medium text-gray-900">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
            value={password}
            onChange={(e) => {
              setError({ state: false, msg: "" });
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-blue-700 px-10 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
          onClick={handleLogin}
        >
          Entrar
        </button>

        {error?.state && (
          <span className="text-center font-semibold text-red-500">
            {error.msg}
          </span>
        )}
        {showRecovery && (
          <span
            className="cursor-pointer text-center font-semibold text-blue-500"
            onClick={() => setShowRecoveryForm(true)}
          >
            Olvidé mi usuario/contraseña
          </span>
        )}
        {showRecoveryForm && !recoveringPassword && (
          <div className="fixed bottom-0  left-0 right-0 top-0 z-50 flex  items-center justify-center bg-black bg-opacity-50">
            <div className="flex  w-96 flex-col gap-12 rounded items-center justify-center bg-white px-2 py-2  ">
              <p className="mb-4 mt-4 text-center text-xl font-bold">
                Recuperación De Acceso
              </p>
              <div className="w-2/3 flex flex-col  items-center justify-center">
                <label className="mb-2 block text-sm text-left w-full font-medium text-gray-900">
                  Correo Electrónico
                </label>
                <input
                  type="text"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-red-500">{error.msg}</p>

              </div>
              <button
                className="-mt-10 rounded bg-green-400 px-3 py-1 text-black font-bold hover:bg-green-500 focus:outline-none"
                onClick={handleRecoverPassword}
              >
                Enviar Código de Verificación
              </button>
              <button
                className="-mt-5 rounded bg-red-400 px-3 py-1 text-black font-bold hover:bg-red-500 focus:outline-none"
                onClick={() => {
                  setShowRecoveryForm(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        {recoveringPassword && (
          <div className="fixed bottom-0  left-0 right-0 top-0 z-50 flex  items-center justify-center bg-black bg-opacity-50">
            <div className="flex  w-96 flex-col gap-12 rounded bg-white px-2 py-2 items-center justify-center text-left ">
              <p className="mb-4 mt-4 text-center text-xl font-bold">
                Restablecer Contraseña
              </p>
              <div className="w-2/3 flex flex-col items-center justify-center">
                <label className="mb-2 block text-sm font-medium text-gray-900 w-full">
                  Nueva contraseña
                </label>
                <input
                  type="text"
                  id="email"
                  className="block mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setError({ state: false, msg: "" });
                    setNewPassword(e.target.value)}}
                />
                <label className="mb-2 block text-sm font-medium text-gray-900 w-full   ">
                  Confirme su nueva contraseña
                </label>
                <input
                  type="text"
                  id="email"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                  value={newPasswordConfirm}
                  onChange={(e) => {
                    setError({ state: false, msg: "" });
                    setNewPasswordConfirm(e.target.value)}}
                />
              </div>
              {error.state &&(<p className="text-red-500">{error.msg}</p>)}
              
              <button
                className="-mt-10 rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 focus:outline-none"
                onClick={handleChangePassword}
              >
                Reestablecer Contraseña
              </button>
              <button
                className="-mt-5 rounded px-20 bg-red-600 px-3 py-1 text-white hover:bg-red-700 focus:outline-none"
                onClick={() => {
                  setRecoveringPassword(false);
                }}
              >Cerrar</button>
            </div>
          </div>
        )}
        {showCodeInput && (
          <div className=" fixed bottom-0 left-0 right-0 top-0 flex  items-center justify-center bg-black bg-opacity-50">
            <div className="flex w-96 flex-col items-center justify-center gap-4 rounded bg-white px-2 py-2">
              <p className="text-2xl font-bold">Ingrese su codigo secreto</p>
              <input
                type="password"
                name="clave"
                className="w-40 rounded border p-1 "
                placeholder="Ingrese su codigo secreto"
                value={typedCode}
                onChange={(e) => {
                    setError({ state: false, msg: "" });

                    setTypedCode(e.target.value)}}
              />
              <button
                className="ml-2 rounded bg-green-500 px-3 py-1  text-xl font-bold text-white hover:bg-green-600"
                onClick={handleVerifyCode}
              >
                Autorizar
              </button>
              
              {error.state && (
                <>
                  <p className="text-red-500">{error.msg}</p>
                  
                </>
              )}
              <p className="text-blue-500 cursor-pointer font-semibold" onClick={handleRecoverPassword}>
                    Reenviar Codigo
                    
                  </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
