const API_URL = import.meta.env.VITE_AUTH_SERVICE_URL;

export async function getToken() {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();
  return data['access_token'];
}
