import { Job } from "../../Types/Job.ts";
import {useState} from "react";
import { PiHeartLight, PiHeartFill } from "react-icons/pi";
import {useAuth} from "../../context/AuthContext.tsx";
import JobModal from "../modals/JobModal.tsx";
import ProfileModal from "../modals/ProfileModal.tsx";
import {Advertiser} from "@/Types/Advertiser.ts";
import UpdateJobModal from "@/components/modals/UpdateJobModal.tsx";
import ConvertText from "../ConvertText.tsx";

interface jobProps{
    Job: Job,
    canSaveForLater: boolean,
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

/**
 * `JobCard` komponens, amely egy adott munkát jelenít meg.
 * A felhasználó interakciókat hajthat végre, például elmentheti a munkát későbbre, megtekintheti a munkával kapcsolatos részletes információkat,
 * vagy a munkát végző hirdető profilját.
 *
 * @component
 *
 * @param {Object} props - A komponens paraméterei
 * @param {Job} props.Job - A megjelenítendő munkát tartalmazó objektum
 * @param {boolean} props.canSaveForLater - Meghatározza, hogy a felhasználó elmentheti-e a munkát későbbre
 */
export default function JobCard({Job, canSaveForLater, setJobs}: jobProps){
    const [jobModal, setJobModal] = useState(false);
    const [profileModal, setProfileModal] = useState(false);
    const [updateJobModal, setUpdateJobModal] = useState(false);
    const [advertiser, setAdvertiser] = useState<Advertiser>({} as Advertiser);
    const {user, setSave, attendJob} = useAuth();
    const date = new Date(Job.date);

    /**
     * A szöveg rövidítése, hogy csak az első 3 sor vagy 150 karakter jelenjen meg.
     * Ha a szöveg hosszabb, "..." jelet adunk hozzá.
     *
     * @param {string} text - A megjelenítendő szöveg
     * @returns {string} - A rövidített szöveg
     */
    const trimmedText = (text: string) => {
        const lines = text.split('\n');
        const limitedText = lines.slice(0, 3).join('\n');

        return limitedText.length > 150 ? limitedText.slice(0, 150) + "..." : text;
    };

    return<>
        <div className="rounded-lg shadow-secondary-1 bg-surface-dark mt-2 md:m-2 cursor-default">
            <div className="p-6 text-surface flex flex-col border-2 w-dvw max-w-sm md:max-w-[500px]">
                <div className="flex flex-row flex-grow w-full items-center">
                    <h5 className="mb-2 text-xl font-medium leading-tight flex-grow whitespace-pre-wrap break-words">
                        {Job.name}
                    </h5>
                    <img
                        className="rounded mt-3 mb-2 h-24 object-cover aspect-square place-self-center"
                        src={Job.img}
                        alt="Job picture"
                    />
                </div>
                <span className="mb-4  text-base flex-grow font-light whitespace-pre-wrap break-words">
                    <ConvertText text={trimmedText(Job.description)} textColor="text-black"/>
                </span>
                <div className="flex flex-row justify-between ">
                    {user && canSaveForLater && (
                        <span className="flex-none cursor-pointer">
                            {Job.profiles && Job.profiles[0] && Job.profiles[0].saveForLater ?
                                <PiHeartFill size={40} color="red"
                                             onClick={() => {
                                                 setSave(Job, false)
                                                 setJobs(prev =>
                                                     prev.map(j =>
                                                         j.id === Job.id
                                                             ? {
                                                                 ...j,
                                                                 profiles: [
                                                                     {
                                                                         ...j.profiles[0],
                                                                         saveForLater: false
                                                                     }
                                                                 ]
                                                             }
                                                             : j
                                                     )
                                                 );
                                             }}/> :
                                <PiHeartLight size={40} onClick={() => {
                                    setSave(Job, true)
                                    setJobs(prev =>
                                        prev.map(j =>
                                            j.id === Job.id
                                                ? {
                                                    ...j,
                                                    profiles: [
                                                        {
                                                            ...j.profiles[0],
                                                            saveForLater: true
                                                        }
                                                    ]
                                                }
                                                : j
                                        )
                                    );
                                }}/>}
                        </span>
                    )}
                    <button
                        type="button"
                        className="inline-block rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal shadow-primary-3 transition duration-150 ease-in-out shadow-black/30 hover:shadow-dark-strong focus:shadow-dark-strong active:shadow-dark-strong"
                        onClick={() => setJobModal(true)}>
                        További információ
                    </button>
                </div>

                <div className=" place-self-end text-right flex flex-row">
                    <p className="">
                        {
                            date.toLocaleDateString()
                        }
                    </p>
                </div>

            </div>

            {jobModal && (
                user ? (
                        <JobModal job={Job} user={user} setAds={setJobs}  setUpdateJobModal={setUpdateJobModal} setAdvertiser={setAdvertiser} setModal={setJobModal} attendJob={attendJob} setProfileModal={setProfileModal}/>
                    ):
                    (
                        <JobModal job={Job} setModal={setJobModal} setAds={setJobs} setUpdateJobModal={setUpdateJobModal} setAdvertiser={setAdvertiser} attendJob={attendJob} setProfileModal={setProfileModal}/>
                    )
            )}

            {
                profileModal && (
                    user? (
                        <ProfileModal advertiser={advertiser} user={user} setModal={setProfileModal} setJobModal={setJobModal}/>
                    ):
                    (
                        <ProfileModal advertiser={advertiser} setModal={setProfileModal}  setJobModal={setJobModal}/>
                    )
                )
            }

            {
                updateJobModal && (
                    <UpdateJobModal setModal={setUpdateJobModal} setJobModal={setJobModal} job={Job}/>
                )
            }

        </div>
    </>
}