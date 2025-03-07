
const API_URL = 'http://localhost:3000';

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

export const getAvailableJobs = async (username: string) =>{
  try{
    const response = await fetch(`${API_URL}/jobs/available/${username}`, {
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

export const profilePicChange = async (formData: FormData, username: string) => {
  try{
    const result = await fetch(`${API_URL}/profiles/${username}/uploadProfilePic`,
        {
          body: formData,
          method: "post",
        });

    const data = await result.json();

    if (!result.ok) {
      throw new Error(data.message as string);
    }

    return data;
  }
  catch (e: any){
    throw new Error(e.message);
  }
}

export const saveForLater = async (jobId: number,profileId: number,username: string, update: boolean) => {
  try{
    const res = await fetch(`${API_URL}/jobs/updateSave/${jobId}/${profileId}/${username}`, {
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

export const attend = async (id: number, username: string, update: boolean) => {
  try{
    const res = await fetch(`${API_URL}/jobs/attend/${id}/${username}`,{
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

export const getSelectedJobs = async (username: string) => {
  try{
    const res = await fetch(`${API_URL}/jobs/selected/${username}`, {
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

export const getAdvertised = async (username: string) => {
  try{
    const res = await fetch(`${API_URL}/jobs/ads/${username}`, {
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

export const getSavedForLater = async (username: string) => {
  try{
    const res = await fetch(`${API_URL}/jobs/savedForLater/${username}`, {
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

export const getArchivedJobs = async (username: string) => {
  try{
    const res = await fetch(`${API_URL}/jobs/archived/${username}`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }
    console.log(data)

    return data;

  }
  catch (e: any){
    throw new Error(e.message)
  }
}

export const getArchivedAds = async (username: string) => {
  try{
    const res = await fetch(`${API_URL}/jobs/archivedAds/${username}`, {
      method: 'GET',
      credentials: "include"
    })

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message as string);
    }
    console.log(data)

    return data;

  }
  catch (e: any){
    throw new Error(e.message)
  }
}


