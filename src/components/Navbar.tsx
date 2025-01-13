import { FaArchive, FaHome, FaPlus, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar(){


    return <>
        <div className="bg-pink-300 w-20 h-screen flex items-center p-4 hover:w-64 transition-all duration-300 ease-in-out group ">
            <nav className="list-none space-y-10 place-content-center place-items-center">
                <div className="flex ">
                    <Link to="/home">
                        <FaHome size={50} color="white"/>
                    </Link>
                    <p className="text-white p-3 text-2xl hidden group-hover:block">Hirdetések</p>
                </div>
                <div className="flex">
                    <FaPlus size={50} color="white" /><br/> <br/>
                    <span className="text-white p-3 text-2xl hidden group-hover:block">Létrehozás</span>
                </div>
                <div className="flex">
                    <FaArchive size={50} color="white" />
                    <p className="text-white p-3 text-2xl hidden group-hover:block">Előzmények</p>
                </div>
                <div className="flex">
                    <FaUser size={50} color="white"/>
                    <p className="text-white p-3 text-2xl hidden group-hover:block">Profil</p> 
                </div>
            </nav>
        </div>
    </>
}