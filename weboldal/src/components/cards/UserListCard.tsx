import { useAuth } from "@/context/AuthContext";
import { deleteJobByAdmin, deleteUserByAdmin, updateUserByAdmin } from "@/lib/api";
import { Job } from "@/Types/Job";
import { UpdateUser } from "@/Types/UpdateUser";
import { User } from "@/Types/User";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
export default function UserListCard({user,searchTerm,onDelete, onUpdate} : {user: User | Job, searchTerm: string, onDelete : (id: string | number) => void, onUpdate : () => void}){
    const {isUser} = useAuth();
    const [isOpen,setIsOpen] = useState(false);
    const [item, setItem] = useState<User | Job>(user);
    const [updateing,setUpdateing] = useState(false);
    const [updatedValues,setUpdatesValues] = useState<UpdateUser | null>(null);
    const [isCurrentUser, setIsCurrentUser] = useState<boolean | null>(null);
    useEffect(() => {
        const fetchUserStatus = async () => {
            const result = await isUser(user);
            setIsCurrentUser(result);
        };
    
        fetchUserStatus();
    }, []);
 
    const changeAdmin = (isAdmin : boolean) =>{
        setItem({...item, isAdmin: isAdmin});
    } 
    const showAlertConfirm = (text : string) => {
        return window.confirm(text);
    }
    const handleCancel = () => {
        if(showAlertConfirm("Biztos elakarod vetni?")){
            setItem(user);
            setUpdateing(false);
        }
    }
    const handleDelete = async () => {
        if(showAlertConfirm("Biztos kiakarod törölni?")){
            try{
                if(isCurrentUser){
                    await deleteUserByAdmin((user as User).username);
                    onDelete((user as User).username);
                }
                else{
                    await deleteJobByAdmin((user as Job).id);
                    onDelete((user as Job).id)
                }
            }
            catch(error : any){
                alert(error.message);
            }
        }
    }
    const handleUpdate = async () => {
        if(!updateing){
            alert("Változtass meg valamit!");
            return;
        }
        try{
            if(isCurrentUser){
                await updateUserByAdmin(updatedValues!,(user as User)?.username);
                onUpdate();
            }
            else{

            }
        }
        catch(error : any){
            alert(error.message);
        }
    }
    useEffect(() => {
        const fetch = async () => {
            const updatedFields : UpdateUser =  await getUpdatedFields();
            if(Object.keys(updatedFields).length !== 0) {
                setUpdatesValues(updatedFields as UpdateUser);
                setUpdateing(true);
            }
            else setUpdateing(false);
        }
        fetch();
    }, [item])
    const getUpdatedFields = async () : Promise<UpdateUser> => {
        if(await isUser(user)){
            return Object.fromEntries(
                Object.entries(item).filter(([key,value]) => {
                  
                  return value !== (user as User)[key as keyof User];
                })
            );
        }
        else{
            return Object.fromEntries(
                Object.entries(item).filter(([key,value]) => {
                  
                  return value !== (user as Job)[key as keyof Job];
                })
            );
        }
    }
    const highLightText = (text : string) => {
        let elements = [];
        let dontHighlight = "";
        let buffer = "";
        let matchIndex = 0;
        for (let index = 0; index < text.length; index++) {
            if(text[index].toLowerCase() === searchTerm[matchIndex]){
                buffer += text[index];
                matchIndex++;
                if(matchIndex === searchTerm.length){
                    if(dontHighlight)elements.push(<span key={elements.length}>{dontHighlight}</span>);
                    elements.push(<span key={elements.length} className="text-green-600">{buffer}</span>);
                    buffer = "";
                    matchIndex = 0;
                    dontHighlight = "";
                }
            }
            else{
                if(buffer){
                    elements.push(<span key={elements.length}>{dontHighlight}</span>);
                    elements.push(<span key={elements.length}>{buffer}</span>);
                    dontHighlight = "";
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
        return <p>{elements}</p>;
    }
    return (
        <tr className={`h-12 ${updateing && "bg-gray-400"}`}>
            <td></td>
            <td>{searchTerm? highLightText(item?.name)  : item?.name}</td>
            <td>{searchTerm? highLightText(isCurrentUser ? (item as User)?.username || "" : (item as Job)?.from || "") : isCurrentUser ? (item as User)?.username : (item as Job)?.from}</td>
            <td>{isCurrentUser? (item as User)?.email : (item as Job).address}</td>
            {isCurrentUser?
            <td className="relative inline-block place-content-center place-items-center justify-items-center mt-3 items-center">
                <button
                    disabled={(user as User).isAdmin}
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`${(item as User)?.isAdmin? "text-green-600" : "text-red-900"} place-items-center justify-items-center flex flex-row`}
                >
                    {(item as User)?.isAdmin? "Igen" : "Nem"}
                    {!(user as User).isAdmin && (isOpen? <IoIosArrowUp color="black"/>:<IoIosArrowDown color="black"/>)}
                </button>
                {isOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-gray-200 text-white opacity-100 border rounded shadow-lg z-50">
                        <ul className="py-2">
                            <li className={`${!(item as User).isAdmin? "text-green-600" : "text-red-900"} px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row w-full justify-between`}>
                                <button
                                    onClick={() => {
                                        changeAdmin(!(item as User)?.isAdmin);
                                        setIsOpen((prev) => !prev);
                                    }} 
                                    className="w-full text-left" 
                                >
                                    {!(item as User).isAdmin? "Igen" : "Nem"}
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </td> : <td>{(item as Job).current_attending} / <span className="text-teal-700">{(item as Job).max_attending}</span></td>}
            <td className="text-blue-600">{isCurrentUser ? (item as User)?.created?.toString().split('T')[0] : (item as Job).date?.toString().split('T')[0]}</td>
            <td>
                {(isCurrentUser ? !(user as User)?.isAdmin : true) &&
                    <button className="bg-red-400 h-8 w-16 text-white font-light rounded-md hover:bg-gray-600"
                        onClick={handleDelete}
                    >
                        Törlés
                    </button>
                }     
            </td>
            <td>
                {(isCurrentUser ? !(user as User)?.isAdmin : true) &&
                    <button 
                        className="bg-blue-400 h-8 w-20 text-white font-light rounded-md hover:bg-gray-600"
                        onClick={handleUpdate}
                    >
                        Modósítás
                    </button>
                }
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