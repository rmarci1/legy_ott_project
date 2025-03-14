
const API_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

export const register = async (
  name: string,
  username: string,
  email: string,
  password: string,
  password2: string
) => {
  try {
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
  } catch (error: any) {
    console.error("1 Fetch error:", error.message);
    throw error;
  }
};

export const pflogin = async (
  login: string,
  password: string,
  loginMode: string
) => {
  try {
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
  } catch (error: any) {
    console.error("2 Fetch error:", error.message);
    throw error;
  }
}; 

export const getUser = async () => {
  try {
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
  } catch (error: any) {
    console.log(error.message);
    throw error;
  }
};

export const getAllJobs = async () =>{
  try{
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
  catch (e: any){
    throw new Error(e.message);
  }
}

export const getAvailableJobs = async () =>{
  try{
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
  catch (e: any) {
    throw new Error(e.message)
  }
}

export const profilePicChange = async (formData: FormData) => {
  try{
    const result = await fetch(`${API_URL}/profiles/uploadProfilePic`,
        {
          body: formData,
          method: "post",
          credentials: "include"
        });

    const data = await result.json()

    console.log(data)

    if (!result.ok) {
      throw new Error(data.message as string);
    }

    return data;
  }
  catch (e: any){
    throw new Error(e.message);
  }
}

export const saveForLater = async (jobId: number, update: boolean) => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const attend = async (id: number, update: boolean) => {
  try{
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
  catch (e: any) {
    throw new Error(e.message);
  }
}

export const getProfile = async (username: string) => {
  try{
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
  catch (e: any) {
    throw new Error(e.message)
  }
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
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const getAdvertised = async () => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const getSavedForLater = async () => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const getArchivedJobs = async () => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const getArchivedAds = async () => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}


export const getAverageRating = async (username: string) => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const createReview = async (reviewed_un: string, desc: string, review: number) => {
  try{
    console.log('adatok:')
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const canReview = async (username: string) => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}


export const createAdv = async (name: string, date: Date, description: string, img: string, max_attending: number, address: string) => {
  try{
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
  catch (e: any){
    throw new Error(e.message)
  }
}

export const jobPicChange = async (formData: FormData, id: number) => {
  try{
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
  catch (e: any){
    throw new Error(e.message);
  }
}


export const deleteJob = async (id: number, from: string) => {
  try{
    const result = await fetch(`${API_URL}/jobs/${id}/${from}`,
        {
          method: "DELETE",
          credentials: "include"
        });

    const data = await result.json()

    console.log(data)

    if (!result.ok) {
      throw new Error(data.message as string);
    }

    return data;
  }
  catch (e: any){
    throw new Error(e.message);
  }
}





