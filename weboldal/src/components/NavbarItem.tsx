import {Link} from "react-router-dom";
import {IconType} from "react-icons";

interface NavItemProps{
    to: string,
    icon: IconType,
    label: string
}
/**
 * A navigációs menü eleme, amely tartalmaz egy linket és egy ikont.
 * A felhasználók a linkre kattintva navigálhatnak az alkalmazás különböző részeire.
 *
 * @component
 * @param {string} to - A link cél URL-je, ahová a felhasználót irányítja.
 * @param {IconType} icon - Az ikon típus, amelyet a link mellé jelenít meg.
 * @param {string} label - A linkhez tartozó szöveges címke, amely a felhasználónak a navigációs elem funkcióját írja le.
 */
export default function NavItem({ to, icon : Icon, label }: NavItemProps) {
    return (
        <Link to={to} className="flex flex-col md:flex-row items-center">
            <Icon size={40} color={"white"}/>
            <p className="hidden md:block text-white text-2xl overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out max-w-0 px-0 group-hover:max-w-[10rem] group-hover:px-3">
                {label}
            </p>
        </Link>
    );
}