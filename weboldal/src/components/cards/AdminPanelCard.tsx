import { IconType } from "react-icons";

interface Props{
    logo : IconType,
    title : string,
    count : number,
    pastWeekCount: number,
}

/**
 * `AdminPanelCard` komponens, amely egy admin panelen lévő statisztikai adatokat jelenít meg.
 * A komponens tartalmaz egy ikont, egy címet, az aktuális számot és az előző héthez képest történt változást.
 *
 * @component
 *
 * @param {Object} props - A komponens paraméterei
 * @param {IconType} props.logo - Az ikon, amely szimbolizálja a statisztikát
 * @param {string} props.title - A statisztikai adat neve (pl. új regisztrációk)
 * @param {number} props.count - Az aktuális statisztikai szám
 * @param {number} props.pastWeekCount - A múlt héthez képest történt változás (pozitív vagy negatív szám)
 */
export default function AdminPanelCard({logo: Logo, title, count, pastWeekCount}: Props){
    const isPositive = pastWeekCount > 0;
    return (
    <div className="border-2 border-gray-500 rounded-xl w-full justify-items-center place-content-center mt-5">
        <div className="w-[90%] my-4">
            <div className="w-12 h-12 bg-indigo-900 rounded-sm justify-items-center place-content-center">
                <Logo color="white" size={24}/>
            </div>
            <p className="mt-6 text-white text-lg font-light">{title}</p>
            <p className="text-white font-bold text-xl">{count} {pastWeekCount != 0 && <span className={isPositive ? "text-[#4dbe97]": "text-[#ef4444]"}>{isPositive && "+"}{pastWeekCount}</span>}</p>
        </div>
    </div>
    )
}