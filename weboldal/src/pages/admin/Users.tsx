  import UserListCard from "@/components/cards/UserListCard"
  import Loading from "@/components/Loading"
  import { useAuth } from "@/context/AuthContext"
  import { getAllUsers } from "@/lib/api"
  import { User } from "@/Types/User"
  import { useEffect, useState } from "react"
  import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
  import { IoSearchOutline } from "react-icons/io5"
  export default function Users() {
    const {user,isLoading} = useAuth()
    const [allUsers,setAllUsers] = useState<User[]>([]);
    const [filteredUsers,setFilteredUsers] = useState<User[]>([]);
    const [isUsersLoading,setIsUsersLoading] = useState(false);
    const [userPerPage, setUserPerPage] = useState<number>(50);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userstoShow,setUsersToShow] = useState<User[]>([]);
    const [searchTerm,setSearchTerm] = useState("");
    const [dateSearch, setDateSearch] = useState<string>();
    const [totalPages,setTotalPages] = useState<number>(Math.ceil(filteredUsers.length/userPerPage));
    useEffect(() => {
      if(!isLoading && !isUsersLoading){
        setUsersToShow(allUsers.slice(((currentPage? currentPage : 1) - 1)* (userPerPage ? userPerPage : 0), (currentPage ? currentPage : 1)*(userPerPage ? userPerPage : filteredUsers.length)));
      }
    }, [currentPage,totalPages])
    useEffect(() => {
      if(!isLoading && !isUsersLoading){
        const timeoutId = setTimeout(() => {
          setTotalPages(Math.ceil(filteredUsers.length / userPerPage));
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }, [userPerPage])

    useEffect(() => {
      setIsUsersLoading(true);
      getAllUsers()
      .then((res) => {
        if(res){
          setAllUsers(res);
          setFilteredUsers(res);
          setUsersToShow(res.slice((currentPage - 1)* userPerPage, currentPage*userPerPage));
          setTotalPages(Math.ceil(res.length/userPerPage));
        }
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsUsersLoading(false);
      })
    },[])
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const term = event.target.value.toLocaleLowerCase();
      setSearchTerm(term);
      const filtered = userstoShow.filter((item) => 
        item.name?.toLowerCase().includes(term)
      );
      console.log(filtered);
      setFilteredUsers(filtered);
     }
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
                      <input type="text" placeholder="Keress név alapján..." value={searchTerm} onChange={(e) => handleSearch(e)} className="ml-2"/>
                    </div>
                    <button className="h-full w-[15%] place-content-center justify-items-center border hover:bg-gray-200">
                      <IoSearchOutline size={20} className="" />
                    </button>
                  </div>
                  <div className="h-9 place-items-center justify-items-center ml-2 flex flex-row">
                      <p className="text-gray-400">Mutasson</p>
                      <input type="number" placeholder="3" min={1} max={filteredUsers.length} value={userPerPage} onChange={(e) => setUserPerPage(parseInt(e.target.value))} className="w-20 h-full border text-left mx-2 px-2 rounded-md"/>
                      <p className="ml-1 text-gray-400">felhasználót oldalanként</p>
                  </div>
                </div>

                <div className="flex flex-row mr-2 h-9">
                    <div className="h-full place-content-center justify-items-center place-self-center border justify-between flex flex-row">
                      <div className="w-[85%] place-content-center justify-items-center place-self-center">
                        <input type="date" placeholder="Válassz egy napot" value={dateSearch} onChange={(e) => setDateSearch(e.target.value)} className="ml-2"/>
                      </div>
                    </div>
                    <button className="px-4 border mx-2 bg-gray-200 rounded-md hover:bg-gray-500">Szűrő</button>
                    <button className="px-4 bg-[#3410e6] text-white h-full font-light rounded-md">Beküldés</button>
                </div>
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
                      filteredUsers.map((curr) => <UserListCard user={curr} searchTerm={searchTerm}/>)
                    }
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white text-center flex flex-row place-content-center place-items-center justify-items-center">
                {currentPage !== 1 && <button
                    onClick={() => setCurrentPage(currentPage-1)}
                  >
                    <IoIosArrowBack size={20} className="mr-2"/>
                  </button>
                }
                <input type="number" min={1} max={totalPages} value={currentPage}
                  onChange={(e) => 
                    {
                      if(parseInt(e.target.value) > totalPages){
                        setCurrentPage(totalPages);
                      }
                      else{
                        setCurrentPage(parseInt(e.target.value));
                      }
                    }
                  } 
                  className="border border-gray-400 px-1 my-1 w-12"/>
                <p className="ml-1"> / {totalPages ? totalPages : 1} oldal</p>
                { currentPage !== totalPages &&
                  <button 
                    onClick={() => setCurrentPage(currentPage+1)}
                  >
                    <IoIosArrowForward size={20} className="ml-2"/>
                  </button>
                }
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
