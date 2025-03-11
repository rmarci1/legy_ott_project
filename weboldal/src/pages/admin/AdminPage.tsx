import { NavLink } from "react-router-dom";
export default function AdminPage(){
    return (
    <div className="h-screen w-64 bg-indigo-950 text-white p-4 flex flex-col">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-3 rounded-lg ${
              isActive ? "bg-gray-800" : "hover:bg-gray-700"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/orders"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700"
        >
          Orders
        </NavLink>
        <NavLink
          to="/partner"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700"
        >
          My Partner
        </NavLink>
        <NavLink
          to="/messages"
          className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-700 relative"
        >
          Messages
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