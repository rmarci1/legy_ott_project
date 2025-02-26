import {GoTriangleDown, GoTriangleRight} from "react-icons/go";
import {Job} from "../../../Types/Job.ts";
import JobCard from "../../JobCard/JobCard.tsx";

interface ListingComponentProps {
    show: boolean,
    title: string,
    setShow: (value: boolean) => void,
    jobs: Job[]
}

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
                    <div className="flex flex-row w-dvw justify-center h-fit overflow-x-scroll overscroll-contain">
                        {
                            (jobs.map((item: Job) => (
                                <JobCard key={item.id} attending={true} Job={item}/>
                            )))
                        }
                    </div>
                )
            }

        </div>
    </>
}