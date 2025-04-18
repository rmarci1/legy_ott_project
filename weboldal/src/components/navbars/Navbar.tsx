import { AiOutlinePlus } from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoArchiveOutline, IoHomeOutline } from "react-icons/io5";
import NavItem from "../NavbarItem";
import { LuMessageCircle } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect } from "react";

/**
 * A navigációs sáv komponens, amely a felhasználó számára elérhető navigációs lehetőségeket tartalmazza.
 * A komponens dinamikusan frissíti a navigációs elemeket a felhasználó státusza alapján.
 * Ha a felhasználó be van jelentkezve, megjelenik egy üzenet ikon is.
 *
 * @returns {JSX.Element} A navigációs sávot tartalmazó komponens.
 */
export default function Navbar(){
    const {user, checkUser} = useAuth();

    const memoizedCheckUser = useCallback(checkUser, []);

    /** A komponens betöltésekor a felhasználó bejelentkezési státuszát ellenőrzi */
    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
        };
        fetchUser();
    }, [memoizedCheckUser]);

    // Navigációs elemek definíciója
    const navItems = [
        { to: "/", icon: IoHomeOutline, label: "Hirdetések" },
        { to: "/createAd", icon: AiOutlinePlus, label: "Létrehozás" },
        { to: "/interacted", icon: IoArchiveOutline, label: "Előzmények" },
        { to: "/profile", icon: FaRegCircleUser, label: "Profil" },
    ];
    // Ha a felhasználó be van jelentkezve, hozzáadjuk az üzenet gombot
    if(user){
        navItems.push({to: "/chat", icon: LuMessageCircle, label: "Message" })
    }
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