import { useState} from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router"
import {getUser, pflogin} from '../../lib/api.ts'
import {useAuth} from "../../context/AuthContext.tsx";
import {User} from "@/Types/User.ts";
import {toast, ToastContainer} from "react-toastify";

/**
 * Bejelentkezési komponens, amely lehetővé teszi a felhasználók számára, hogy belépjenek az alkalmazásba.
 * A felhasználók a felhasználónevüket vagy e-mail címüket és jelszavukat használhatják a bejelentkezéshez.
 *
 * @component
 * @returns {JSX.Element} Bejelentkezéshez készített modállal tér vissza
 */
export default function Login(){
    /** A felhasználó által megadott felhasználónév vagy email cím. */
    const [emailUsername, setEmailUsername] = useState("");
    /** A felhasználó által megadott jelszó. */
    const [password, setPassword] = useState("");
    /** Flag, amely jelzi, hogy a jelszó láthatósága bekapcsolva van-e. */
    const [showPassword, setShowPassword] = useState(false);
    /** A bejelentkezés módja (email vagy felhasználónév). */
    let loginMode = "";
    /** Navigálás az alkalmazás különböző oldalai között. */
    const navigate = useNavigate();
    /** Bejelentkezési funkció a kontextusból. */
    const {bejelentkezes} = useAuth();

    /**
     * A jelszó láthatóságának átváltása.
     * A `showPassword` állapot értéke alapján változtatja meg a jelszó típusát.
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    /**
     * Bejelentkezési esemény kezelő, amely eldönti, hogy email cím vagy felhasználónév alapján történjen a bejelentkezés.
     * A megfelelő bejelentkezési mód kiválasztása után elküldi a felhasználói adatokat a backendnek.
     * Ha sikeres a bejelentkezés, a felhasználói profil információk alapján navigál a megfelelő oldalra.
     *
     * @param e Az esemény objektum, amely a form beküldését jelzi.
     */
    const handleLogin = async(e: { preventDefault: () => void; })=>{
        e.preventDefault();
        try{
            if(emailUsername.includes("@")){
                loginMode ="email";
            }
            else{
                loginMode = "username";
            }
            await pflogin(emailUsername, password, loginMode)
            const user: User = await getUser().then((res) => res.profile);
            console.log("User fetched:", user);

            bejelentkezes(user);
            console.log(user.isAdmin);
            if (!user.isAdmin) {
                navigate("/");
            } else {
                navigate("/admin/dashboard");
            }
        }
        catch(error:any){
            toast.error(error.message);
        }
    }


    return <>
        <div className=" w-dvw flex flex-wrap h-screen  justify-center items-center">
        <div className=" w-full max-w-sm p-4 bg-white h-fit border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-indigo-950 dark:border-gray-700">
            <form className="space-y-6" onSubmit={handleLogin}>
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">Bejelentkezés</h5>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Felhasználónév / Email cím</label>
                    <input type="text"
                           name="email"
                           id="email"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           placeholder="pelda@gmail.com"
                           value={emailUsername}
                           onChange={(e) =>{setEmailUsername(e.target.value)}}
                           required />
                </div>
                <div className="relative flex-row">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jelszó</label>
                    <input type={showPassword ? 'text' : 'password'}
                           name="password" id="password"
                           placeholder="••••••••"
                           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                           value={password}
                           onChange={(e) =>{setPassword(e.target.value)}}
                           required />
                    <span onClick={togglePasswordVisibility} className="absolute inset-y-12 right-2 flex items-center cursor-pointer text-gray-600 dark:text-gray-400">
                        {showPassword ? <FaEyeSlash size={30} /> : <FaEye size={30} />}
                    </span>
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Bejelentkezés</button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Nincs fiókja? <a onClick={() => navigate("/register")} className="text-blue-700 hover:underline dark:text-blue-500">Fiók létrehozása</a>
                </div>
            </form>
        </div>
            <ToastContainer/>
        </div>
    </>
}