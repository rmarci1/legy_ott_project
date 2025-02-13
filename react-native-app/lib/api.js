//const API_URL = 'http://192.168.11.82:3000' // webváltó host nete;
const API_URL = 'http://192.168.10.89:3000' // webváltó ethernet;
//const API_URL = 'http://192.168.11.142:3000' // webváltó alap wifi;

import * as SecureStore from 'expo-secure-store';

export const getToken = async () => {
    return await SecureStore.getItemAsync('jwtToken');
}
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
        console.log(response);
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
        SecureStore.setItemAsync('jwtToken',data.access_token);
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
export const getUser = async (token) => {
    try{ 
        const response = await fetch(`${API_URL}/auth/check-auth`,{
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization' : `Bearer ${token}`},
            body: JSON.stringify(),
            credentials: 'include'
        });
        const data = await response.json();
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
export const getJobs = async (username) => {
    try{     
        const response = await fetch(`${API_URL}/jobs/available/${username}`,{
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
export const CreateProfilePic = async (username,img) => {
    try{
        /*const convert = await fetch(img);
        const blob = await convert.blob();*/
        const formData = new FormData();
        console.log(username);
        console.log(img);
        formData.append('file', {uri : img, type: "image/png", name: "upload.img"});
        const xhr = new XMLHttpRequest();

        return new Promise((resolve,reject) => {
            xhr.onreadystatechange = e => {
                if (xhr.readyState !== 4) {
                  return;
                }
                console.log(xhr.status);
                console.log(xhr.responseText);
                if (xhr.status === 201 || xhr.status === 0) {
                  resolve(JSON.parse(xhr.responseText));
                } else {
                  reject("Request Failed");
                }
              };
              xhr.open("POST", `${API_URL}/profiles/${username}/uploadProfilePic`);
              xhr.setRequestHeader('Content-Type', 'multipart/form-data');
              xhr.send(formData);  
        }).catch((error) => {
            console.log(error);
        })
        console.log("Fetching...");

        const response = await fetch(`${API_URL}/profiles/${username}/uploadProfilePic`,{
            method: 'POST',
            headers: {'Content-Type' : 'multipart/form-data'},
            body: formData,
        });
    }
    catch(error){
        console.log(error);
        throw new Error(error)
    }
}
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
export const getHistorys = async (username) => {
    try{

    }   
    catch(error){
        throw new Error(error.message);
    }
}
export const getSaved = async (username) => {
    try{
        const response = await fetch(`${API_URL}/jobs/savedForLater/${username}`,{
            method : "GET",
            credentials: "include",
        });
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
export const createJob = async (job) => {
    try{
        const response = await fetch(`${API_URL}/jobs`,{
            method : "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({job}),
            credentials: "include"
        })
    }
    catch(error){
        throw new Error(error.message);
    }
}
/*export const CreateProfilePic = async (kep) => {
    console.log(kep);
    try{
        const signResponse = await fetch(`${API_URL}/profiles/test/test`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({text : "test12"}),    
        });
        const test = await signResponse.json();
        console.log(test);
        const {signature,timestamp,api_key} = test;
        console.log(api_key);
        const data = new FormData();
        data.append("file", {uri : kep, type: "image/png", name: "upload.jpg"});
        data.append("api_key",api_key);
        data.append("timestamp",timestamp);
        data.append("signature", signature);
        const response = await fetch("https://api.cloudinary.com/v1_1/drg0zbnak/image/upload", {
            method: "POST",
            body: data,
        });
        const result = await response.json();
        console.log(result);
        return result.secure_url;
    }
    catch(error){
        console.log(error.message)
        throw new Error(error.message);
    }
};*/