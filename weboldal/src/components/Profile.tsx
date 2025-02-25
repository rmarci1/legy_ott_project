import {ChangeEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "./Context/AuthContext.tsx";
import {logout, profilePicChange} from "../api.ts";

export default function Profile(){
    const {user, profilKepUpdate, checkUser, kijelentkezes, isLoading} = useAuth();
    const [mode, setMode] = useState<1|2>(1)
    const [modal, setModal] = useState(false);
    const [file, setFile] = useState<string | Blob>("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            await checkUser();
        };
        fetchUser();
    }, []);

    useEffect(() => {
        console.log("Effect Triggered → User:", user, "isLoading:", isLoading);

        if (isLoading || user === undefined) return;

        if (user === null) {
            console.log("Redirecting to login...");
            navigate('/login');
        }
    }, [user, isLoading]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files![0]);
        }
    };

    async function handleSendPic(e: any) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', user?.username || "");

        user && profilePicChange(formData, user?.username).then((res) => {
            profilKepUpdate(res.profileImg, user);
        });

        setModal(false)
    }

    return <>
        <div className="w-dvw flex flex-wrap h-fit p-3 justify-center ">
            <div className="flex w-fit">
                <div className="w-fit relative text-center rounded-full group cursor-pointer" onClick={() => setModal(true)}>
                        <img className="w-28 h-auto rounded-full drop-shadow-lg transition-all duration-300 group-hover:brightness-50" src={user?.profileImg}></img>
                        <p className="text-sm text-white invisible group-hover:visible absolute top-1/3 bottom-1/2 right-1/4 left-1/4 transform:translate-x-1/2 transform:translate-y-1/2">Fénykép feltöltése</p>
                </div>
                {
                    modal && (
                        <div tabIndex={-1} className="overflow-y-auto overflow-x-hidden fixed justify-center items-center w-fit h-fit justify-self-center md:inset-0 max-h-full">
                            <div className="relative p-4 w-full max-w-2xl max-h-full">
                                <div className="relative bg-indigo-950 rounded-lg shadow-sm ">
                                    <div className="flex items-center justify-between p-4 md:p-5 rounded-t">
                                        <form onSubmit={handleSendPic}>
                                            <div className="flex flex-row">
                                                <h3 className="text-xl font-semibold text-white">
                                                    Töltsön fel egy képet!
                                                </h3>
                                                <button type="button"
                                                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                                        onClick={() => setModal(false)}>
                                                    <svg className="w-3 h-3" aria-hidden="true"
                                                         xmlns="http://www.w3.org/2000/svg" fill="none"
                                                         viewBox="0 0 14 14">
                                                        <path stroke="currentColor" strokeLinecap="round"
                                                              strokeLinejoin="round" strokeWidth="2"
                                                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className=" md:p-3 space-y-0.5">
                                                <input type="file" accept="image/*" className="text-gray-300 "
                                                       onChange={handleFileChange}/>
                                                <button type="submit" className="bg-gray-300 rounded p-2">Feltöltés
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                <div className="justify-center content-center p-3">
                    <h2 className="font-black text-2xl">{user?.name}</h2>
                    <h3>@{user?.username}</h3>
                </div>
            </div>
            <div className="basis-full p-3"></div>
            <div className=" bg-indigo-950 h-px w-2/4"></div>
            <div className="basis-full p-3"></div>
            <div className="flex text-2xl flex-row text-center w-1/3">
                <p className="cursor-pointer grow-0 flex-none hover:underline decoration-indigo-950 decoration-1 underline-offset-4" onClick={() => setMode(1)}>Önkéntes</p>
                <p className="text-indigo-950 font-thin grow cursor-default">|</p>
                <p className="cursor-pointer grow-0 flex-none hover:underline decoration-indigo-950 decoration-1 underline-offset-4" onClick={() => setMode(2)}>Hírdetés</p>
            </div>

            {
                mode == 1 ? 
                (<>

                </>)
                :
                (<>

                </>)

            }

            <button className="bg-red-700 text-white" onClick={() => logout().then(kijelentkezes)}>Logout</button>
        </div>        
    </>
}