  import Loading from "@/components/Loading"
  import { useAuth } from "@/context/AuthContext"
  import { getAllUsers } from "@/lib/api"
  import { User } from "@/Types/User"
  import { useEffect, useState } from "react"
  import { IoSearchOutline } from "react-icons/io5"
  export default function Users() {
    const {user,isLoading} = useAuth()
    const [searchForm, setSearchForm] = useState({
      search : ""
    })
    const [allUsers,setAllUsers] = useState<User[]>([])
    const [isUsersLoading,setIsUsersLoading] = useState(false);
    useEffect(() => {
      setIsUsersLoading(true);
      getAllUsers()
      .then((res) => {
        if(res){
          setAllUsers(res);
        }
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsUsersLoading(false);
      })
    },[])
    const [userPerPage, setUserPerPage] = useState<number>(0);
    return (
      <div className="bg-[#0d0b42] h-screen w-screen">
        {(!isLoading && !isUsersLoading ) ?
        <div className="h-full w-full">
          <div className="mt-10 w-[95%] h-[12%] place-self-center">
            <div className="place-self-end flex flex-row">
              <p className="text-white self-center mr-6 font-bold text-lg">{user?.username}</p>
              <img src={user?.profileImg} className="h-11 w-11 rounded-full" />
            </div>
            <p className="text-white text-3xl">Felhasználók</p>
          </div>
          <div className="bg-gray-200 h-full w-full place-content-center justify-items-center">
            <div className="w-[95%] h-[92%]">
              <div className="bg-white w-full h-14 place-items-center flex flex-row justify-between border">
                <div className="flex flex-row">
                  <div className="border ml-2 h-9 w-60 place-content-center justify-items-center flex flex-row rounded-md">
                    <div className="w-[85%] place-content-center justify-items-center place-self-center">
                      <input type="text" placeholder="Keress név alapján..." value={searchForm.search} onChange={(e) => setSearchForm({...searchForm, search: e.target.value})} className="ml-2"/>
                    </div>
                    <button className="h-full w-[15%] place-content-center justify-items-center border hover:bg-gray-200">
                      <IoSearchOutline size={20} className="" />
                    </button>
                  </div>
                  <div className="h-9 place-items-center justify-items-center ml-2 flex flex-row">
                      <p className="text-gray-400">Mutasson</p>
                      <input type="number" placeholder="3" value={searchForm.search} onChange={(e) => setUserPerPage(parseInt(e.target.value))} className="w-20 h-full border text-left mx-2 px-2 rounded-md"/>
                      <p className="ml-1 text-gray-400">felhasználót oldalanként</p>
                  </div>
                </div>
                <div className="flex flex-row mr-2 h-9">
                    <div className="h-full place-content-center justify-items-center place-self-center border justify-between flex flex-row">
                      <div className="w-[85%] place-content-center justify-items-center place-self-center">
                        <input type="date" placeholder="Válassz egy napot" value={searchForm.search} onChange={(e) => setSearchForm({...searchForm, search: e.target.value})} className="ml-2"/>
                      </div>
                    </div>
                    <button className="px-4 border mx-2 bg-gray-200 rounded-md hover:bg-gray-500">Szűrő</button>
                    <button className="px-4 bg-[#3410e6] text-white h-full font-light rounded-md">Beküldés</button>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full max-h-[70vh] overflow-y-scroll border">
                  <table className="w-full ">
                    <thead className="bg-gray-100 ">
                      <tr className="h-12">
                        <td className="w-[2%]"></td>
                        <td className="font-semibold w-[15%]">Név</td>
                        <td className="font-semibold w-[15%]">Felhasználónév</td>
                        <td className="font-semibold w-[10%]">Email</td>
                        <td className="font-semibold w-[5%]">Admin</td>
                        <td className="font-semibold w-[5%]">Készült</td>
                        <td className="font-semibold w-[10%]">Törlés</td>
                        <td className="w-[2%]"></td>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-50">
                    {
                      allUsers.map((curr) => <tr className="h-12">
                        <td className="w-[2%]"></td>
                        <td className="w-[15%]">{curr.name}</td>
                        <td className="w-[15%]">{curr.username}</td>
                        <td className="w-[10%]">{curr.email}</td>
                        <td className={`w-[5%] ${curr.isAdmin? "text-green-600" : "text-red-900"}`}>{curr.isAdmin? "Igen" : "Nem"}</td>
                        <td className="w-[5%] text-blue-600">{curr.created.toString().split('T')[0]}</td>
                        <td className="w-[10%]">
                        {!curr.isAdmin &&
                            <button className="bg-red-400 h-8 w-16 text-white font-light rounded-md">Törlés</button>
                        }     
                        </td>
                        <td className="w-[2%]"></td>
                      </tr>)
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>     
          </div>
        </div>
        :
        <Loading/>
        }
      </div>
    )
  }
