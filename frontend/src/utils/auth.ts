export function storeToken(token: string) {
  localStorage.setItem('jwt_token', token)
}

export function getToken(): string | null {
  return localStorage.getItem('jwt_token')
}
