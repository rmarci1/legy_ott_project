import { AiOutlinePlus } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoArchiveOutline, IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function Navbar(){

    return <>
        <div className="sticky bg-indigo-950 w-20 h-screen flex flex-1 items-center p-4 hover:w-64 transform transition-all duration-300 ease-in-out group">
            <nav className="list-none sticky space-y-10 place-content-center place-items-center ">
                <div>
                    <Link to="/home" className="flex  place-items-center">
                        <IoHomeOutline size={40} color="white"/>
                        <p className="text-white text-2xl overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 px-0 group-hover:max-w-[10rem] group-hover:px-3">
                            Hirdetések
                        </p>

                    </Link>
                </div>
                <div className="flex  place-items-center">
                    <AiOutlinePlus size={40} color="white"/>
                    <p className="text-white text-2xl overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 px-0 group-hover:max-w-[10rem] group-hover:px-3">
                        Létrehozás
                    </p>

                </div>
                <div className="flex  place-items-center">
                    <IoArchiveOutline size={40} color="white"/>
                    <p className="text-white text-2xl overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 px-0 group-hover:max-w-[10rem] group-hover:px-3">
                        Előzmények
                    </p>

                </div>
                <div className="flex  place-items-center">
                    <Link to="/profile" className="flex place-items-center">
                        <FaRegCircleUser size={40} color="white"/>
                        <p className="text-white text-2xl overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 px-0 group-hover:max-w-[10rem] group-hover:px-3">
                            Profil
                        </p>

                    </Link>
                </div>
            </nav>
        </div>
    </>
}