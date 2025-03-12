import { FaCalendarDays, FaCircle, FaUserGroup } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext"
import { MdBusinessCenter, MdOpenInNew, MdOutlineAddBusiness } from "react-icons/md";
import AdminPanelCard from "../../components/cards/AdminPanelCard";
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { IoStatsChartSharp } from "react-icons/io5";
import { GrLineChart } from "react-icons/gr";
import { PiChartLineDownLight } from "react-icons/pi";
import { useNavigate } from "react-router";

export default function DashBoard(){
    const {user,isLoading} = useAuth();
    const data = [
        { thisMonth: 4000, lastMonth: 2400 },
        { thisMonth: 3000, lastMonth: 1398 },
        { thisMonth: 5000, lastMonth: 2800 },
        { thisMonth: 4200, lastMonth: 3200 },
        { thisMonth: 5300, lastMonth: 4000 },
        { thisMonth: 4900, lastMonth: 3500 },
    ];
    const navigate = useNavigate();
    if((!isLoading && !user) || (isLoading && !user?.isAdmin)){
        navigate('/');
    }
    return (
        <div className="bg-[#0d0b42] h-screen w-screen justify-items-center place-content-center">
            <div className="w-[90%] h-[90%]">
                <div className="flex flex-row w-full justify-between">
                    <p className="text-3xl text-white">Üdvözöllek, <span className="font-bold">{user?.name}</span></p>
                    <img src={user?.profileImg} className="h-16 w-16 rounded-full self-center" />
                </div>
                <div className="h-full flex flex-row mt-2">
                    <div className="h-full w-[30%]">
                        <p className="text-2xl text-white font-semibold">Összesítés</p>
                        <p className="text-gray-600">Kezdet óta</p>
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
                        <div className="mt-12 h-20 w-full rounded-xl place-content-center justify-items-center shadow-lg bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                            <div className="w-[90%] h-[60%] flex flex-row">
                                <div className="h-full w-12 bg-white bg-opacity-20 rounded-2xl place-content-center justify-items-center">
                                    <FaCalendarDays size={20} color="white"/>
                                </div>
                                <div className="ml-6">
                                    <p className="text-white text-sm">Eltöltött Időd</p>
                                    <div className="flex flex-row">
                                        <p className="text-white text-2xl font-bold">15</p>
                                        <p className="text-white text-lg ml-2 font-light place-self-end">nap</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="w-[90%] place-self-end">
                            <p className="text-2xl text-white font-light">Új felhasználók</p>
                            <p className="text-gray-600">Ezen a Héten</p>
                            <div className="justify-between flex flex-row mt-2">
                                <p className="text-4xl font-bold text-white">10</p>
                                <div className="flex flex-row place-items-center">
                                    <FaCircle size={8} color="purple" className=""/>
                                    <p className="text-white text-sm mx-2">Előző héten</p>
                                    <FaCircle size={8} color="orange" className="mr-2"/>
                                    <p className="text-white text-sm mr-10">Ezen a héten</p>
                                    <p className="text-white text-sm font-bold">800000</p>
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="95%" height={200} className="mt-5 place-self-end">
                            <AreaChart data={data}>
                                <YAxis stroke="#fff" tick={false}/>
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="thisMonth"
                                    stroke="orange"
                                    fill="orange"
                                    fillOpacity={0.4}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="lastMonth"
                                    stroke="purple"
                                    fill="purple"
                                    fillOpacity={0.7}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="mt-5 w-[90%] place-self-end h-full">
                            <p className="text-white font-semibold text-2xl">Statisztikák</p>
                            <p className="text-gray-600">Ebben a hónapban</p>
                            <div className="flex flex-row">
                                <div className="w-[25%]">
                                    <div className="mt-4">
                                        <div className="w-[200px] h-[168px] rounded-xl place-content-center justify-items-center" style={{
                                            background: 'linear-gradient(to bottom, #1e1b4b 30%, #851fc4 )'
                                        }}> 
                                            <div className="w-[75%] h-[75%]">
                                                <IoStatsChartSharp size={16} color="#4dbe97"/>
                                                <p className="text-white font-bold mt-6 text-xl">1256</p>
                                                <p className="text-[#B5BCCD]">Összes profil</p>
                                                <div className="flex flex-row mt-2 place-items-center">
                                                    <GrLineChart size={14} color="#4dbe97"/>
                                                    <p className="text-[#4dbe97] mx-1">15,25%</p>
                                                    <p className="text-[#b5bccd] text-sm">Előző hónap</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full ml-10">
                                    <div className="w-full h-full mt-4">
                                        <div className="w-[200px] h-[168px] rounded-xl place-content-center justify-items-center" style={{
                                            background: 'linear-gradient(to bottom, #1e1b4b 30%, #ffde8a )'
                                        }}> 
                                            <div className="w-[75%] h-[75%]">
                                                <MdOutlineAddBusiness size={20} color="#2563eb" />
                                                <p className="text-white font-bold mt-6 text-xl">756</p>
                                                <p className="text-[#B5BCCD]">Összes Munka</p>
                                                <div className="flex flex-row mt-2 place-items-center">
                                                    <PiChartLineDownLight size={16  } color="#dc2626" />
                                                    <p className="text-red-600 ">2,38%</p>
                                                    <p className="text-[#b5bccd] text-sm ml-1">Előző hónap</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full ml-10">
                                    <div className="w-full h-full mt-4">
                                        <div className="w-[200px] h-[168px] rounded-xl place-content-center justify-items-center" style={{
                                            background: 'linear-gradient(to bottom, #1e1b4b 30%, #838576 )'
                                        }}> 
                                            <div className="w-[75%] h-[75%]">
                                                <MdOpenInNew size={20} color="#ffde8a"/>
                                                <p className="text-white font-bold mt-6 text-xl">213</p>
                                                <p className="text-[#B5BCCD]">Lezárt Munkák</p>
                                                <div className="flex flex-row mt-2 place-items-center">
                                                    <PiChartLineDownLight size={16  } color="#dc2626" />
                                                    <p className="text-red-600 ">40,28%</p>
                                                    <p className="text-[#b5bccd] text-sm ml-1">Előző hónap</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}