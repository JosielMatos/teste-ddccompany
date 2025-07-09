import api from './axios'

export async function loginUser(data: { username: string; password: string }) {
  const response = await api.post('/auth/login', data)
  return response.data
}
