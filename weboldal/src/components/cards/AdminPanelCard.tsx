import { IconType } from "react-icons";

interface Props{
    logo : IconType,
    title : string,
    count : number,
}

export default function AdminPanelCard({logo: Logo, title, count}: Props){
    return (
    <div className="border-2 border-gray-500 rounded-xl w-full min-h-[25%] justify-items-center place-content-center mt-5">
        <div className="w-[90%] h-[80%]">
            <div className="w-12 h-12 bg-indigo-900 rounded-sm justify-items-center place-content-center">
                <Logo color="white" size={24}/>
            </div>
            <p className="mt-6 text-white text-lg font-light">{title}</p>
            <p className="text-white font-bold text-xl">{count}</p>
        </div>
    </div>
    )
}