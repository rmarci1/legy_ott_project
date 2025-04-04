import { NavLink } from "react-router-dom";
import images from "../../constants/images";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { TbMessageSearch } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GoDatabase } from "react-icons/go";
import { MdOutlineAddBusiness } from "react-icons/md";

/**
 * Adminisztrátori navigációs sáv komponens, amely az adminisztrátor számára elérhető menüpontokat tartalmazza.
 * A navigációs sáv a felhasználók és lehetőségek kezelése, hibák és üzenetek nyomon követése céljából van kialakítva.
 * A felhasználói adatok kezelése lenyíló menüben található.
 *
 * @returns {JSX.Element} Az adminisztrátori navigációs sávot tartalmazó komponens.
 */
export default function AdminNavbar(){
    const [isUsersOpen,setIsUsersOpen] = useState(false);
    return (
        <div className="h-screen w-64 text-white p-4 flex flex-col bg-indigo-950" style={{
            background: 'linear-gradient(to bottom, #1e1b4b 30%, #851fc4 )'
        }}>
          <nav className="space-y-2">
              {/* Főoldal navigáció */}
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
             {/* Felhasználók lenyíló menü */}
        <button
          onClick={() => setIsUsersOpen(!isUsersOpen)}
          className="flex items-center justify-between gap-2 p-3 rounded-lg w-full hover:bg-gray-700"
        >
          <div className="flex flex-row items-center gap-2">
            <GoDatabase />
            Adatok
          </div>
          {isUsersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

          {isUsersOpen && (
            <div className="pl-6 space-y-1">
              <NavLink
                to="/admin/users"
                className="flex gap-2 p-2 rounded-lg hover:bg-gray-700 items-center flex-row"
              > 
                <FiUsers />
                Felhasználók
              </NavLink>
              <NavLink
                to="/admin/jobs"
                className="flex gap-2 p-2 rounded-lg hover:bg-gray-700 items-center flex-row"
              >
                <MdOutlineAddBusiness />
                Lehetőségek
              </NavLink>
            </div>
          )}
              {/* Hibák menüpont */}
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
              {/* Üzenetek menüpont */}
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
          </nav>
        </div>
    )
}