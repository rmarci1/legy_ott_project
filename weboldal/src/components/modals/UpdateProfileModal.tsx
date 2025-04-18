import {Textarea} from "flowbite-react";
import {useEffect, useRef, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {updateProfile} from "@/lib/api.ts";
import {useAuth} from "@/context/AuthContext.tsx";
import {User} from "@/Types/User.ts";
import {IoClose} from "react-icons/io5";
import ConvertType from "../ConvertType";
import ConvertText from "../ConvertText";
interface UpdateProfileModalProps{
    setModal: (value: boolean) => void,
}

/**
 * Profil frissítő modális ablak, amely lehetővé teszi a felhasználó számára, hogy frissítse személyes adatait, mint például a nevét, felhasználónevét, e-mail címét és leírását.
 * Az ablak tartalmazza a változtatások mentésére, leírás szerkesztésére, és egyéb szerkesztési lehetőségekre szolgáló funkciókat.
 *
 * @param {UpdateProfileModalProps} props - A modal megjelenését és eltüntetését irányító funkció.
 * @returns {JSX.Element} A profil frissítő modális ablak.
 */
export default function UpdateProfileModal({setModal} : UpdateProfileModalProps){
    const {user, bejelentkezes} = useAuth();
    const [form, setForm] = useState<User>(user ?? {} as User);
    const [stashed,setStashed] = useState<string>("");
    const [selection, setSelection] = useState<{start: number, end:number}>({ start: 0, end: 0});
    const [undoStates, setUndoStates] = useState<string[]>([""]);
    const [unsavedChanges,setUnsavedChanges] = useState<boolean>(false);
    const [typingTimeout, setTypingTimeout] = useState<number | null>(null);
    const [isDescShowVisible,setIsDescShowVisible] = useState<boolean>(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    /** Beállítja, hogy a modál zárható legyen ESC billentyűvel és a kikattintással */
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
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [form.description]);


    /**
     * A felhasználói adatok mentése, ha azok változtak.
     * Ha nincsenek változtatások, figyelmeztető üzenet jelenik meg.
     *
     * @param {React.FormEvent} e - A form elküldésekor meghívott esemény.
     */
    const handleSave = async (e: any) =>{
        e.preventDefault();
        if(user){
            const updatedField = Object.fromEntries(
                Object.entries(form).filter(([key,value]) => {
                    return value !== (user as Record<string, any>)[key];
                })
            );
            if(Object.keys(updatedField).length === 0){
                toast.warn("Nincs változás", {
                    className: "bg-yellow-300 text-white"
                });
                return;
            }

            try{
                const res = await updateProfile(updatedField);
                bejelentkezes(res);
                toast.success("Sikeres változtatás!", {
                    className: "bg-green-300 text-white"
                })
            }
            catch (e: any){
                toast.error(e.message, {
                    className: "bg-red-300 text-white"
                })
            }
        }
    }
    /**
     * A változtatásokat észleli, és beállítja a változtatások állapotát.
     */
    const handleChanges = () =>{
        if(!unsavedChanges){
          setUnsavedChanges(true);
        }
    }
    return <>
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setModal(false)}
        >   
            {isDescShowVisible && 
            <div className="absolute z-50 top-12">
                <div ref={scrollRef} className="w-full bg-gray-800 rounded-xl flex flex-wrap whitespace-pre-line break-words p-2 max-h-20 overflow-y-auto">
                    <ConvertText text={form?.description} />
                </div>
            </div>
            }
            <div
                className="relative bg-indigo-950 rounded-lg flex flex-col shadow-sm max-h-[95%] p-6 w-full max-w-2xl overflow-auto [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300"
                onClick={(e) => e.stopPropagation()}
            >   

                <div className="flex flex-row justify-between text-white p-2 pb-4">
                    <h5 className="text-xl font-medium ">Profil szerkesztése</h5>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8  hover:bg-gray-600 hover:text-white"
                        onClick={() => setModal(false)}
                    >
                        <IoClose className="place-self-center" size={25}/>
                    </button>
                </div>
                <form className="space-y-6 flex flex-col text-left text-white w-2/3 place-self-center "
                      onSubmit={handleSave}>

                    <div>
                        <label htmlFor="name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Név</label>
                        <input type="text" name="name" id="name"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="Jakab Zoltán"
                               value={form.name}
                               onChange={(e) => {
                                   setForm({...form, name: e.target.value})
                               }}
                        />
                    </div>
                    <div>
                        <label htmlFor="username"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Felhasználónév</label>
                        <input type="text" name="username" id="username"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="jakab.zoltan"
                               value={form.username}
                               onChange={(e) => {
                                   setForm({...form, username: e.target.value})
                               }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email
                            cím</label>
                        <input type="email" name="email" id="email"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="pelda@gmail.com"
                               value={form.email}
                               onChange={(e) => {
                                   setForm({...form, email: e.target.value})
                               }}
                        />
                    </div>
                    <hr/>
                    <ConvertType
                        selection={selection}
                        description={form.description}
                        handleForm={(e) => {
                            setForm({...form, description: e});
                            handleChanges();
                        }}
                        undoStates={undoStates}
                        handleSelection={(e) => setSelection(e)}
                        handleUndoStates={(e) => setUndoStates(e)}
                        stashed={stashed}
                        handleStash={(e) => setStashed(e)}
                        iconColor="white"                  
                    />
                    <hr/>
                    <div>
                        <label htmlFor="desc"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Leírás
                        </label>
                        <Textarea name="desc" id="desc"
                                  className=" border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
                                  placeholder="pl.: Nagyon szeretek kertészkedni"
                                  value={form.description}
                                  onChange={(e) => {
                                      setForm({...form, description: e.target.value})
                                    handleChanges();
                                    setForm({...form, description: e.target.value});
    
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
                    <button type="submit"
                            className="w-2/3 place-self-center text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Mentés
                    </button>
                </form>
            </div>
            <ToastContainer/>
        </div>
    </>
}