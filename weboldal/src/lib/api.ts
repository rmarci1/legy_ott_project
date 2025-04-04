import { UpdateUser } from "@/Types/UpdateUser";
import {Job} from "@/Types/Job.ts";

// API alap URL
const API_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

/**
 * Felhasználó regisztrálása
 *
 * @param name - A felhasználó neve
 * @param username - A felhasználó felhasználóneve
 * @param email - A felhasználó email címe
 * @param password - A felhasználó jelszava
 * @param password2 - A felhasználó jelszó megerősítése
 *
 * @returns A szervertől kapott válasz adatokat
 * @throws Ha a jelszavak nem egyeznek, vagy a szerver hibát ad.
 */
export const register = async (
  name: string,
  username: string,
  email: string,
  password: string,
  password2: string
) => {
    if (password !== password2) {
      throw new Error("Nem egyeznek a jelszavak.");
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        typeof data.message === 'string' ? data.message : data.message[0]
      );
    }

    return data;
};

/**
 * Felhasználó bejelentkezése
 *
 * @param login - Felhasználónév vagy email
 * @param password - A felhasználó jelszava
 * @param loginMode - Bejelentkezési mód ("email" vagy "username")
 *
 * @returns A bejelentkezett felhasználó adatai
 * @throws Ha a bejelentkezés nem sikerül.
 */
export const pflogin = async (
  login: string,
  password: string,
  loginMode: string
) => {
    let response: any;
    const email = login;
    const username = login;

    response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: loginMode == "email" ? JSON.stringify({ email, password }) : JSON.stringify({ username, password }),
      credentials: 'include',
    })

    const data = await response.json();


    if (!response.ok) {
      throw new Error(
        typeof data.message === 'string' ? data.message : data.message[0]
      );
    }
    return data;
};

/**
 * Ellenőrzi, hogy a felhasználó be van-e jelentkezve
 *
 * @returns A felhasználó profiladatait
 * @throws Ha a felhasználó nincs bejelentkezve.
 */
export const getUser = async () => {
    const response = await fetch(`${API_URL}/auth/check-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message as string);
    }
    return {profile: data};
};

/**
 * Összes munkát lekéri
 *
 * @returns Az összes munkát tartalmazó adatokat
 * @throws Ha a kérés nem sikerült.
 */

export const getAllJobs = async () =>{
    const res = await fetch(`${API_URL}/jobs`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}
/**
 * Admin számára az összes munka lekérése
 *
 * @returns Az admin által elérhető összes munka adatai
 * @throws Ha a kérés nem sikerült.
 */
export const getAllJobsforAdmin = async () => {
    const res = await fetch(`${API_URL}/admin/allJobs`, {
      method: 'GET',
      credentials: "include"
    })
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message as string);
    }
    return data;
}

/**
 * Elérhető munkák lekérése
 *
 * @returns Az elérhető munkák listáját
 * @throws Ha a kérés nem sikerült.
 */
export const getAvailableJobs = async () =>{
    const response = await fetch(`${API_URL}/jobs/available`, {
      method: 'GET',
      credentials: 'include',
    })

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Profilkép frissítése
 *
 * @param formData - A képfájl adatokat tartalmazó `FormData`
 * @returns A szervertől kapott válasz adatokat
 * @throws Ha a frissítés nem sikerült.
 */
export const profilePicChange = async (formData: FormData) => {
    const result = await fetch(`${API_URL}/profiles/uploadProfilePic`,
        {
          body: formData,
          method: "post",
          credentials: "include"
        });

    const data = await result.json()

    if (!result.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Munka mentése későbbi időpontra
 *
 * @param jobId - A menteni kívánt munka azonosítója
 * @param update - Ha `true`, akkor frissíti a mentés állapotát
 * @returns A frissített mentési állapot
 * @throws Ha a kérés nem sikerült.
 */
export const saveForLater = async (jobId: number, update: boolean) => {
    const res = await fetch(`${API_URL}/jobs/updateSave/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({update}),
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Frissíti egy adott állás részvételi státuszát.
 *
 * @param {number} id - Az állás azonosítója.
 * @param {boolean} update - Egy logikai érték, amely azt jelzi, hogy frissíteni kell-e a részvételt.
 * @returns {Promise<any>} - Az API válaszadatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const attend = async (id: number, update: boolean) => {
    const res = await fetch(`${API_URL}/jobs/attend/${id}`,{
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({update}),
      credentials: "include"

    })


    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Lekéri egy felhasználó profilját.
 *
 * @param {string} username - A felhasználó neve.
 * @returns {Promise<any>} - A felhasználó profiljának adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getProfile = async (username: string) => {
    const res = await fetch(`${API_URL}/profiles/view/${username}`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Kilépteti a felhasználót.
 *
 * @returns {Promise<void>} - Az ígérete, hogy a felhasználó sikeresen ki lett léptetve.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const logout = async () => {
  try{
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: "include"
    })
  }
  catch (e: any){
    throw new Error(e.message)
  }
}
/**
 * Lekéri a felhasználó kiválasztott állásait.
 *
 * @returns {Promise<any>} - Az állások adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getSelectedJobs = async () => {
    const res = await fetch(`${API_URL}/jobs/selected/`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Lekéri a hirdetett állásokat.
 *
 * @returns {Promise<any>} - Az állások adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getAdvertised = async () => {
    const res = await fetch(`${API_URL}/jobs/ads/`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Lekéri a későbbre elmentett állásokat.
 *
 * @returns {Promise<any>} - Az állások adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getSavedForLater = async () => {
    const res = await fetch(`${API_URL}/jobs/savedForLater/`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }
    return data;
}
/**
 * Lekéri az archívált állásokat.
 *
 * @returns {Promise<any>} - Az állások adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getArchivedJobs = async () => {
    const res = await fetch(`${API_URL}/jobs/archived/`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Lekéri az archívált hirdetett állásokat.
 *
 * @returns {Promise<any>} - Az állások adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getArchivedAds = async () => {
    const res = await fetch(`${API_URL}/jobs/archivedAds/ `, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}
/**
 * Lekéri egy felhasználó átlag értékelését.
 *
 * @param {string} username - A felhasználó neve.
 * @returns {Promise<any>} - Az átlagos értékelés adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getAverageRating = async (username: string) => {
    const res = await fetch(`${API_URL}/reviews/average/${username} `, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Lekéri az adminisztrátor statisztikához kellő adatait.
 *
 * @returns {Promise<any>} - Az admin irányítópult adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getDashBoardDatas = async () => {
    const response = await fetch(`${API_URL}/admin/dashboard`,{
      method: 'GET',
      credentials: 'include'
    })
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.message);
    }
    return data;
}

/**
 * Lekéri az összes felhasználói profil adatokat adminisztrátor számára.
 *
 * @returns {Promise<any>} - Az összes felhasználói profil adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getAllUsersForAdmin = async () => {
  const response = await fetch(`${API_URL}/admin/allProfiles`,{
    method: 'GET',
    credentials: 'include'
  })
  const data = await response.json();
  if(!response.ok){
    throw new Error(data.message);
  }
  return data;
}

/**
 * Frissíti egy felhasználó adatait adminisztrátor számára.
 *
 * @param {UpdateUser} fields - A felhasználó frissítendő adatai.
 * @param {string} username - A felhasználó neve.
 * @returns {Promise<any>} - A frissített felhasználói adatokat tartalmazó ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const updateUserByAdmin = async (fields : UpdateUser, username : string) => {
    const response = await fetch(`${API_URL}/admin/updateUser/${username}`,{
      method: 'PATCH',
      headers: {'Content-Type' : "application/json"},
      body: JSON.stringify(fields),
      credentials: 'include'
    })
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.message);
    }
    return data;
}

/**
 * Az adminisztrátor törli egy felhasználó profilját.
 *
 * @param {string} username - A felhasználó neve.
 * @returns {Promise<any>} - A törlés sikerességét jelző ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const deleteUserByAdmin = async (username : string) => {
    const response = await fetch(`${API_URL}/admin/deleteUser/${username}`,{
      method: "DELETE", 
      credentials: "include"
    });
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.message);
    }
    return data;
}


/**
 * Az adminisztrátor töröl egy állásajánlatot .
 *
 * @param {number} jobId - Az állás azonosítója.
 * @returns {Promise<any>} - A törlés sikerességét jelző ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const deleteJobByAdmin = async (jobId: number) => {
    const response = await fetch(`${API_URL}/admin/deleteJob/${jobId}`,{
      method: "DELETE", 
      credentials: "include"
    });
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.message);
    }
    return data;
}

/**
 * Hozzáad egy új értékelést.
 *
 * @param {string} reviewed_un - Az értékelt felhasználó neve.
 * @param {string} desc - Az értékelés leírása.
 * @param {number} review - Az értékelés számszerű értéke.
 * @returns {Promise<any>} - Az értékelés adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const createReview = async (reviewed_un: string, desc: string, review: number) => {
    const res = await fetch(`${API_URL}/reviews/add `, {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewed_un, desc, review })
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Ellenőrzi, hogy a felhasználó értékelhet-e egy állást.
 *
 * @param {string} username - A felhasználó neve.
 * @returns {Promise<any>} - Az értékelés lehetőségének adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const canReview = async (username: string) => {
    const res = await fetch(`${API_URL}/jobs/review/${username} `, {
      method: 'GET',
      credentials: "include",
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Létrehoz egy új álláshirdetést.
 *
 * @param {string} name - Az állás neve.
 * @param {Date} date - Az állás kezdete.
 * @param {string} description - Az állás leírása.
 * @param {string} img - Az álláshoz tartozó kép URL-je.
 * @param {number} max_attending - A maximálisan jelentkezhető személyek száma.
 * @param {string} address - Az állás helyszíne.
 * @returns {Promise<any>} - Az új álláshirdetés adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const createAdv = async (name: string, date: Date, description: string, img: string, max_attending: number, address: string) => {
    const res = await fetch(`${API_URL}/jobs `, {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, date, description, img, max_attending, address })
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Frissíti egy állás hirdetéséhez tartozó képet.
 *
 * @param {FormData} formData - Az új képet tartalmazó form data.
 * @param {number} id - Az állás azonosítója.
 * @returns {Promise<any>} - A képcsere sikerességét jelző ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const jobPicChange = async (formData: FormData, id: number) => {
    const result = await fetch(`${API_URL}/jobs/${id}/updateJobPic`,
        {
          body: formData,
          method: "POST",
          credentials: "include"
        });

    const data = await result.json()

    if (!result.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Töröl egy álláshirdetést.
 *
 * @param {number} id - Az állás azonosítója.
 * @returns {Promise<any>} - A törlés sikerességét jelző ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const deleteJob = async (id: number) => {
    const result = await fetch(`${API_URL}/jobs/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        });

    const data = await result.json()

    if (!result.ok) {
      throw new Error(data.message as string);
    }

    return data;
}

/**
 * Frissíti a felhasználó profilját.
 *
 * @param {Partial<UpdateUser>} attributes - A profil frissítendő adatai.
 * @returns {Promise<any>} - A frissített profil adatainak ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const updateProfile = async (attributes: Partial<UpdateUser>) => {
  const result = await fetch(`${API_URL}/profiles`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(attributes)
      });

  const data = await result.json()

  if (!result.ok) {
    throw new Error(data.message as string);
  }

  return data;
}

/**
 * Frissíti egy álláshirdetés adatait.
 *
 * @param {Partial<Job>} attributes - Az állás frissítendő adatai.
 * @param {number} id - Az állás azonosítója.
 * @returns {Promise<any>} - A frissített állásadatokat tartalmazó ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const updateJob = async (attributes: Partial<Job>, id: number) => {
    const result = await fetch(`${API_URL}/jobs/${id}`,
        {
            method: "PATCH",
            credentials: "include",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(attributes)
        });

    const data = await result.json()

    if (!result.ok) {
        throw new Error(data.message as string);
    }

    return data;
}

/**
 * Lekéri a különböző profilokat a csevegéshez.
 *
 * @param {number} userId - A felhasználó azonosítója.
 * @returns {Promise<any>} - A különböző profilokat tartalmazó ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getDifferentProfiles = async (userId: number) => {
  try{
      const response = await fetch(`${API_URL}/chat/different/${userId}`,{
          method: 'GET',
          credentials: 'include'
      })
      const data = await response.json();
      if (!response.ok){
          throw new Error(typeof data.message == "string" ? data.message : data.message[0]);
      }
      return data;
  }
  catch(error : any){
      throw new Error(error);
  }   
}

/**
 * Lekéri az üzeneteket két felhasználó között.
 *
 * @param {number} senderId - A küldő felhasználó azonosítója.
 * @param {number} receiverId - A fogadó felhasználó azonosítója.
 * @returns {Promise<any>} - Az üzeneteket tartalmazó ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getMessages = async (senderId : number,receiverId: number) => {
  try{
      const response = await fetch(`${API_URL}/chat/messages/${senderId}/${receiverId}`,{
          method: 'GET',
          credentials: 'include'
      })
      const data = await response.json();
      if (!response.ok){
          throw new Error(data.message);
      }
      return data;
  }
  catch(error : any){
      throw new Error(error.message)
  }
}
/**
 * Üzenetet küld két felhasználó között.
 *
 * @param {Object} message - Az üzenet adatai.
 * @param {number} message.senderId - Az üzenetet küldő felhasználó azonosítója.
 * @param {number} message.receiverId - Az üzenetet fogadó felhasználó azonosítója.
 * @param {string} message.content - Az üzenet tartalma.
 * @returns {Promise<any>} - Az üzenet küldésének eredménye.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const createMessage = async (message : {senderId: number, receiverId: number, content : string}) => {
  try{
      const response = await fetch(`${API_URL}/chat/send`,{
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({senderId : message.senderId, receiverId: message.receiverId, content:message.content}),
          credentials: 'include'
      })
      const data = await response.json();
      if (!response.ok){
          throw new Error(typeof data.message == "string" ? data.message : data.message[0]);
      }
      return data;
  }
  catch(error : any){
      throw new Error(error);
  }    
}
/**
 * Lekéri az összes felhasználói profilt.
 *
 * @returns {Promise<any>} - Az összes felhasználói profil adatait tartalmazó ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getAllProfiles = async () => {
  try{
      const response = await fetch(`${API_URL}/profiles`,{
          method: 'GET',
          credentials: 'include'
      })
      const data = await response.json();
      if (!response.ok){
          throw new Error(typeof data.message == "string" ? data.message : data.message[0]);
      }
      return data;
  }
  catch(error : any){
      throw new Error(error);
  }   
}



