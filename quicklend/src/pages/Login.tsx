import { faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function Login() {
    return (
        <div className='h-screen flex justify-end items-center loginContainer'>
            <div className=' w-96 h-[40rem] bg-white mr-5 rounded-xl p-2 border border-slate-400 flex flex-col justify-center items-center gap-4'>
                <FontAwesomeIcon icon={faUserAlt} size='4x' className=' circle border-[3px] border-blue-700 text-blue-700 p-5' />
                <div className='w-2/3'>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">Usuario</label>
                    <input type="text" id="first_name" className="bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                </div>
                <div className='w-2/3'>
            <label  className="block mb-2 text-sm font-medium text-gray-900">Contrasena</label>
            <input type="password" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required/>
        </div>
        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-2.5 mr-2 mb-2 ">Entrar</button>

            </div>
        </div>
    )
}
