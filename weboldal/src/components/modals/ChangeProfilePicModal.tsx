import {profilePicChange} from "../../lib/api.ts";
import {ChangeEvent, useEffect, useState} from "react";
import {useAuth} from "../../context/AuthContext.tsx";
import {IoClose} from "react-icons/io5";
import {toast, ToastContainer} from "react-toastify";

interface ChangeProfilePicModalProps{
    setModal: (value: boolean) => void,
    setIsLoading: (value: boolean) => void
}

/**
 * `ChangeProfilePicModal` komponens, amely lehetővé teszi a felhasználó számára a profilkép módosítását.
 * A felhasználó képet tölthet fel, amelyet a rendszer feltölt és frissíti a felhasználó profilját.
 *
 * @component
 * @example
 * return <ChangeProfilePicModal setModal={setModal} setIsLoading={setIsLoading} />;
 *
 * @param {Object} props - A komponens paraméterei
 * @param {Function} props.setModal - Funkció a modal bezárásához
 * @param {Function} props.setIsLoading - Funkció a betöltési állapot kezeléséhez
 */
export default function ChangeProfilePicModal({setModal, setIsLoading}: ChangeProfilePicModalProps) {
    const {user, checkUser} = useAuth();
    const [file, setFile] = useState<string | Blob>("");

    /**
     * A fájlváltoztatás eseménykezelője.
     * Beállítja a kiválasztott fájlt a komponens állapotában.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - A fájl kiválasztásához kapcsolódó esemény
     */
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files![0]);
        }
    };

    /**
     * A profilkép feltöltésére szolgáló funkció.
     * A kiválasztott képet a backend rendszerhez küldi.
     * Hibakezelés és visszajelzés a felhasználónak.
     *
     * @param {any} e - A form elküldéséhez kapcsolódó esemény
     */
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

        try{
            setIsLoading(true)
            user && await profilePicChange(formData)
        }
        catch (e) {
            throw e
        }
        finally {
            setIsLoading(false);
        }

        checkUser(); // Frissíti a felhasználói adatokat

        setModal(false); // Bezárja a modalt a sikeres feltöltés után
    }

    useEffect(() => {
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
    return <>
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
    </>
}