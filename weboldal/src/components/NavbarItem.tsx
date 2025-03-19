import {Link} from "react-router-dom";
import {IconType} from "react-icons";

interface NavItemProps{
    to: string,
    icon: IconType,
    label: string
}

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