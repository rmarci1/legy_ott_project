import Constants from 'expo-constants'

const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
const API_URL = `http://${debuggerHost}:3000`;

/**
 * Felhasználó regisztrálása
 *
 * @param {string} name - A felhasználó neve
 * @param {string} username - A felhasználó felhasználóneve
 * @param {string} email - A felhasználó email címe
 * @param {string} password - A felhasználó jelszava
 *
 * @returns {Promise<any>} - A szervertől kapott válasz adatokat
 * @throws {Error} - Ha a jelszavak nem egyeznek, vagy a szerver hibát ad.
 */
export const register = async (name,username, password, email)=> {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name,username, password,email}),
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }
        return data;
    } 
    catch (error) {
        throw new Error(error.message);
    }
};
/**
 * Felhasználó bejelentkezése
 *
 * @param {string} email - A felhasználó emaile
 * @param {string} password - A felhasználó jelszava
 *
 * @returns {Promise<any>} - A bejelentkezett felhasználó adatai
 * @throws {Error} - Ha a bejelentkezés nem sikerül.
 */
export const pflogin = async (email,password) => {  
    try{
        console.log("happeb");
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password}),
            credentials: 'include',
        })
        const data = await response.json();
        if (!response.ok) {
            throw new Error(typeof data.message === 'string' ? data.message : data.message[0]);
        };
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Ellenőrzi, hogy a felhasználó be van-e jelentkezve
 *
 * @returns {Promise<any>} - A felhasználó profiladatait
 * @throws {Error} - Ha a felhasználó nincs bejelentkezve.
 */
export const getUser = async () => {
    try{ 
        const response = await fetch(`${API_URL}/auth/check-auth`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message)
        }   
        return data; 
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Elérhető munkák lekérése
 *
 * @returns {Promise<any>} - Az elérhető munkák listáját
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const getJobs = async () => {
    try{     
        const response = await fetch(`${API_URL}/jobs/available`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials:'include'
        });
        const data = response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error);
    }
}
/**
 * Egy munka képének frissítése
 *
 * @param {number} jobId - A munkának a fő kulcsa
 * @param {string} img - Egy kép uri formátumban
 * @returns {Promise<any>} - A szervertől kapott válasz adatokat
 * @throws {Error} - Ha a frissítés nem sikerült.
 */
export const UpdateJobPic = async (jobId,img) => {
    try{
        const formData = new FormData();
        formData.append('file', {uri : img, type: "image/png", name: "upload.img"});
        const xhr = new XMLHttpRequest();

        return new Promise((resolve,reject) => {
            xhr.onreadystatechange = e => {
                if (xhr.readyState !== 4) {
                  return;
                }
                if (xhr.status === 201 || xhr.status === 0) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject("Request Failed");
                }
              };
              xhr.open("POST", `${API_URL}/jobs/${jobId}/updateJobPic`);
              xhr.setRequestHeader('Content-Type', 'multipart/form-data');
              xhr.send(formData);  
        }).catch((error) => {
            throw new Error(error);
        })
    }
    catch(error){
        throw new Error(error)
    }
}
/**
 * Profilkép frissítése
 *
 * @param {string} img - Egy kép uri formátumban
 * @returns {Promise<any>} - A szervertől kapott válasz adatokat
 * @throws {Error} - Ha a frissítés nem sikerült.
 */
export const UpdateProfilePic = async (img) => {
    try{
        const formData = new FormData();
        formData.append('file', {uri : img, type: "image/png", name: "upload.img"});
        const xhr = new XMLHttpRequest();

        return new Promise((resolve,reject) => {
            xhr.onreadystatechange = e => {
                if (xhr.readyState !== 4) {
                  return;
                }
                if (xhr.status === 201 || xhr.status === 0) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject("Request Failed");
                }
              };
              xhr.open("POST", `${API_URL}/profiles/uploadProfilePic`);
              xhr.setRequestHeader('Content-Type', 'multipart/form-data');
              xhr.send(formData);  
        }).catch((error) => {
            throw new Error(error);
        })
    }
    catch(error){
        throw new Error(error)
    }
}
/**
 * Munkák szűrése név alapján
 *
 * @param {string} name - A munkának a neve
 * @param {string} username - A felhasználónak a felhasználóneve
 * @returns {Promise<any>} - Olyan munkákat aminek nek a nevükben benne van a "name" változó
 * @throws {Error} - Ha a keresés nem sikerült.
 */
export const FilterJobsByName = async (name,username) => {
    try{
        const response = await fetch(`${API_URL}/jobs/filter/name`,{
            method : 'POST',
            headers: {'Content-Type' : "application/json"},
            body: JSON.stringify({name,username}),
            credentials: "include",
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }   
        return data;
    }   
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Hirdetések fajtáinak lekérdezése
 *
 * @param {string} endpoint - A végpontnak az egyik fajtája ami vagy lehet (archived | ads | selected vagy savedForLater).
 * @returns {Promise<any>} - A keresett munkákat.
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const getAdvertisement = async (endpoint) => {
    try{
        const response = await fetch(`${API_URL}/jobs/${endpoint}`,{
            method: 'GET',
            credentials : 'include'
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Munka létrehozása
 *
 * @param {Object} job - A munka amit létreakarunk hozni
 * @returns {Promise<any>} - A létrehozott munkát.
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const createJob = async (job) => {
    try{
        const sendJob = {...job, max_attending: parseInt(job.max_attending)};
        const response = await fetch(`${API_URL}/jobs`,{
            method : "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sendJob),
            credentials: "include"
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }   
        await UpdateJobPic(data.id,job.img);
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy hirdetés elmentésének értékének állítása
 *
 * @param {boolean} update - A hirdetés elmentett értéke
 * @returns {Promise<any>} - A frissített munkát.
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const updateSaved = async (update, jobId) => {
    try{
        const response = await fetch(`${API_URL}/jobs/updateSave/${jobId}`,{
            method : 'PATCH',
            headers: {'Content-Type' : "application/json"},
            body: JSON.stringify({update}),
            credentials: "include"
        });
        const data = response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy profil megtekintése
 *
 * @param {string} username - A keresett felhasználónak a felhasználóneve
 * @returns {Promise<any>} - A keresett felhasználót.
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const getProfileView = async (username) => {
    try{
        const response = await fetch(`${API_URL}/profiles/view/${username}`,{
            method: 'GET',
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        };
        return data;
    }
    catch(error){
        throw new Error(error.message)
    }
}
/**
 * Egy felhasználóhóz tartózó értékelések lekérdezése
 *
 * @param {string} username - A keresett felhasználónak a felhasználóneve
 * @returns {Promise<any>} - A frissített munkát.
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const getReviews = async (username) => {
    try{
        const response = await fetch(`${API_URL}/reviews/${username}`,{
            method: "GET",
            credentials: "include"
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy felhasználóhóz tartózó átlagos értékelések értékének lekérdezése
 *
 * @param {string} username - A keresett felhasználónak a felhasználóneve
 * @returns {Promise<number>} - Az átlagos értékelések értékét
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const getAverageRating = async (username) => {
    try{
        const response = await fetch(`${API_URL}/reviews/average/${username}`,{
            method: "GET",
            credentials: "include"
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data?._avg.review;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy értékelés létrehozása
 * 
 * @param {Object} review - Az értékelés
 * @param {string} username - A keresett felhasználónak a felhasználóneve
 * @returns {Promise<any>} - A létrehozott értékelést
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const createReview = async (review,username) => {
    try{
        const response = await fetch(`${API_URL}/reviews/add/${username}`,{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({...review}),
            credentials: 'include'
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy értékelés létrehozása
 * 
 * @param {Object} update - Azt az értéket tartalmazza amit a felhasználó szeretne megváltoztatni a profilján
 * @returns {Promise<any>} - A frisített profilt
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const updateProfile = async (update) => {
    try{
        const response = await fetch(`${API_URL}/profiles`,{
            method: 'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(update),
            credentials: "include"
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Felhasználó értékelés jogosultságának kezelése
 * 
 * @param {string} username - A felhasználónak a felhasználóneve
 * @returns {Promise<boolean>} - A felhasználó tud-e értékelést készíteni
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const getCanReview = async (username) => {
    try{
        const response = await fetch(`${API_URL}/jobs/review/${username}`,{
            method: 'GET',
            credentials: 'include'
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}   
/**
 * Egy adott munkára való jelentkezés vagy lemondása
 * 
 * @param {number} jobId - A munkának a fő kulcsa
 * @param {number} update - A jelentkezés értéke
 * @returns {Promise<any>} - A frissített hirdetést
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const attending = async (jobId, update) => {
    try{
        const response = await fetch(`${API_URL}/jobs/attend/${jobId}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({update}),
            credentials: 'include'
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy adott munka értékeinek frissítése
 * 
 * @param {number} jobId - A munkának a fő kulcsa
 * @param {number} update - A frissíteni kívánt mezők értékei
 * @returns {Promise<any>} - A frissített hirdetést
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const updateJob = async (jobId,update) => {
    try{
        const response = await fetch(`${API_URL}/jobs/${jobId}`,{
            method : 'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(update),
            credentials : "include"
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy adott munka törlése
 * 
 * @param {number} jobId - A munkának a fő kulcsa
 * @param {number} from - Akitől származik a munka annak a felhasználóneve
 * @returns {Promise<any>} - A frissített hirdetést
 * @throws {Error} - Ha a kérés nem sikerült.
 */
export const deleteJob = async (jobId,from) => {
    try{
        const response = await fetch(`${API_URL}/jobs/${jobId}/${from}`,{
            method: 'DELETE',
            credentials: 'include'
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message);
        }
    }
    catch(error){
        throw new Error(error.message);
    }
}
/**
 * Egy felhasználó kijelentkeztetése
 *
 * @returns {Promise<void>} - Az ígérete, hogy a felhasználó sikeresen ki lett léptetve.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const logout = async () => {
    try{
        const response = await fetch(`${API_URL}/auth/logout`,{
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(),
            credentials: 'include'
        })
        const data = await response.json();
        if (!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message)
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
export const getMessages = async (senderId,receiverId) => {
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
    catch(error){
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
export const createMessage = async (message) => {
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
    catch(error){
        throw new Error(error);
    }    
}
/**
 * Lekéri a különböző profilokat a csevegéshez.
 *
 * @param {number} userId - A felhasználó azonosítója.
 * @returns {Promise<any>} - A különböző profilokat tartalmazó ígérete.
 * @throws {Error} - Hibát dob, ha a kérés nem sikerül.
 */
export const getDifferentProfiles = async (userId) => {
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
    catch(error){
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
    catch(error){
        throw new Error(error);
    }   
}