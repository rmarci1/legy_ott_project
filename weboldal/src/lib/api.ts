import { UpdateJob } from "@/Types/UpdateJob";
import { UpdateUser } from "@/Types/UpdateUser";
import {Job} from "@/Types/Job.ts";

const API_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

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

export const getAllUsers = async () => {
    const response = await fetch(`${API_URL}/profiles`,{
      method: 'GET',
      credentials: 'include'
    })
    const data = await response.json();
    if(!response.ok){
      throw new Error(data.message);
    }
    return data;
}
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
export const updateJobByAdmin = async (fields : UpdateJob, jobId : number) => {
    const response = await fetch(`${API_URL}/admin/updateJob/${jobId}`,{
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





