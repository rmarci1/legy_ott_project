import {useEffect, useState} from "react";
import {createAdv, jobPicChange} from "../lib/api.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {toast, ToastContainer} from "react-toastify";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

export default function CreateAd(){
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [name, setName] = useState("");
    const [date, setDate] = useState<Date>(new Date(tomorrow.toISOString().split('T')[0]));
    const [desc, setDesc] = useState("");
    const [maxPart, setMaxPart] = useState(1);
    const [address, setAddress] = useState("");
    const [file, setFile] = useState<string | Blob>("");
    const {user, checkUser} = useAuth();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        checkUser()
    }, []);


    useEffect(() => {
        if(maxPart <= 0){
            toast.warn('Minimum 1 résztvevőnek lennie kell!', {
                className: "bg-yellow-300 text-white"
            })
            setMaxPart(1);
        }
    }, [maxPart]);


    const handleDateChange = (inputDate: string) => {
        const newDate = new Date(formatDate(inputDate));
            setDate(newDate);
    }

    const formatDate = (inputDate: string) => {
        return inputDate
            .trim()
            .replace(/\.\s?/g, "-")
            .replace(/-$/, "");
    }

    const handleSubmit = async (e: { preventDefault: () => void; }) =>{
        e.preventDefault();
        setIsLoading(true)
        if(!user){
            toast.error('Jelentkezzen be a hírdetés létrehozásához!', {
                className: "bg-red-300 text-white"
            })
            setIsLoading(false)
            return;
        }

        if(date < tomorrow){
            toast.warn('Leghamarabb holnapra hírdethet meg munkát!', {
                className: "bg-yellow-300 text-white"
            })
            setIsLoading(false)
            return;
        }

        console.log("kezdodik")
        const createdAd = await createAdv(name, date, desc, "temp", maxPart, address);
        console.log("csinalodik")
        const formData = new FormData();
        formData.append('file', file);
        console.log("kepkesz")
        await jobPicChange(formData, createdAd.id);
        console.log("megcsinalt")
        setName("");
        setDesc("");
        setAddress("")
        setFile("")
        setMaxPart(1)
        setDate(new Date());
        setIsLoading(false);
    }

    return (
        <>
            <div className="md:w-dvw w-full flex flex-wrap h-screen overflow-auto justify-center items-center">
                <div className="md:w-full w-4/5 overflow-x-hidden md:max-w-fit m-4 bg-white h-fit border p-3 border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-indigo-950 dark:border-gray-700">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <h5 className="text-xl font-medium text-gray-900 dark:text-white">Hirdetés létrehozása</h5>

                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Név</label>
                            <input type="text" name="name"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   value={name}
                                   disabled={isLoading}
                                   onChange={(e) => {
                                       if (e.target.value.length > 30) {
                                           toast.warn("Maximum 30 karakter lehet a neve!");
                                           return;
                                       }
                                       setName(e.target.value);
                                   }}
                                   placeholder="pl.: Virág ültetés"
                                   required />
                        </div>

                        <div>
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dátum</label>
                            <input type="date" name="date"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   disabled={isLoading}
                                   onChange={(e) => handleDateChange(e.target.value)}
                                   required />
                        </div>

                        <div>
                            <label htmlFor="desc" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Leírás</label>
                            <textarea name="desc"
                                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                      placeholder="pl.: 14:00-kor várok mindenkit a Blaha Lújza téren egy közös virág ültetésre"
                                      value={desc}
                                      disabled={isLoading}
                                      onChange={(e) => setDesc(e.target.value)}
                                      required />
                        </div>

                        <div>
                            <label htmlFor="maxPart" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Maximum résztvevő</label>
                            <input type="number" name="maxPart" min={1}
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   value={maxPart}
                                   disabled={isLoading}
                                   onChange={(e) => setMaxPart(+e.target.value)}
                                   required />
                        </div>

                        <div>
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cím</label>
                            <input type="text" name="address"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                   value={address}
                                   disabled={isLoading}
                                   onChange={(e) => setAddress(e.target.value)}
                                   placeholder="pl.: Blaha Lújza tér buszmegálló"
                                   required />
                        </div>

                        <div className="md:p-3 space-y-0.5">
                            <input type="file" accept="image/*"
                                   className="text-gray-300"
                                   disabled={isLoading}
                                   onChange={(e) => setFile(e.target.files![0])}
                                   required />
                        </div>

                        {/* Submit Button with Loader */}
                        <button type="submit"
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex justify-center items-center"
                                disabled={isLoading}>
                            {isLoading ? (
                                <span className="flex items-center">
                                    <AiOutlineLoading3Quarters className="animate-spin mr-2" size={18} />
                                    Betöltés...
                                </span>
                            ) : (
                                "Létrehozás"
                            )}
                        </button>
                    </form>
                </div>

                <ToastContainer autoClose={2000} />
            </div>
        </>
    );
}