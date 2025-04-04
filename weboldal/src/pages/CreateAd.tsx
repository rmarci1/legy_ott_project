import {useEffect, useRef, useState} from "react";
import {createAdv, jobPicChange} from "../lib/api.ts";
import {useAuth} from "../context/AuthContext.tsx";
import {toast, ToastContainer} from "react-toastify";
import ConvertType from "@/components/ConvertType.tsx";
import ConvertText from "@/components/ConvertText.tsx";
import {AiOutlineLoading3Quarters} from "react-icons/ai";

/**
 * A `CreateAd` komponens lehetővé teszi a felhasználók számára, hogy új hirdetéseket hozzanak létre.
 * A hirdetés tartalmazhatja a nevét, dátumát, leírását, résztvevők számát, címét és egy képet.
 *
 * A komponens kezeli a felhasználó által végrehajtott változtatásokat, és validálja a hirdetés létrehozását.
 *
 * @component
 * @returns {JSX.Element} A hirdetés létrehozásához szükséges űrlap.
 */
export default function CreateAd(){
    const tomorrow: Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [name, setName] = useState("");
    const [date, setDate] = useState<Date>(new Date(tomorrow.toISOString().split('T')[0]));
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const [desc, setDesc] = useState("");
    const [maxPart, setMaxPart] = useState(1);
    const [address, setAddress] = useState("");
    const [file, setFile] = useState<string | Blob>("");
    const {user, checkUser} = useAuth();
    const [stashed,setStashed] = useState<string>("");
    const [selection, setSelection] = useState<{start: number, end:number}>({ start: 0, end: 0});
    const [undoStates, setUndoStates] = useState<string[]>([""]);
    const [unsavedChanges,setUnsavedChanges] = useState<boolean>(false);
    const [isDescShowVisible,setIsDescShowVisible] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Ellenőrzi a felhasználó bejelentkezési állapotát a komponens betöltésekor.
     */
    useEffect(() => {
        checkUser()
    }, []);

    /**
     * Figyeli, hogy ne legyen 1-nél kevesebb résztvevő
     */
    useEffect(() => {
        if(maxPart <= 0){
            toast.warn('Minimum 1 résztvevőnek lennie kell!', {
                className: "bg-yellow-300 text-white"
            });
            setMaxPart(1);
        }
    }, [maxPart]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [desc]);

    /**
     * Kezeli a dátum változtatását.
     *
     * @param {string} inputDate - Az új dátum string formátumban.
     */
    const handleDateChange = (inputDate: string) => {
        const newDate = new Date(formatDate(inputDate));
            setDate(newDate);
    }

    /**
     * A dátum formázására szolgáló segédfüggvény.
     *
     * @param {string} inputDate - A dátum formátum nélküli szöveges reprezentációja.
     * @returns {string} A formázott dátum.
     */
    const formatDate = (inputDate: string) => {
        return inputDate
            .trim()
            .replace(/\.\s?/g, "-")
            .replace(/-$/, "");
    }

    /**
     * Hirdetés létrehozása, a form beküldésekor végrehajtódik.
     *
     * @param {Event} e - Az űrlap submit eseménye.
     */

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

    /**
     * Kezeli a változások észlelését a leírás szövegében.
     */
    const handleChanges = () =>{
        if(!unsavedChanges){
          setUnsavedChanges(true);
        }
    }
    return (
    <>
        <div className="md:w-dvw w-full flex flex-wrap h-screen overflow-auto border">
            <div className="place-content-center justify-items-center w-full">
                <div
                    className=" md:w-full w-4/5 overflow-x-hidden md:max-w-fit m-4 bg-white h-fit border p-3 border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-indigo-950 dark:border-gray-700"
                >   
                    {isDescShowVisible && 
                    <div className="absolute">
                        <div ref={scrollRef} className="w-80 bg-gray-800 rounded-xl flex flex-wrap whitespace-pre-line break-words p-2 max-h-20 overflow-y-auto">
                            <ConvertText text={desc} />
                        </div>
                    </div>
                    }
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <h5 className="text-xl font-medium text-gray-900 dark:text-white">Hírdetés létrehozása</h5>
                        <div>
                            <label htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Név</label>
                            <input type="text"
                                disabled={isLoading}
                                name="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                value={name}
                                onChange={(e) => {
                                    if(e.target.value.length > 30){
                                        toast.warn('Maximum 30 karakter lehet a neve!', {
                                            className: "bg-yellow-300 text-white"
                                        })
                                        return;
                                    }
                                    setName(e.target.value)
                                }}
                                placeholder="pl.: Virág ültetés"
                                required/>
                        </div>
                        <div>
                            <label htmlFor="date"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dátum</label>
                            <input type="date"
                                disabled={isLoading}
                                name="date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                min={formatDate(tomorrow.toLocaleDateString())}
                                onChange={(e) => {
                                    handleDateChange(e.target.value);
                                }}
                                required/>
                        </div>
                        <hr/>
                        <ConvertType
                            selection={selection}
                            description={desc}
                            handleForm={(e) => {
                                setDesc(e);
                                handleChanges();
                            }}
                            undoStates={undoStates}
                            handleSelection={(e) => setSelection(e)}
                            handleUndoStates={(e) => setUndoStates(e)}
                            stashed={stashed}
                            handleStash={(e) => setStashed(e)}
                            iconColor="white"                  
                        />
                        <hr />
                        <div>
                            <label htmlFor="desc"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Leírás</label>
                            <textarea 
                                disabled={isLoading}
                                name="desc"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                placeholder="pl.: 14:00-kor várok mindenkit a Blaha Lújza téren egy közös virág ültetésre"
                                value={desc}
                                onChange={(e) => {
                                handleChanges();
                                setDesc(e.target.value);

                                if (typingTimeout) {
                                    clearTimeout(typingTimeout);
                                }

                                const newTimeout = window.setTimeout(() => {
                                    let temp = undoStates;
                                    if (stashed) temp.push(stashed);
                                    setStashed(e.target.value);
                                    setUndoStates(temp);
                                }, 1000);

                                setTypingTimeout(newTimeout);
                                }}
                                onSelect={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    setSelection({ start: target.selectionStart, end: target.selectionEnd });
                                }}
                                onFocus={() => setIsDescShowVisible(true)}
                                onBlur={() => setIsDescShowVisible(false)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="maxPart"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Maximum
                                résztvevő</label>
                            <input type="number"
                                disabled={isLoading}
                                name="maxPart"
                                min={1}
                                value={maxPart}
                                onChange={(e) => {
                                    setMaxPart(+e.target.value)
                                }}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                required/>
                        </div>
                        <div>
                            <label htmlFor="address"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cím</label>
                            <input type="text"
                                disabled={isLoading}
                                name="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                value={address}
                                onChange={(e) => {
                                    setAddress(e.target.value)
                                }}
                                placeholder="pl.: Blaha Lújza tér buszmegálló"
                                required/>
                        </div>
                        <div className=" md:p-3 space-y-0.5">
                            <input type="file"
                                accept="image/*"
                                className="text-gray-300 "
                                onChange={(e) => {setFile(e.target.files![0]);}}
                                required
                                />
                        </div>
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
            </div>
        <ToastContainer
             autoClose={2000}/>
        </div>
      </>
    )
}