import { FaUserGroup } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext"
import { MdBusinessCenter } from "react-icons/md";
import AdminPanelCard from "../../components/cards/AdminPanelCard";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashBoard(){
    const {user} = useAuth();
    const data = [
        { name: "Jan", thisMonth: 4000, lastMonth: 2400 },
        { name: "Feb", thisMonth: 3000, lastMonth: 1398 },
        { name: "Mar", thisMonth: 5000, lastMonth: 2800 },
        { name: "Apr", thisMonth: 4200, lastMonth: 3200 },
        { name: "May", thisMonth: 5300, lastMonth: 4000 },
        { name: "Jun", thisMonth: 4900, lastMonth: 3500 },
      ];
    return (
        <div className="bg-indigo-950 h-screen w-screen justify-items-center place-content-center">
            <div className="w-[90%] h-[90%]">
                <div className="flex flex-row w-full justify-between">
                    <p className="text-3xl text-white">Üdvözöllek, <span className="font-bold">{user?.name}</span></p>
                    <img src={user?.profileImg} className="h-16 w-16 rounded-full self-center" />
                </div>
                <div className="h-full flex flex-row">
                    <div className="h-full w-[30%]">
                        <AdminPanelCard
                            title="Felhasználók száma"
                            count={1000}
                            logo={FaUserGroup}
                        />
                        <AdminPanelCard
                            title="Munkák száma"
                            count={1500}
                            logo={MdBusinessCenter}
                        />
                    </div>
                    <ResponsiveContainer width="100%" height={250} className="mt-5">
                        <AreaChart data={data}>
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip />
                            <Area
                            type="monotone"
                            dataKey="thisMonth"
                            stroke="gold"
                            fill="gold"
                            fillOpacity={0.5}
                            />
                            <Area
                            type="monotone"
                            dataKey="lastMonth"
                            stroke="purple"
                            fill="purple"
                            fillOpacity={0.3}
                            />
                        </AreaChart>
                        </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}