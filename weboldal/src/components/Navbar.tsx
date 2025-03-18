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
                        flex-row justify-between md:flex-col md:w-20 md:h-screen items-center md:justify-center
                        p-4 md:hover:w-64 transform transition-all duration-300 ease-in-out group">
                <nav className="flex flex-row md:flex-col justify-around md:space-y-10 w-full">
                        {navItems.map(({to, icon, label}) => (
                            <NavItem key={to} to={to} icon={icon} label={label}/>
                        ))}
                </nav>
        </div>
    </>
}