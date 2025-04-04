import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllJobsforAdmin, getAllUsersForAdmin } from "@/lib/api";
import { User } from "@/Types/User";
import { Job } from "@/Types/Job";
import { IoSearchOutline } from "react-icons/io5";
import AdminDropDown from "./cards/AdminDropDown";
import UserListCard from "./cards/UserListCard";

/**
 * Az `AdminListPage` komponens egy adminisztrátori felületet jelenít meg,
 * amely lehetővé teszi a felhasználók vagy munkák listájának megjelenítését és kezelését.
 * A komponens tartalmaz egy kereső- és szűrőfunkciót, valamint lehetőséget biztosít
 * az oldalankénti megjelenítendő elemek számának beállítására és az oldal navigálására.
 *
 * @param {Object} props - A komponens bemeneti paraméterei.
 * @param {boolean} props.listUsers - Meghatározza, hogy felhasználókat vagy munkákat listázunk-e.
 *
 * @returns {JSX.Element} A komponens egy adminisztrátori listát jelenít meg a felhasználókról vagy munkákról.
 */
export default function AdminListPage({listUsers} : {listUsers : boolean}){
    const {user,isLoading,isListUser} = useAuth();
    const [isListLoading,setIsListLoading] = useState(true);
    const [searchTerm,setSearchTerm] = useState("");
    const [dateSearch, setDateSearch] = useState<string>();
    const [allContent,setAllContent] = useState<(User |Job)[]>([]);
    const [allFilteredContent,setAllFilteredContent] = useState<(User | Job)[]>([]);
    const [filteredContent,setFilteredContent] = useState<(User | Job)[]>([]);
    const [contentPerPage,setContentPerPage] = useState(50);
    const [totalPages,setTotalPages] = useState(0);
    const [currentPage,setCurrentPage] = useState(1);
    const [refresh,setRefresh] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAdminFilterOpen,setIsAdminFilterOpen] = useState(false);
    const [filterForm, setFilterForm] = useState<{admin : boolean | null}>({
      admin : null,
    });

    // Adatok betöltése és szűrés az oldalszám változásakor
    useEffect(() => {
          if(!isLoading && !isListLoading){
            const users = allFilteredContent.slice(((currentPage? currentPage : 1) - 1) * (contentPerPage ? contentPerPage : 0), (currentPage ? currentPage : 1)*(contentPerPage ? contentPerPage : filteredContent.length))
            setFilteredContent(users);
          }
        }, [currentPage,totalPages]);

    // Az adatok betöltése az API-ból
    useEffect(() => {
        setIsListLoading(true);
          const fetchData = listUsers ? getAllUsersForAdmin() : getAllJobsforAdmin();
          fetchData.then((res) => {
          if(res){
              setAllContent(res);
              setAllFilteredContent(res);
              setFilteredContent(res.slice((currentPage - 1)* contentPerPage, currentPage*contentPerPage));
              setTotalPages(Math.ceil(res.length/contentPerPage));
          }
          })
          .catch((error) => {
            alert(error.message);
          })
          .finally(() => {
            setRefresh(false);
            setIsListLoading(false);
          })
    },[refresh]);

    // A szűrés alapú adatok frissítése
    useEffect(() => {
      if(!isLoading && !isListLoading){
        const timeoutId = setTimeout(() => {
          const pages = Math.ceil(allFilteredContent.length / contentPerPage);
          setTotalPages(pages);
          if(pages < currentPage){
            setCurrentPage(pages);
          }
        }, 500);
        return () => clearTimeout(timeoutId);
      }
    }, [contentPerPage])

    /**
     * A kereső és szűrő logika megvalósítása, amely a felhasználói vagy munkaadatok alapján
     * végzi el a szűrést, figyelembe véve a keresési kifejezést és dátumot.
     *
     * @param {string} event - A keresési kifejezés.
     * @param {Array<User|Job>} allContent - Az összes tartalom (felhasználók vagy munkák).
     * @param {string} [date] - Opcionálisan megadott dátum szűrés.
     */
    const handleSearch = async (event: string, allContent : (User| Job)[], date? : string) => {
        const term = event.toLocaleLowerCase();
        setSearchTerm(term);
        let filtered : (User | Job)[] = [];
        if (await isListUser(allContent)){
          filtered = allContent.filter((item) => {
                const created = (item as User).created.toString().split('T')[0];
                if (date && created !== date){
                  return false;
                }
                if (!date && dateSearch && created !== dateSearch){
                  return false;
                }
                return item.name?.toLowerCase().includes(term) ||
                (item as User).username?.toLowerCase().includes(term);
          });    
        }
        else{
          filtered = allContent.filter((item) => (item as Job).name?.toLowerCase().includes(term) ||
          (item as Job).from?.toLowerCase().includes(term));
        }
        setAllFilteredContent(filtered);
        setFilteredContent(filtered.slice(0,50));
        setTotalPages(Math.ceil(filtered.length/contentPerPage));
    }

    /**
     * A törlés logikája, amely a felhasználókat vagy munkákat törli és frissíti a listát.
     *
     * @param {string | number} id - A törölni kívánt elem azonosítója.
     */
    const handleDeleteWithUpdate = async (id : string | number) => {
        let data : (User | Job)[] = []
        if (listUsers){
            data = allContent.filter((curr) => (curr as User).username != id);
        }
        else{
          data = allContent.filter((curr) => (curr as Job).id != id);
        }
        setAllFilteredContent(data);
        handleSearch(searchTerm,data);
    }
    return (
        <div className="bg-[#0d0b42] h-screen w-screen">
                {(!isLoading && !isListLoading ) ?
                <div className="h-full w-full">
                  <div className="mt-10 w-[95%] h-[12%] place-self-center">
                    <div className="place-self-end flex flex-row">
                      <p className="text-white self-center mr-6 font-bold text-lg">{user?.username}</p>
                      <img src={user?.profileImg} className="h-11 w-11 rounded-full" />
                    </div>
                    <p className="text-white text-3xl">{listUsers? "Felhasználók" : "Lehetőségek"}</p>
                  </div>
                  <div className="bg-gray-200 h-full w-full place-content-center justify-items-center">
                    <div className="w-[95%] h-[92%]">
                      <div className="bg-white w-full h-14 place-items-center flex flex-row justify-between border">
        
                        <div className="flex flex-row">
                          <div className="border ml-2 h-9 w-60 place-content-center justify-items-center flex flex-row rounded-md">
                            <div className="w-[85%] place-content-center justify-items-center place-self-center">
                              <input type="text" placeholder="Keress név alapján..." value={searchTerm} onChange={(e) => {
                                  handleSearch(e.target.value,allContent);
                                  setCurrentPage(1);
                                }} className="ml-2"/>
                            </div>
                            <button className="h-full w-[15%] place-content-center justify-items-center border hover:bg-gray-200">
                              <IoSearchOutline size={20} className="" />
                            </button>
                          </div>
                          <div className="h-9 place-items-center justify-items-center ml-2 flex flex-row">
                              <p className="text-gray-400">Mutasson</p>
                              <input type="number" placeholder="3" min={1} max={allContent.length} value={contentPerPage} onChange={(e) => setContentPerPage(parseInt(e.target.value))} className="w-20 h-full border text-left mx-2 px-2 rounded-md"/>
                              <p className="ml-1 text-gray-400">felhasználót oldalanként</p>
                          </div>
                        </div>
        
                        <div className="flex flex-row mr-2 h-9">
                            <div className="h-full place-content-center justify-items-center place-self-center border justify-between flex flex-row">
                              <div className="w-[85%] place-content-center justify-items-center place-self-center">
                                <input type="date" placeholder="Válassz egy napot" value={dateSearch} onChange={(e) => {
                                  setDateSearch(e.target.value);
                                  handleSearch("",allContent,e.target.value);
                                  }} className="ml-2"/>
                              </div>
                            </div>
                            <div className="relative inline-block h-full place-content-center place-items-start justify-items-center">
                              <button onClick={() => setIsFilterOpen((prev) => !prev)} className="px-4 h-full border mx-2 bg-gray-200 rounded-md hover:bg-gray-500 flex flex-row place-items-center justify-items-center">
                                Szűrő
                                {isFilterOpen? <IoIosArrowUp color="black"/>:<IoIosArrowDown color="black"/>}
                              </button>
                              {isFilterOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-gray-400 text-white opacity-100 border rounded shadow-lg z-60">
                                    <ul className="py-2">
                                        <li className={`px-4 py-2 cursor-pointer flex flex-row w-full justify-between`}>
                                            <div className="relative inline-block">
                                            <div className="flex flex-row cursor-pointer place-content-center justify-items-center place-items-center" 
                                              onClick={() => {
                                                setIsAdminFilterOpen((prev) => !prev); 
                                                if(isAdminFilterOpen) setIsAdminFilterOpen(false);
                                              }}
                                            >
                                              Admin: <span className="text-blue-700 ml-1">{filterForm.admin !== null ? (filterForm.admin ? "Igen" : "Nem") : "-"}</span>
                                              {isAdminFilterOpen ? <IoIosArrowUp color="black" /> : <IoIosArrowDown color="black" />}
                                              {filterForm.admin !== null && <button className="text-red-600" onClick={() => {setFilterForm({...filterForm,admin: null})}}>törlés</button>}
                                            </div>
                                            {isAdminFilterOpen && (
                                              <div className="absolute left-14 mt-2 w-30 bg-gray-400 text-white opacity-100 border rounded shadow-lg z-50">
                                                  <ul className="py-2">
                                                      {filterForm.admin !== true && <AdminDropDown 
                                                        title="Igen"
                                                        handleFilter={() => setFilterForm((prev) => ({...prev, admin: true}))}
                                                        handleForm={() => setIsAdminFilterOpen((prev) => !prev)}
                                                      />}
                                                      {filterForm.admin !== false && <AdminDropDown 
                                                        title="Nem"
                                                        handleFilter={() => setFilterForm((prev) => ({...prev, admin: false}))}
                                                        handleForm={() => setIsAdminFilterOpen((prev) => !prev)}
                                                      />}
                                                  </ul>
                                              </div>
                                            )}
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                              )}
                          </div>
                            <button 
                              className="px-4 bg-[#3410e6] text-white h-full font-light rounded-md"
                              onClick={() => handleSearch(searchTerm,allContent)}
                            >
                              Beküldés
                            </button>
                        </div>
                      </div>
        
                      <div className="mt-3">
                        <div className="w-full max-h-[60vh] overflow-y-scroll border">
                          <table className="w-full ">
                            <thead className="bg-gray-100 ">
                              <tr className="h-12">
                                <td className="w-[2%]"></td>
                                <td className="font-semibold w-[15%]">Név</td>
                                <td className="font-semibold w-[15%]">{listUsers? "Felhasználónév" : "Készítette"}</td>
                                <td className="font-semibold w-[10%]">{listUsers? "Email" : "Helyszín"}</td>
                                <td className="font-semibold w-[5%]">{listUsers? "Admin" : "Létszám"}</td>
                                <td className="font-semibold w-[6%]">Készült</td>
                                <td className="font-semibold w-[5%]">Törlés</td>
                                <td className="font-semibold w-[6%]">Szerkesztés</td>
                                <td className="font-semibold w-[5%]">Elvetés</td>
                                <td className="w-[2%]"></td>
                              </tr>
                            </thead>
                            <tbody className="bg-gray-50">
                            {
                              filteredContent.map((curr) => 
                              <UserListCard 
                                key={curr.id}  
                                user={curr} 
                                searchTerm={searchTerm} 
                                onDelete={(id : string | number) => handleDeleteWithUpdate(id)}
                                onUpdate={() => setRefresh(true)}/>
                              )
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
                              if(parseInt(e.target.value) > totalPages || !totalPages){
                                setCurrentPage(totalPages);
                              }
                              else{
                                setCurrentPage(parseInt(e.target.value));
                              }
                            }
                          } 
                          className="border border-gray-400 px-1 my-1 w-12"/>
                        <p className="ml-1"> / {totalPages ? totalPages : 1} oldal</p>
                        {currentPage !== totalPages &&(
                          <button 
                            onClick={() => setCurrentPage(currentPage+1)}
                          >
                            <IoIosArrowForward size={20} className="ml-2"/>
                          </button>)
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