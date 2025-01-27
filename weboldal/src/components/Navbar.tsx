import { AiOutlinePlus } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoArchiveOutline, IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Navbar(){


    return <>
        <div className="bg-indigo-950 w-20 h-screen flex items-center p-4 hover:w-64 transition-all duration-300 ease-in-out group">
            <nav className="list-none space-y-10 place-content-center place-items-center">
                <div>
                    <Link to="/home" className="flex  place-items-center">
                        <IoHomeOutline size={40} color="white"/>
                        <p className="text-white p-3 text-2xl hidden group-hover:block">Hirdetések</p>
                    </Link>
                </div>
                <div className="flex  place-items-center">
                    <AiOutlinePlus size={40} color="white" />
                    <p className="text-white p-3 text-2xl hidden group-hover:block">Létrehozás</p>
                </div>
                <div className="flex  place-items-center">
                    <IoArchiveOutline size={40} color="white" />
                    <p className="text-white p-3 text-2xl hidden group-hover:block">Előzmények</p>
                </div>
                <div className="flex  place-items-center">
                    <Link to="/login" className="flex place-items-center">
                        <FaRegCircleUser size={40} color="white"/>
                        <p className="text-white p-3 text-2xl hidden group-hover:block">Profil</p> 

                    </Link>
                </div>
            </nav>
        </div>
    </>
}