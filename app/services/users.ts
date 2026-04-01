// URL base de l'API obtinguda de les variables d'entorn
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Funció per a crear un nou usuari
export const addUser = async (
  name: string,
  email: string,
  password: string,
  token: string | null,
) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, email, password }),
  });

  // Verificar que la resposta és correcta
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  // Retornar les dades de la sala creada
  return res.json();
};
