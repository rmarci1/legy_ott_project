import { IconType } from "react-icons"
import { GrLineChart } from "react-icons/gr"
import { PiChartLineDownLight } from "react-icons/pi"

interface Props{
    count : number,
    difference: number,
    title : string,
    background : string,
    containerStyles? : string,
    iconColor: string,
    mainIcon: IconType
}

/**
 * `AdminStaticticsCard` komponens, amely különböző adminisztrátori statisztikák megjelenítésére szolgál.
 * Az információk, mint a statisztikai számok, a különbség, az előző hónaphoz képesti változás és egy szimbólum mind megjelenítésre kerülnek.
 *
 * @component
 *
 * @param {Object} props - A komponens paraméterei
 * @param {number} props.count - Az aktuális szám, amit meg kell jeleníteni (pl. felhasználók száma)
 * @param {number} props.difference - Az aktuális szám és az előző hónap közötti különbség, százalékban kifejezve
 * @param {string} props.title - A kártya címe, amely leírja, hogy mit jelent a szám
 * @param {string} props.background - A kártya háttérszíne
 * @param {string} [props.containerStyles] - Egy opcionális osztály a kártya testreszabásához
 * @param {string} props.iconColor - Az ikon színe
 * @param {IconType} props.mainIcon - Az ikon típusa, amely az adott statisztikát szimbolizálja
 */
export default function AdminStaticticsCard({count,containerStyles,iconColor,difference,background,title,mainIcon: MainIcon} : Props){
    const isPositive = difference > 1;
    return(
     <div className={`w-[25%] ${containerStyles}`}>
        <div className="mt-4">
            <div className="w-[200px] h-[168px] rounded-xl place-content-center justify-items-center" style={{
                background: background
            }}> 
                <div className="w-[80%] h-[75%]">
                    <MainIcon size={16} color={iconColor}/>
                    <p className="text-white font-bold mt-6 text-xl">{count}</p>
                    <p className="text-[#B5BCCD]">{title}</p>
                    <div className="flex flex-row mt-2 place-items-center">
                        {isPositive? <GrLineChart size={14} color="#4dbe97"/>
                        :
                            <PiChartLineDownLight size={16} color="#dc2626" />
                        }
                        <p className={`${isPositive? "text-[#4dbe97]" : "text-red-500"} mx-1`}>{(isPositive ? difference*100 :  ((1-difference)*100)).toFixed(2)}%</p>
                        <p className="text-[#b5bccd] text-sm">Előző hónap</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}