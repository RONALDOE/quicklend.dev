import { faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@utils/userContext';

export default function Login() {
    const [user, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { saveUser } = useUserContext();
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user, password })
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                saveUser(data.user)
                // Almacenar el token en una cookie
                document.cookie = `token=${token}; max-age=${3600 * 1}; path=/; samesite=strict`;
                console.log(data.user,document.cookie,);

                navigate('/home')
            } else {
                console.log('Inicio de sesión fallido');
            }
        } catch (error) {
            console.error('Error al realizar el inicio de sesión', error);
        }
    };

    return (
        <div className='h-screen flex justify-end items-center loginContainer'>
            <div className='w-96 h-[40rem] bg-white mr-5 rounded-xl p-2 border border-slate-400 flex flex-col justify-center items-center gap-4'>
                <FontAwesomeIcon icon={faUserAlt} size='4x' className='circle border-[3px] border-blue-700 text-blue-700 p-5' />
                <div className='w-2/3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={user}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='w-2/3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 mr-2 mb-2"
                    onClick={handleLogin}
                >
                    Entrar
                </button>
            </div>
        </div>
    );
}
