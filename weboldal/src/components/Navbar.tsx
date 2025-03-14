import { AiOutlinePlus } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoArchiveOutline, IoHomeOutline } from "react-icons/io5";
import NavItem from "./NavbarItem.tsx";

export default function Navbar(){
    const navItems = [
        { to: "/", icon: IoHomeOutline, label: "Hirdetések" },
        { to: "/createAd", icon: AiOutlinePlus, label: "Létrehozás" },
        { to: "/interacted", icon: IoArchiveOutline, label: "Előzmények" },
        { to: "/profile", icon: FaRegCircleUser, label: "Profil" },
    ];

    return <>
        <div className="bg-indigo-950 sticky bottom-0 left-0 right-0 flex
                        flex-row justify-between sm:flex-col sm:w-20 sm:h-screen items-center sm:justify-center
                        p-4 sm:hover:w-64 transform transition-all duration-300 ease-in-out group">
                <nav className="flex flex-row sm:flex-col justify-around sm:space-y-10 w-full">
                        {navItems.map(({to, icon, label}) => (
                            <NavItem key={to} to={to} icon={icon} label={label}/>
                        ))}
                </nav>
        </div>
    </>
}