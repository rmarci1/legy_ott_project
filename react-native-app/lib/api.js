const API_URL = 'http://192.168.11.82:3000';

export const register = async (name,username, password, email)=> {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name,username, password,email}),
            credentials: 'include',
          })

        if (!response.ok) {
            response.json().then(err => {
                throw new Error(err.message)
            })
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
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
        if(!response.ok){
            throw new Error(data.message[0])
        }   

        return data;
    }
    catch(error){
        console.error("Fetch error:", error.message);
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


    return data;
}