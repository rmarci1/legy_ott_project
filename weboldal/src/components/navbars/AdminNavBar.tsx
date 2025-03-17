import { NavLink } from "react-router-dom";
import images from "../../constants/images";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { TbMessageSearch } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
export default function AdminNavbar(){
    return (
        <div className="h-screen w-64 text-white p-4 flex flex-col bg-indigo-950" style={{
            background: 'linear-gradient(to bottom, #1e1b4b 30%, #851fc4 )',  // Színátmenet felül és alul
        }}>
          <nav className="space-y-2">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-lg ${
                  isActive ? "bg-gray-500" : "hover:bg-gray-700"
                }`
              }
            >
              <img src={images.dashboard} className="h-3 w-3"/>
              Főoldal
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-lg ${
                  isActive ? "bg-gray-500" : "hover:bg-gray-700"
                }`
              }
            >   
              <FiUsers />
              Felhasználók
            </NavLink>
            <NavLink
              to="/admin/issues"
              className={({ isActive }) =>
                `flex items-center gap-2 p-3 rounded-lg ${
                  isActive ? "bg-gray-500" : "hover:bg-gray-700"
                }`
              }
            >
              <AiOutlineIssuesClose />
              Hibák
            </NavLink>
            <NavLink
              to="/admin/messages"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 relative"
            >
              <TbMessageSearch />
              Üzenetek
              <span className="absolute right-4 bg-gray-500 text-xs text-white px-2 py-0.5 rounded-full">
                3
              </span>
            </NavLink>
            <NavLink
              to="/docs"
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700"
            >
              Docs
            </NavLink>
          </nav>
        </div>
    )
}