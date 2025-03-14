import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import {register} from '../../lib/api'

export default function Register(){

    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [uniqueUserName, setUniqueUserName] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const navigate = useNavigate();

    useEffect(()=>{
        try{
            if(name[name.length-1]  == " " && name[name.length-2] == " "){
                setName(name.slice(0,-1))
                throw new Error("Nem lehet több space egymás mellett");
            }
            if(!uniqueUserName){
                setUserName(name.toLowerCase().replace(/ /g, '.'));
            }
        } catch(error){
            alert(error)
        }
    }, [name])

    useEffect(()=>{
        if(userName.length == 0){
            setUniqueUserName(false);
        }
    }, [userName])

    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try{
            await register(name,userName,email,password,password2)

            navigate("/login")
        }
        catch(error){
            alert(error);
        }
    }

    return <>
        <div className="w-dvw flex flex-wrap h-screen p-2 sm:overflow-auto justify-center items-center">
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-indigo-950 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleRegister}>
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">Regisztráció</h5>
                <div>
                    <label htmlFor="name"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Név</label>
                    <input type="text" name="name" id="name"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           placeholder="Jakab Zoltán" value={name} onChange={(e) => {
                        setName(e.target.value)
                    }} required/>
                </div>
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Felhasználónév</label>
                    <input type="text" name="username" id="username"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           placeholder="jakab.zoltan" value={userName} onChange={(e) => {
                        setUserName(e.target.value);
                        setUniqueUserName(true)
                    }} required/>
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                        cím</label>
                    <input type="email" name="email" id="email"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           placeholder="pelda@gmail.com" value={email} onChange={(e) => {
                        setEmail(e.target.value)
                    }} required/>
                </div>
                <div className="relative">
                    <label htmlFor="password"
                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jelszó</label>
                    <input type={showPassword ? 'text' : 'password'} name="password" id="password"
                           placeholder="••••••••"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           value={password} onChange={(e) => {
                        setPassword(e.target.value)
                    }} autoComplete={password} required/>
                    <span onClick={togglePasswordVisibility}
                          className="absolute inset-y-12 right-2 flex items-center cursor-pointer text-gray-600 dark:text-gray-400">
                        {showPassword ? <FaEyeSlash size={30}/> : <FaEye size={30}/>}
                    </span>

                </div>
                <div>
                    <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jelszó
                        újra</label>
                    <input type={showPassword ? 'text' : 'password'} name="password2" id="password2"
                           placeholder="••••••••"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           value={password2} onChange={(e) => {
                        setPassword2(e.target.value)
                    }} required/>
                </div>
                <button type="submit"
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Regisztráció
                </button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Van fiókja? <a onClick={() => navigate("/login")}
                                     className="text-blue-700 hover:underline dark:text-blue-500">Bejeletkezés</a>
                </div>
            </form>
        </div>
        </div>
    </>
}