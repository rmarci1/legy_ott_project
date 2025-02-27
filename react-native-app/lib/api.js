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
        throw new Error(error);
    }
}
export const GetProfilePic = async (profile) => {
    try{
        const response = await fetch(`${API_URL}/profilePic`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials:'include'
        });
        const data = response.blob();
        return data;
    }
    catch(error){
        throw new Error(error.message)
    }
}
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
            console.log(error);
        })
    }
    catch(error){
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
        const response = await fetch(`${API_URL}/jobs/archived/${username}`,{
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
export const getApplied = async (username) => {
    try{
        const response = await fetch(`${API_URL}/jobs/selected/${username}`,{
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
export const createJob = async (job,username) => {
    try{
        const response = await fetch(`${API_URL}/jobs`,{
            method : "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date:new Date(job.date), ...job}),
            credentials: "include"
        })
        const data = await response.json();
        if(!response.ok){
            throw new Error(typeof data.message == "string" ? data.message : data.message[0])
        }   
        await UpdateProfilePic(data.id,job.img);
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}
export const updateSaved = async (update, jobId,profileId, username) => {
    try{
        const response = await fetch(`${API_URL}/jobs/updateSave/${jobId}/${profileId}/${username}`,{
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
export const createReview = async (username,review) => {
    try{
        const response = await fetch(`${API_URL}/reviews/add/${username}`,{
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({review}),
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