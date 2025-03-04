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
export const getHistorys = async () => {
    try{
        const response = await fetch(`${API_URL}/jobs/archived`,{
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
export const getApplied = async () => {
    try{
        const response = await fetch(`${API_URL}/jobs/selected`,{
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
export const getSaved = async () => {
    try{
        const response = await fetch(`${API_URL}/jobs/savedForLater`,{
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
export const updateProfile = async (update,type) => {
    try{
        const response = await fetch(`${API_URL}/profiles`,{
            method: 'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify( type === "name" ? {name : update} : type === "username" ? {username: update} : {description: update}),
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
export const getCanReview = async (username) => {
    try{
        console.log("first")
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
export const attending = async (jobId, update) => {
    try{
        const response = await fetch(`${API_URL}/jobs/attend/${jobId}`,{
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({update}),
            credentials: 'include'
        })
        const data = await response.json();
        console.log(response.ok);
        if(!response.ok){
            throw new Error(data.message);
        }
        return data;
    }
    catch(error){
        throw new Error(error.message);
    }
}