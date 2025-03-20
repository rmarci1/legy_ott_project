import {profilePicChange} from "../../lib/api.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {IoClose} from "react-icons/io5";
import {toast, ToastContainer} from "react-toastify";

interface ChangeProfilePicModalProps{
    setModal: (value: boolean) => void
}

export default function ChangeProfilePicModal({setModal}: ChangeProfilePicModalProps) {
    const {user, profilKepUpdate, checkUser, isLoading} = useAuth();
    const [file, setFile] = useState<string | Blob>("");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files![0]);
        }
    };

    async function handleSendPic(e: any) {
        e.preventDefault();
        if (!file) {
            toast.warning('Adjon meg egy képet!', {
                className: "bg-yellow-700 text-white font-semibold p-3 rounded-lg shadow-md",
                progressClassName: "bg-red-400"
            })
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', user?.username || "");

        user && await profilePicChange(formData).then((res) => {
            profilKepUpdate(res.profileImg, user);

        });

        checkUser()

        setModal(false)
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModal(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
            document.addEventListener("keydown", handleKeyDown);
        };
    }, []);
    return <>
    {
    !isLoading ?(
        <div
            className="fixed inset-0 bg-black  bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setModal(false)}
        >
            <div
                className="relative bg-indigo-950 rounded-lg m-2 shadow-md max-h-[90%] p-6 w-full max-w-md md:max-w-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">Profilkép feltöltése</h3>
                    <button
                        type="button"
                        className="text-gray-400 hover:bg-gray-600 rounded-lg p-1"
                        onClick={() => setModal(false)}
                    >
                        <IoClose size={25}/>
                    </button>
                </div>

                <form onSubmit={handleSendPic} className="space-y-3 flex flex-row justify-between items-center">
                    <input
                        type="file"
                        accept="image/*"
                        className="text-gray-300 w-full rounded p-2"
                        onChange={handleFileChange}
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 rounded p-2 w-2/5 text-white transition"
                    >
                        Feltöltés
                    </button>
                </form>
            </div>
            <ToastContainer/>
        </div>
        )
        :
        (<div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>)
    }
    </>
}