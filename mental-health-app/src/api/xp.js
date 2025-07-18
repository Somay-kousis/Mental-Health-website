
const API_BASE = 'http://localhost:5000/api';

export const fetchXP = async (token) => {
  const response = await fetch(`${API_BASE}/xp`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.xp;
};

export const addXP = async (token, amount) => {
  const response = await fetch(`${API_BASE}/xp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  const data = await response.json();
  return data.xp;
};
