const API_URL = 'http://192.168.11.45:3000';
let token = '';

interface RegisterResponse {
  message: string;
  [key: string]: any;
}

interface LoginResponse {
  token?: string;
  message: string;
  [key: string]: any;
}

interface ErrorResponse {
  message: string | string[];
}

export const register = async (
  name: string,
  username: string,
  email: string,
  password: string,
  password2: string
): Promise<RegisterResponse> => {
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

    const data: RegisterResponse & ErrorResponse = await response.json();

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
): Promise<LoginResponse> => {
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

    token = data.access_token;
    return data;
  } catch (error: any) {
    console.error("2 Fetch error:", error.message);
    throw error;
  }
}; 

export const getUser = async (): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/check-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' , 'Authorization': `Bearer ${token}`},
      credentials: 'include',
    });

    const data: RegisterResponse & ErrorResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message as string);
    }

    return data;
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

    return res.json();
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

    const data = response.json();
    console.log(data);
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

    return result.json();
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

    return res.json();
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

    const data = res.json();

    console.log(data)

    return data;
  }
  catch (e: any) {
    throw new Error(e.message);
  }
}

