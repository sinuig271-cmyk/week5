import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import LessonPage from '../pages/LessonPage'
import * as courseService from '../services/courses'

vi.mock('../services/courses')

const makeWrapper = () => ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter initialEntries={['/courses/week5/1']}>
      <Routes>
        <Route path="/courses/week5/:sectionId" element={children} />
      </Routes>
    </MemoryRouter>
  </QueryClientProvider>
)

describe('LessonPage', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: { id: 1, email: 'a@b.com', name: 'A', picture: '', plan: 'free' }, accessToken: 'tok', isLoading: false })
  })

  it('renders section content', async () => {
    vi.mocked(courseService.getSectionContent).mockResolvedValue({
      id: 1, title: 'Regularization', content_md: '# Hello'
    })
    vi.mocked(courseService.getProgress).mockResolvedValue([])

    render(<LessonPage />, { wrapper: makeWrapper() })

    await waitFor(() => expect(screen.getByText('Regularization')).toBeInTheDocument())
  })

  it('shows premium gate on 403', async () => {
    vi.mocked(courseService.getSectionContent).mockRejectedValue({ response: { status: 403 } })
    vi.mocked(courseService.getProgress).mockResolvedValue([])

    render(<LessonPage />, { wrapper: makeWrapper() })

    await waitFor(() => expect(screen.getByText(/프리미엄 전용/)).toBeInTheDocument())
  })
})
