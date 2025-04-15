import { Job } from "../../Types/Job.ts";
import { User } from "../../Types/User.ts";
import {useEffect} from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { IoClose } from "react-icons/io5";
import {toast, ToastContainer} from "react-toastify";
import {Advertiser} from "@/Types/Advertiser.ts";
import {getAverageRating, getProfile} from "@/lib/api.ts";
import ConvertText from "../ConvertText.tsx";

interface JobModalProps {
    job: Job;
    user?: User;
    setModal: (value: boolean) => void;
    setProfileModal: (value: boolean) => void;
    setUpdateJobModal: (value: boolean) => void;
    attendJob: (id: number, value: boolean) => void;
    setAdvertiser : (value: Advertiser) => void;
    setAds:  React.Dispatch<React.SetStateAction<Job[]>>;
}

/**
 * `JobModal` komponens, amely megjeleníti egy adott munkához kapcsolódó információkat,
 * beleértve a munkát, a hirdetőt és a résztvevőket. A felhasználók jelentkezhetnek a munkára,
 * vagy lemondhatják a jelentkezésüket. A munkát a hirdető törölheti vagy szerkesztheti.
 *
 * @component
 * @example
 * return <JobModal job={job} user={user} setModal={setModal} setProfileModal={setProfileModal} setAdvertiser={setAdvertiser} />;
 *
 * @param {Object} props - A komponens paraméterei
 * @param {Job} props.job - A munkához tartozó adatok
 * @param {User} [props.user] - Az aktuálisan bejelentkezett felhasználó (opcionális)
 * @param {Function} props.setModal - Funkció a modal bezárásához
 * @param {Function} props.setProfileModal - Funkció a profil modal állapotának kezeléséhez
 * @param {Function} props.setUpdateJobModal - Funkció a munka szerkesztési modal állapotának kezeléséhez
 * @param {Function} props.attendJob - Funkció a munkára való jelentkezéshez vagy lemondásához
 * @param {Function} props.setAdvertiser - Funkció a hirdető profil adatainak beállításához
 */
export default function JobModal({ job, user, setModal,setUpdateJobModal, attendJob, setProfileModal, setAdvertiser, setAds }: JobModalProps) {
    const date = new Date(job.date); // A munka időpontja
    const today = new Date(); // A mai dátum
    const { deleteJobById } = useAuth(); // A munka törléséhez szükséges hook

    /**
     * Az adott hirdető profil adatainak betöltése.
     * @param {string} username - A hirdető felhasználóneve
     */
    const getAdvertiser = async(username: string) => {
        setAdvertiser( {
            ...(await getProfile(username)),
            averageRating: await getAverageRating(username).then((res) => {
                return res._avg.review;
            })
        })
    }

    useEffect(() => {
        // A hirdető adatainak betöltése
        getAdvertiser(job.from);

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModal(false); // Esc gombbal bezárja a modalt
            }
        };

        document.addEventListener("keydown", handleKeyDown); // Billentyűzet figyelése

        document.body.style.overflow = "hidden"; // Tiltja a görgetést
        return () => {
            document.body.style.overflow = "auto"; // Törli a görgetési tiltást a komponens eltávolítása után
            document.removeEventListener("keydown", handleKeyDown); // Billentyűzet esemény eltávolítása
        };
    }, []);

    /**
     * A munka törlésére szolgáló funkció.
     * A törlés után értesítést jelenít meg a felhasználónak.
     */
    const handleDelete = async () => {
        deleteJobById(job.id); // A munka törlése
        setAds(prevAds => prevAds.filter(j => j.id !== job.id));
        toast.success('Sikeresen törölve lett!'); // Értesítés megjelenítése
        setModal(false); // Modal bezárása
    }

    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={() => setModal(false)}
            >
                <div
                    className="relative bg-indigo-950 rounded-lg flex flex-col shadow-sm max-h-[95%] p-6 w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-row justify-between items-center mb-4 whitespace-pre-wrap break-words">
                        <div className="flex flex-col">
                            <h3 className="text-xl font-semibold text-white ">{job.name}</h3>
                            <p
                                onClick={() => {
                                    setModal(false);
                                    setProfileModal(true);
                                }}
                                className="text-gray-400 cursor-pointer hover:text-gray-50"
                            >
                                @{job.from}
                            </p>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8  hover:bg-gray-600 hover:text-white"
                            onClick={() => setModal(false)}
                        >
                            <IoClose className="place-self-center" size={25}/>
                        </button>
                    </div>

                    <img className="rounded mt-3 mb-2 h-40 place-self-center" src={job.img}
                         alt="Job picture"/>

                    <div className="overflow-auto
                                      [&::-webkit-scrollbar]:w-1
                                      [&::-webkit-scrollbar-track]:rounded-full
                                      [&::-webkit-scrollbar-track]:bg-gray-600/25
                                      [&::-webkit-scrollbar-thumb]:rounded-full
                                      [&::-webkit-scrollbar-thumb]:bg-gray-700/30">
                        <ConvertText text={job.description}/>
                    </div>

                    <p className="text-gray-300 mt-2 break-words">Helyszín: {job.address}</p>
                    {user && (!job.profiles || job.profiles.length <= 0 || (job.profiles[0] && !job.profiles[0].isApplied)) && (job.from != user.username) && (
                        <div className=" flex mt-4 justify-center w-full">
                            <button type="button" onClick={() => {
                                attendJob(job.id, true);
                                setAds(prevState => prevState.filter(value => value.id != job.id));
                            }}
                                    className="bg-green-700 rounded p-2 w-2/3 text-white">
                                Jelentkezés
                            </button>
                        </div>
                    )}

                    {user && (job.profiles && job.profiles[0] && job.profiles[0].isApplied) && (
                        <div className=" flex mt-4 justify-center w-full">
                            <button type="button" onClick={() => {
                                attendJob(job.id, false)
                                setAds(prevState => prevState.filter(value => value.id != job.id));
                            }}
                                    className="bg-red-700 rounded p-2 w-2/3 text-white">
                                Jelentkezés lemondása
                            </button>
                        </div>
                    )}

                    {(user && (job.from == user.username) && (date > today)) && (
                        <div className=" flex flex-col mt-4 space-y-2 justify-center items-center w-full">
                            <button type="button"
                                    onClick={() => {
                                        setUpdateJobModal(true)
                                        setModal(false);
                                    }}
                                    className="bg-blue-400 rounded p-2 w-2/3 text-white">
                                Szerkesztés
                            </button>

                            <button type="button"
                                    onClick={() => {
                                        handleDelete()
                                    }}
                                    className="bg-red-800 rounded p-2 w-2/3 text-white">
                                Törlés
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                        <div>
                            <p className="text-gray-300">Résztvevők:</p>
                            <p className="text-white">{job.current_attending}/{job.max_attending}</p>
                        </div>
                        <p className="text-gray-300">{date.toLocaleDateString()}</p>
                    </div>
                </div>
                <ToastContainer/>
            </div>
        </>
    );
}
