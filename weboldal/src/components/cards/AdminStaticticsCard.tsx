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