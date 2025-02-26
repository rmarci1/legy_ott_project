import {profilePicChange} from "../../../api.ts";
import {ChangeEvent, useState} from "react";
import {useAuth} from "../../Context/AuthContext.tsx";

interface ChangeProfilePicModalProps{
    setModal: (value: boolean) => void
}

export default function ChangeProfilePicModal({setModal}: ChangeProfilePicModalProps){
    const {user, profilKepUpdate} = useAuth();
    const [file, setFile] = useState<string | Blob>("");

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
        <div tabIndex={-1}
             className="overflow-y-auto overflow-x-hidden fixed justify-center items-center w-fit h-fit justify-self-center md:inset-0 max-h-full">
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
    </>
}