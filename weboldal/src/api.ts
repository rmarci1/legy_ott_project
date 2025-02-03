
const API_URL = 'http://192.168.11.82:3000';

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

    const response = await fetch(`${API_URL}/register`, {
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

    response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: loginMode == "email" ? JSON.stringify({ email, password }) : JSON.stringify({ username, password }),
      credentials: 'include',
    })

      console.log(password)

    //   response = await axios.post(`http://192.168.11.82:3000/login`,
    //   {
    //       "email": email,
    //       "password": password  
    //   },
    //   {
    //     withCredentials: true
    //   }
    // )

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

export const getUser = async (): Promise<RegisterResponse> => {
  try {
    const response = await fetch(`${API_URL}/check-auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export const getProfilePic = async (): Promise<String> => {
  try {
    const response = await fetch(`${API_URL}/profilePic`, {
      method: 'GET',
      credentials: 'include',
    });

    return response.json();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// export const UpdateProfilePic = async (profilePic: File) =>{
//   const 

  

//   const response = await fetch(`${API_URL}/profiles/kovacs.laci`, {
//     method: 'PATCH',
//     credentials: "include",
//     headers: { 'Content-Type': 'application/octet-stream' },
//     body: JSON.stringify({ UpdateProfilePic:  }),
//   })


