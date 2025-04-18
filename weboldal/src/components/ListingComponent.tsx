import {GoTriangleDown, GoTriangleRight} from "react-icons/go";
import {Job} from "../Types/Job.ts";
import JobCard from "./cards/JobCard.tsx";

interface ListingComponentProps {
    show: boolean,
    title: string,
    setShow: (value: boolean) => void,
    jobs: Job[]
}
/**
 * A `ListingComponent` egy dinamikus komponens, amely egy cím és egy munkalista megjelenítésére szolgál.
 * Az "összecsukható" funkcióval lehetőséget ad arra, hogy a felhasználó elrejtse vagy megjelenítse a munkákat.
 * Az ikonok (GoTriangleDown és GoTriangleRight) segítségével irányítható az összecsukás vagy kibontás.
 *
 * @param {string} title - A lista címe (pl. "Elmentett munkák").
 * @param {boolean} show - Ha igaz, a munkák láthatóak, ha hamis, akkor rejtve vannak.
 * @param {function} setShow - A `show` érték frissítésére szolgáló függvény.
 * @param {Job[]} jobs - A munkák listája, amelyeket meg szeretnénk jeleníteni.
 *
 * @returns {JSX.Element} - A dinamikusan összecsukható és bővíthető lista komponens.
 */
export default function ListingComponent({title, show, setShow, jobs}: ListingComponentProps){
    return <>
        <div className="flex flex-col">
            <p className="flex flex-row items-center text-2xl">
                {
                    show ? (
                        <GoTriangleDown onClick={() => setShow(false)} className="cursor-pointer"/>
                    ) : (
                        <GoTriangleRight onClick={() => setShow(true)} className="cursor-pointer"/>
                    )
                }
                <b>{title}</b>
            </p>
            {
                show && (
                    <>
                        {jobs.length > 0 ?
                            (
                                <div
                                    className="flex flex-row scroll-smooth snap-x overflow-x-auto overflow-y-hidden h-fit overflow-auto mr-2
                                                [&::-webkit-scrollbar]:h-1
                                                [&::-webkit-scrollbar-track]:rounded-full
                                                [&::-webkit-scrollbar-track]:bg-gray-100
                                                [&::-webkit-scrollbar-thumb]:rounded-full
                                                [&::-webkit-scrollbar-thumb]:bg-gray-300 overscroll-contain">
                                    {jobs.map((item: Job) => (
                                        <JobCard key={item.id} canSaveForLater={title === "Elmentett munkák"} Job={item}/>
                                    ))}
                                </div>
                            ) :
                            (
                                <p className="text-xl italic text-gray-600 m-5">Még nincsenek <span className="lowercase">{title}</span>.</p>
                            )
                        }
                    </>
                )
            }
        </div>
    </>
}