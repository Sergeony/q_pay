import {jwtDecode} from "jwt-decode";
import {initialState, setUser} from "./store/reducers/authSlice";
import {baseUrl} from "./service";


export const formatTime = (stringDate: string | null) => {
  if (stringDate === null)
    stringDate = new Date().toISOString();
  const date = new Date(stringDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const formatDate = (stringDate: string | null) => {
    if (stringDate === null)
      stringDate = new Date().toISOString();

    const date = new Date(stringDate);

    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${month}.${day}.${year}`;
}


export const getUserTypeFromToken = () => {
  const token = sessionStorage.getItem('access');
  if (token) {
    const decodedToken: {user_type: number} = jwtDecode(token);
    return decodedToken.user_type;
  }
  return null;
};


export const  refreshToken = async (api: any)  => {
  return await fetch(`${baseUrl}/auth/token/refresh/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('access', data.access);
        return data.access;
      } else {
        console.error("Failed to refresh token");
        api.dispatch(setUser(initialState.auth));
      }
    })
    .catch((error) => {
      console.error("Error refreshing token:", error);
    })
}


export const formatRemainingTime = (remainingTimeInSeconds: number) => {
  const minutes = Math.floor(remainingTimeInSeconds / 60);
  const seconds = remainingTimeInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const formatTimerString = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export const copyCodeToClipBoard = async (value: string) => {
    await navigator.clipboard.writeText(value);
};
