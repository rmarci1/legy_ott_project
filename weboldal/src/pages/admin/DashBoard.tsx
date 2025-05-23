import { FaCalendarDays, FaCircle, FaUserGroup } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext"
import { MdBusinessCenter, MdOpenInNew, MdOutlineAddBusiness } from "react-icons/md";
import AdminPanelCard from "../../components/cards/AdminPanelCard";
import { IoStatsChartSharp } from "react-icons/io5";
import Graph from "@/components/Graph";
import { useEffect, useState } from "react";
import { getDashBoardDatas } from "@/lib/api";
import { DashBoardData } from "@/Types/DashBoardData";
import AdminStaticticsCard from "@/components/cards/AdminStaticticsCard";

/**
 * Az adminisztrátori irányítópultot megjelenítő komponens.
 * Az irányítópult különböző statisztikákat és adatokat mutat a felhasználók és munkák számáról,
 * valamint a felhasználó aktivitásáról.
 *
 * Az alábbi elemeket tartalmazza:
 * - Összesítő kártyák a felhasználók és munkák számával.
 * - Eltöltött idő a felhasználó számára.
 * - Statisztikák a hónapok közötti különbségekről, például profilok és munkák számáról.
 * - Napi grafikonok a heti adatokat megjelenítve.
 *
 * Az irányítópult adatait a `getDashBoardDatas` API hívás segítségével szerzi be,
 * és a megjelenítéshez a `Graph` és `AdminPanelCard` komponensek kerülnek felhasználásra.
 *
 * @component
 */
export default function DashBoard(){
    const {user,isLoading} = useAuth();
    const [data,setData] = useState<DashBoardData | null>(null);
    const [isDashBoardLoading,setIsDashBoardLoading] = useState(false);

    /** A komponens betöltésekor betölti az adatokat
     * és ha hiba történik akkor visszaküldi
     */
    useEffect(() => {
        setIsDashBoardLoading(true);
        getDashBoardDatas()
        .then((res) => {
            if(res){
                setData(res);
            }
        })
        .catch((error) => {
            throw new Error(error.message);
        })
        .finally(() => {
            setIsDashBoardLoading(false);
        })
    },[])

    /**
     * A felhasználó regisztrációjának időpontjától eltelt napok számának meghatározása.
     *
     * @returns {number} A regisztráció óta eltelt napok száma.
     */
    const getDayDifference = () =>{
        const d1 = new Date();
        const d2 = new Date(user?.created!);
        const diffInMs = Math.abs(d2.getTime() - d1.getTime());
        return Math.ceil(diffInMs / (1000*60*60*24));
    }
    return (
        <div className="bg-[#0d0b42] h-screen w-screen justify-items-center place-content-center overflow-auto">
            {!isLoading && !isDashBoardLoading?
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
                            count={data?.userCount!}
                            pastWeekCount={data?.pastWeekUserCount ?? 0}
                            logo={FaUserGroup}
                        />
                        <AdminPanelCard
                            title="Munkák száma"
                            count={data?.jobCount!}
                            pastWeekCount={data?.jobCountPastWeek ?? 0}
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
                                        <p className="text-white text-2xl font-bold">{getDayDifference()}</p>
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
                                <p className="text-4xl font-bold text-white">{data?.thisWeekUserCount ?? 0}</p>
                                <div className="flex flex-row place-items-center">
                                    <FaCircle size={8} color="#2980b9" className=""/>
                                    <p className="text-white text-sm mx-2">Előző héten</p>
                                    <FaCircle size={8} color="#5daed2" className="mr-2"/>
                                    <p className="text-white text-sm mr-10">Ezen a héten</p>
                                    <p className="text-white text-sm font-bold">{data?.thisWeekUserCount! + data?.pastWeekUserCount!}</p>
                                </div>
                            </div>
                        </div>
                        {!isLoading && <Graph data={data?.weekDailyCounts}/>}
                        <div className="mt-5 w-[90%] place-self-end h-full">
                            <p className="text-white font-semibold text-2xl">Statisztikák</p>
                            <p className="text-gray-600">Ebben a hónapban</p>
                            <div className="flex flex-row">
                                <AdminStaticticsCard
                                    count={data?.thisMonthUserCount ?? 0}
                                    difference={data?.thisMonthUserCount! / (data?.pastMonthUserCount! > 0 ? data?.pastMonthUserCount! : 1)}
                                    title="Összes profil"
                                    iconColor="#4dbe97"
                                    mainIcon={IoStatsChartSharp}
                                    background="linear-gradient(to bottom, #1e1b4b 30%, #851fc4 )"                             
                                />
                                <AdminStaticticsCard
                                    count={data?.thisMonthJobCount ?? 0}
                                    difference={data?.thisMonthJobCount! / (data?.pastMonthJobCount! > 0 ? data?.pastMonthJobCount! : 1)}
                                    title="Összes Munka"
                                    iconColor="#2563eb"
                                    containerStyles="ml-10"
                                    mainIcon={MdOutlineAddBusiness}       
                                    background="linear-gradient(to bottom, #1e1b4b 30%, #ffde8a )"                      
                                />
                               <AdminStaticticsCard
                                    count={data?.thisMonthClosedJobs ?? 0}
                                    difference={data?.thisMonthClosedJobs! / (data?.pastMonthClosedJobs! > 0 ? data?.pastMonthClosedJobs! : 1)}
                                    title="Lezárt Munkák"
                                    iconColor="#ffde8a"
                                    containerStyles="ml-10"
                                    mainIcon={MdOpenInNew}       
                                    background="linear-gradient(to bottom, #1e1b4b 30%, #838576 )"                      
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div> :
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            }
        </div>
    )
}