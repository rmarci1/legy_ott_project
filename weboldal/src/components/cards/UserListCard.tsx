import { User } from "@/Types/User";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
export default function UserListCard({user,searchTerm} : {user: User, searchTerm: string}){
    const [isOpen,setIsOpen] = useState(false);
    const [item, setItem] = useState<User>(user);
    const [updateing,setUpdateing] = useState(false);
    const changeAdmin = (isAdmin : boolean) =>{
        setItem({...item, isAdmin: isAdmin});
    } 
    const handleCancel = () => {
        const cancel = window.confirm("Biztos elakarod vetni?");
        if(cancel){
            setItem(user);
            setUpdateing(false);
        }
    }
    useEffect(() => {
        const updatedFields = Object.fromEntries(
            Object.entries(item).filter(([key,value]) => {
              
              return value !== user[key as keyof User];
            })
        );
        if(Object.keys(updatedFields).length !== 0) setUpdateing(true);
        else setUpdateing(false);
    }, [item])
    const highLightText = (text : string) => {
        let elements = [];
        let dontHighlight = "";
        let buffer = "";
        let matchIndex = 0;
        for (let index = 0; index < text.length; index++) {
            if(text[index] === searchTerm[matchIndex]){
                buffer += text[index];
                matchIndex++;
                if(matchIndex === searchTerm.length){
                    if(dontHighlight)elements.push(<span key={elements.length} className="text-indigo-900">{dontHighlight}</span>);
                    elements.push(<span key={elements.length} className="text-indigo-900">{buffer}</span>);
                    buffer = "";
                    matchIndex = 0;
                    dontHighlight = "";
                }
            }
            else{
                if(buffer){
                    elements.push(<span key={elements.length}>{buffer}</span>)
                    buffer = "";
                    matchIndex = 0;
                }
                dontHighlight+=text[index];
            }
        }
        if (dontHighlight){
            elements.push(<span key={elements.length}>{dontHighlight}</span>)
        }
        if (buffer) {
            elements.push(<span key={elements.length}>{buffer}</span>);
        }
        console.log(elements);
        return <p>{elements}</p>;
    }
    return (
        <tr className={`h-12 ${updateing && "bg-gray-400"}`}>
            <td></td>
            <td>{item.name}</td>
            <td>{item.username}</td>
            <td>{item.email}</td>
            <td className="relative inline-block place-content-center place-items-center justify-items-center mt-3 items-center">
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`${item.isAdmin? "text-green-600" : "text-red-900"} place-items-center justify-items-center flex flex-row`}
                >
                    {item.isAdmin? "Igen" : "Nem"}
                    {isOpen? <IoIosArrowUp color="black"/>:<IoIosArrowDown color="black"/>}
                </button>
                {isOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-gray-200 text-white opacity-100 border rounded shadow-lg z-50">
                        <ul className="py-2">
                            <li className={`${!item.isAdmin? "text-green-600" : "text-red-900"} px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row w-full justify-between`}>
                                <button
                                    onClick={() => {
                                        changeAdmin(!item.isAdmin);
                                        setIsOpen((prev) => !prev);
                                    }} 
                                    className="w-full text-left" 
                                >
                                    {!item.isAdmin? "Igen" : "Nem"}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </td>
            <td className="text-blue-600">{item.created.toString().split('T')[0]}</td>
            <td>
                {!user.isAdmin &&
                    <button className="bg-red-400 h-8 w-16 text-white font-light rounded-md hover:bg-gray-600">Törlés</button>
                }     
            </td>
            <td>
                <button className="bg-blue-400 h-8 w-20 text-white font-light rounded-md hover:bg-gray-600">Modósítás</button>
            </td>
            <td>{updateing && 
                <button
                    onClick={handleCancel}
                    className="bg-gray-700 h-8 w-20 text-white font-light rounded-md hover:bg-gray-600"
                >
                    Elvetés
                </button>
            }
            </td>
        </tr>
    )
}