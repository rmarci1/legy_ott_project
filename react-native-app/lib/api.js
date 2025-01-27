const API_URL = 'http://192.168.11.82:3000';

export const register = async (name,username, password, email)=> {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name,username, password,email}),
            credentials: 'include',
        });
        console.log(response.ok);
        const data = await response.json();
        if (!response.ok) {
            console.log(data.message);
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }
        console.log(data);
        return data;
    } catch (error) {
        console.error("1 Fetch error:", error);
        throw error;
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
        throw error;
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
        const data = await response.json();
        if(!response.ok){
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }   
        return data;
    }
    catch(error){
        console.log(error);
        throw error;
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
        throw error;
    }
}
export const blob = async () => {
    try{
        const response = await fetch(`${API_URL}/profilePic`,{
            method: 'GET',
            credentials:'include'
        });
        const blob = await response.blob();
        return blob;
    }
    catch(error){
        throw new Error(error.message)
    }
}