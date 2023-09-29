// @ts-nocheck 
import axios from 'axios';
import { createContext, useState, useContext } from 'react';

export interface IUser {
  id: number;
  username: string;
  email?: string | null;
  psswd: string;
  adminLevel: number;
}
interface Props {
    children: React.ReactNode;
  }

type ContextValue = {
  user: IUser | null; // Agregamos la propiedad 'user'

  saveUser: (user: IUser) => Promise<void>;
  updateUserEmail: (id: number, email: string | null) => Promise<void>;
};

export const UserContext = createContext<ContextValue>({
  user: null, // Inicializamos 'user' como null

  saveUser: () => Promise.resolve(),
  updateUserEmail: () => Promise.resolve(),
});

export const useUserContext = () => useContext(UserContext);


export const Provider: React.FC<Props> = ({ children }) => {

  const [user, setUser] = useState<IUser | null>(null);

  const saveUser = async (user: IUser) => {
    try {
      // Aquí realizarías una petición HTTP o llamada a una API para guardar el usuario en la base de datos.
      console.log(user  )
      setUser(user)
    } catch (error) {
      // Manejo de errores
    }
  };

  const updateUserEmail = async (id: number, email: string | null) => {
    try {
      // Aquí realizarías una petición HTTP o llamada a una API para actualizar el correo electrónico del usuario en la base de datos.
      // Por ejemplo, usando axios:
    } catch (error) {
      // Manejo de errores
    }
  };

  return (
    <UserContext.Provider value={{ user, saveUser, updateUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};
