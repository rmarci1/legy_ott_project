//const API_URL = 'http://192.168.11.82:3000' // webváltó host nete;
//const API_URL = 'http://192.168.10.89:3000' // webváltó ethernet;
//const API_URL = 'http://192.168.11.142:3000' // webváltó alap wifi;
const API_URL = 'http://192.168.0.179:3000' // 

import React from 'react'
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';

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
/*export const CreateProfilePic = async (username,img) => {
    try{
        const convert = await fetch(img);
        console.log(convert);
        const blob = await convert.blob();
        const formData = new FormData();

        formData.append('file', blob);
        
        console.log("Fetching...");

        const response = await fetch(`${API_URL}/profiles/${username}/uploadProfilePic`,{
            method: 'POST',
            headers: {'Content-Type' : 'multipart/form-data'},
            body: formData,
        });
    }
    catch(error){
        console.log(error.message);
        throw new Error(error.message)
    }
}*/
export const CreateProfilePic = async (kep) => {

  const cld = new Cloudinary({ cloud: { cloudName: 'drg0zbnak' } });
  const img = cld
        .image(kep)
        .format('auto')
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500));
  return (<AdvancedImage cldImg={img}/>);

};
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