import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../stores/authStore'

beforeEach(() => {
  useAuthStore.setState({ user: null, accessToken: null, isLoading: true })
})

describe('authStore', () => {
  it('login stores access token', () => {
    useAuthStore.getState().login('my_token')
    expect(useAuthStore.getState().accessToken).toBe('my_token')
  })

  it('logout clears user and token', () => {
    useAuthStore.setState({ user: { id: 1, email: 'a@b.com', name: 'A', picture: '', plan: 'free' }, accessToken: 'tok' })
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })

  it('setUser updates user', () => {
    const user = { id: 1, email: 'a@b.com', name: 'A', picture: '', plan: 'free' as const }
    useAuthStore.getState().setUser(user)
    expect(useAuthStore.getState().user?.email).toBe('a@b.com')
  })
})
