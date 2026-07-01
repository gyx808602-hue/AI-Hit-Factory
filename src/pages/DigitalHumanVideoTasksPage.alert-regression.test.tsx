import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DigitalHumanVideoTasksPage } from './DigitalHumanVideoTasksPage'

const pageMocks = vi.hoisted(() => ({
  useDigitalHumanVideoPage: vi.fn(),
  useCreateDigitalHumanVideoMutation: vi.fn(),
  useDeleteDigitalHumanVideoMutation: vi.fn(),
  useRefreshDigitalHumanVideoMutation: vi.fn(),
  useDigitalHumanPage: vi.fn(),
  useCustomisedAudioPage: vi.fn(),
  navigate: vi.fn(),
  messageSuccess: vi.fn(),
  messageError: vi.fn(),
}))

vi.mock('../features/digital-human/video/hooks', () => ({
  useDigitalHumanVideoPage: pageMocks.useDigitalHumanVideoPage,
  useCreateDigitalHumanVideoMutation: pageMocks.useCreateDigitalHumanVideoMutation,
  useDeleteDigitalHumanVideoMutation: pageMocks.useDeleteDigitalHumanVideoMutation,
  useRefreshDigitalHumanVideoMutation: pageMocks.useRefreshDigitalHumanVideoMutation,
}))

vi.mock('../features/digital-human/hooks', () => ({
  useDigitalHumanPage: pageMocks.useDigitalHumanPage,
}))

vi.mock('../features/digital-human/audio/hooks', () => ({
  useCustomisedAudioPage: pageMocks.useCustomisedAudioPage,
}))

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd')

  return {
    ...actual,
    ColorPicker: ({
      value,
      onChange,
      ...props
    }: {
      value?: string
      onChange?: (color: { toHexString: () => string }) => void
      [key: string]: unknown
    }) => (
      <input
        {...props}
        aria-label="背景颜色选择器"
        type="color"
        value={typeof value === 'string' ? value : '#000000'}
        onChange={(event) =>
          onChange?.({
            toHexString: () => event.target.value,
          })
        }
      />
    ),
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
      <MemoryRouter initialEntries={['/digital-humans/videos']}>
        <DigitalHumanVideoTasksPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DigitalHumanVideoTasksPage alert regression', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    pageMocks.useDigitalHumanVideoPage.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('列表加载失败'),
    })

    pageMocks.useCreateDigitalHumanVideoMutation.mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    })

    pageMocks.useDeleteDigitalHumanVideoMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })

    pageMocks.useRefreshDigitalHumanVideoMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })

    pageMocks.useDigitalHumanPage.mockReturnValue({
      data: { list: [], total: 0 },
      isLoading: false,
      isError: false,
      error: null,
    })

    pageMocks.useCustomisedAudioPage.mockReturnValue({
      data: { list: [], total: 0, pageNum: 1, pageSize: 100, pages: 0 },
      isLoading: false,
      isError: false,
      error: null,
    })
  })

  it('does not render an inline error alert when the task list query fails', () => {
    renderPage()

    expect(screen.queryByText('列表加载失败')).not.toBeInTheDocument()
  })
})
