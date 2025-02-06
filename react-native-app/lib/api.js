import images from "@/constants/images";

//const API_URL = 'http://192.168.11.82:3000' // webváltó host nete;
const API_URL = 'http://192.168.10.89:3000' // webváltó ethernet;
//const API_URL = 'http://192.168.11.142:3000' // webváltó alap wifi;
export const register = async (name,username, password, email)=> {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name,username, password,email}),
            credentials: 'include',
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.message);
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }
        return data;
    } catch (error) {
        console.error("1 Fetch error:", error);
        throw new Error(error.message);
    }
};
export const pflogin = async (email,password) => {
    try{
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password}),
            credentials: 'include',
        })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(typeof data.message === 'string' ? data.message : data.message[0]);
            }
            return data;
    }
    catch(error){
        console.error("2 Fetch error:", error.message);
        throw new Error(error.message);
    }
}
export const registerpart1 = async (email,password,passwordAgain) => {
    try{
        const response = await fetch(`${API_URL}/reg1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email,password,passwordAgain}),
            credentials: 'include'
        })
        console.log(response.ok);
        const data = await response.json();
        if(!response.ok){
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }   
        return data;
    }
    catch(error){
        console.log(error);
        throw new Error(error.message);
    }
}
export const getUser = async () => {
    try{ 
        const response = await fetch(`${API_URL}/check-auth`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(),
            credentials: 'include'
        });
        const data = await response.json();
        console.log(data);
        if(!response.ok){
            throw new Error(data.message)
        }   
        return data; 
    }
    catch(error){
        console.log(error);
        throw new Error(error.message);
    }
}
export const GetProfilePic = async (profile) => {
    try{
        console.log("Fetching...")
        const response = await fetch(`${API_URL}/profilePic`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials:'include'
        });
        const data = response.blob();
        return data;
    }
    catch(error){
        console.log(error.message);
        throw new Error(error.message)
    }
}
export const CreateProfilePic = async (username,base64) => {
    try{
        const response = await fetch(`${API_URL}/profiles/${username}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({newProfilePic : base64}),
            credentials:'include'
        });
    }
    catch(error){
        throw new Error(error.message)
    }
}
export const getJobs = async () => {
    try{
        const response = await fetch(`${API_URL}/jobs`,{
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
        console.log(error);
        throw new Error(error);
    }
}