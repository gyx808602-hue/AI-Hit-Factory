import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DigitalHumansPage } from './DigitalHumansPage'

const pageMocks = vi.hoisted(() => ({
  useDigitalHumanPage: vi.fn(),
  useCreateDigitalHumanMutation: vi.fn(),
  useDeleteDigitalHumanMutation: vi.fn(),
  useRefreshDigitalHumanMutation: vi.fn(),
  navigate: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
}))

vi.mock('../features/digital-human/hooks', () => ({
  useDigitalHumanPage: pageMocks.useDigitalHumanPage,
  useCreateDigitalHumanMutation: pageMocks.useCreateDigitalHumanMutation,
  useDeleteDigitalHumanMutation: pageMocks.useDeleteDigitalHumanMutation,
  useRefreshDigitalHumanMutation: pageMocks.useRefreshDigitalHumanMutation,
}))

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd')

  return {
    ...actual,
    message: {
      success: pageMocks.messageSuccess,
      error: pageMocks.messageError,
    },
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useNavigate: () => pageMocks.navigate,
  }
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/digital-humans']}>
        <DigitalHumansPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DigitalHumansPage alert regression', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    pageMocks.useDigitalHumanPage.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('列表加载失败'),
    })

    pageMocks.useCreateDigitalHumanMutation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    })

    pageMocks.useDeleteDigitalHumanMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })

    pageMocks.useRefreshDigitalHumanMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
  })

  it('does not render an inline error alert when the list query fails', () => {
    renderPage()

    expect(screen.queryByText('列表加载失败')).not.toBeInTheDocument()
  })
})
