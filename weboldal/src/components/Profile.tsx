// import { useNavigate } from "react-router";
// import { useAuth } from "./Context/AuthContext"
import { useState } from "react";

export default function Profile(){
    // const {user} = useAuth();
    // const navigate = useNavigate();

    const [mode, setMode] = useState<1|2>(1)
    const [modal, setModal] = useState(false);

    return <>
        <div className="justify-center flex flex-wrap">
            <div className="flex w-fit">
                <div className="w-fit relative text-center rounded-full group cursor-pointer" onClick={() => setModal(true)}>
                        <img className="w-28 h-auto rounded-full drop-shadow-lg transition-all duration-300 group-hover:brightness-50" src="https://res.cloudinary.com/ddjasa4hz/image/upload/v1738145231/nn1qew6lhsxgfggs1evm.jpg"></img>
                        <p className="text-sm text-white invisible group-hover:visible absolute top-1/3 bottom-1/2 right-1/4 left-1/4 transform:translate-x-1/2 transform:translate-y-1/2">Fénykép feltöltése</p>
                </div>
                {
                    modal && (
                        <div tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                            <div className="relative p-4 w-full max-w-2xl max-h-full">
                                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Profilkép feltöltése
                                        </h3>
                                        <div className="p-4 md:p-5 space-y-4">
                                            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                                                Töltsön fel egy képet!
                                            </p>
                                                <input type="file" name="" id="" />
                                        </div>  
                                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={() => setModal(false)}>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                            </svg>
                                            <span className="sr-only">Close modal</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                
                <div className="justify-center content-center p-3">
                    {/*<h2>{user?.name}</h2>*/}
                    <h2 className="font-black text-2xl">Kovács Laci</h2>
                    <h3>@kovacs.laci</h3>
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
        </div>        
    </>
}