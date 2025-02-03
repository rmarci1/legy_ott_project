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
    let response: Response;
    const email = login;
    const username = login;

    (loginMode == "email")? response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    }): response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    })

    const data: LoginResponse & ErrorResponse = await response.json();

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

export const blob = async (): Promise<Blob> => {
  try {
    const response = await fetch(`${API_URL}/profilePic`, {
      method: 'GET',
      credentials: 'include',
    });

    const blobData: Blob = await response.blob();

    return blobData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
