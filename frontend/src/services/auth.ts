import api from './api'
import type { User } from '../types'

export const getMe = (): Promise<User> =>
  api.get('/users/me').then((r) => r.data)
