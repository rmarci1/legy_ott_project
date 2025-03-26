import {IoClose} from "react-icons/io5";
import {Textarea} from "flowbite-react";
import {toast, ToastContainer} from "react-toastify";
import {useEffect, useState} from "react";
import {Job} from "@/Types/Job.ts";
import {updateJob} from "@/lib/api.ts";

interface UpdateJobModalProps{
    setModal: (value: boolean) => void;
    setJobModal: (value: boolean) => void;
    job: Job
}

export default function UpdateJobModal({setModal, job, setJobModal}: UpdateJobModalProps){
    const [form, setForm] = useState<Job>(job ?? {} as Job);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModal(false);
                setJobModal(true);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
            document.addEventListener("keydown", handleKeyDown);
        };
    }, []);

    const handleSave = async (e: any) => {
        e.preventDefault();
        const updatedField = Object.fromEntries(
            Object.entries(form).filter(([key,value]) => {
                return value !== (job as Record<string, any>)[key];
            })
        );
        if(Object.keys(updatedField).length === 0){
            toast.warn("Nincs változás", {
                className: "bg-yellow-300 text-white"
            });
            return;
        }

        try{
            await updateJob(updatedField, job.id);

            Object.assign(job, updatedField);

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

    return <>
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => {
                setModal(false)
                setJobModal(true)
            }}
        >
            <div
                className="relative bg-indigo-950 rounded-lg flex flex-col shadow-sm max-h-[95%] p-6 w-full max-w-2xl overflow-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:rounded-full
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:bg-gray-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-row justify-between text-white p-2 pb-4">
                    <h5 className="text-xl font-medium ">Munka szerkesztése</h5>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8  hover:bg-gray-600 hover:text-white"
                        onClick={() => {
                            setModal(false)
                            setJobModal(true);
                        }}
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
                        <label htmlFor="date"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dátum</label>
                        <input type="date" name="date" id="date"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               onChange={(e) => {
                                   setForm({...form, date: new Date(e.target.value)})
                               }}
                        />
                    </div>
                    <div>
                        <label htmlFor="address"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cím</label>
                        <input type="text" name="address" id="address"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                               placeholder="pl.: Rózsavirág utca 3"
                               value={form.address}
                               onChange={(e) => {
                                   setForm({...form, address: e.target.value})
                               }}
                        />
                    </div>
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
                                  }}
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