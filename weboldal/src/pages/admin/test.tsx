import UserListCard from "@/components/cards/UserListCard";
import { getAllUsers } from "@/lib/api";
import { User } from "@/Types/User";
import { useEffect, useState } from "react"

export default function Test(){
    const [allUsers,setAllUsers] = useState<User[]>([]);
    const [filteredUsers,setFilteredUsers] = useState<User[]>([]);
    const [searchTerm,setSearchTerm] = useState<string>("");
    useEffect(() => {
          getAllUsers()
          .then((res) => {
            if(res){
              setAllUsers(res);
              setFilteredUsers(res);
            }
          })
        },[])
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = allUsers.filter((item) => 
            item.name?.toLowerCase().includes(term)
        );
        console.log(filtered);
        setFilteredUsers(filtered);
    }
    return (
        <div>
            <div className="w-[85%] place-content-center justify-items-center place-self-center mt-5">
                <input type="text" placeholder="Keress név alapján..." value={searchTerm} onChange={handleSearch} className="ml-2"/>
            </div>
            <div className="mt-3">
                <div className="w-full max-h-[60vh] overflow-y-scroll border">
                    <table className="w-full ">
                    <thead className="bg-gray-100 ">
                        <tr className="h-12">
                        <td className="w-[2%]"></td>
                        <td className="font-semibold w-[15%]">Név</td>
                        <td className="font-semibold w-[15%]">Felhasználónév</td>
                        <td className="font-semibold w-[10%]">Email</td>
                        <td className="font-semibold w-[5%]">Admin</td>
                        <td className="font-semibold w-[6%]">Készült</td>
                        <td className="font-semibold w-[5%]">Törlés</td>
                        <td className="font-semibold w-[6%]">Szerkesztés</td>
                        <td className="font-semibold w-[5%]">Elvetés</td>
                        <td className="w-[2%]"></td>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-50">
                        {
                            filteredUsers.map((curr) => <UserListCard key={curr.id} user={curr} searchTerm={searchTerm}/>)
                        }
                    </tbody>
                  </table>
                </div>
              </div>
        </div>
    )
}