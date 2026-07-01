import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ImageVideoPage } from './ImageVideoPage'

const pageMocks = vi.hoisted(() => ({
  uploadImage: vi.fn(),
  createTextImageVideoTask: vi.fn(),
  generateTextImageVideoPrompt: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('../api/aigc/uploads', () => ({
  uploadImage: pageMocks.uploadImage,
}))

vi.mock('../api/customer/text-image-video', () => ({
  createTextImageVideoTask: pageMocks.createTextImageVideoTask,
  generateTextImageVideoPrompt: pageMocks.generateTextImageVideoPrompt,
}))

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
      <MemoryRouter initialEntries={['/image-video']}>
        <ImageVideoPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function getUploadInput() {
  const input = screen.getByTestId('image-video-upload-input')
  expect(input).toBeInTheDocument()
  return input as HTMLInputElement
}

function findScrollableAncestor(element: HTMLElement | null) {
  let current = element?.parentElement ?? null

  while (current) {
    const className = current.className
    if (
      typeof className === 'string' &&
      className.includes('overflow-y-auto') &&
      className.includes('min-h-0') &&
      className.includes('flex-1')
    ) {
      return current
    }

    current = current.parentElement
  }

  return null
}

describe('ImageVideoPage upload style regression', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    pageMocks.uploadImage.mockResolvedValue({
      url: 'https://example.com/a.png',
      objectKey: 'a.png',
      originalFilename: 'a.png',
    })

    pageMocks.createTextImageVideoTask.mockResolvedValue({
      id: 101,
      imageUrls: ['https://example.com/a.png'],
      prompt: 'Generate a tea promo video',
      model: 'seedance2.0',
      status: 0,
    })

    pageMocks.generateTextImageVideoPrompt.mockResolvedValue({
      prompt: 'Generate a short mixed-media promo.',
    })
  })

  it('renders an empty asset panel with an upload button before upload', () => {
    renderPage()

    expect(screen.getByRole('button', { name: '上传商品图' })).toBeInTheDocument()
    expect(screen.getByTestId('image-video-upload-input')).toBeInTheDocument()
    expect(screen.getByTestId('image-video-empty-panel')).toBeInTheDocument()
    expect(screen.getByText('暂无商品图，请先上传素材。')).toBeInTheDocument()
    expect(screen.queryByTestId('image-video-uploaded-grid')).not.toBeInTheDocument()
  })

  it('renders a remix-create-style asset preview grid after upload', async () => {
    pageMocks.uploadImage
      .mockResolvedValueOnce({
        url: 'https://example.com/a.png',
        objectKey: 'a.png',
        originalFilename: 'a.png',
      })
      .mockResolvedValueOnce({
        url: 'https://example.com/b.png',
        objectKey: 'a.png',
        originalFilename: 'b.png',
      })

    renderPage()

    fireEvent.change(getUploadInput(), {
      target: {
        files: [
          new File(['image-a'], 'a.png', { type: 'image/png' }),
          new File(['image-b'], 'b.png', { type: 'image/png' }),
        ],
      },
    })

    await waitFor(() => {
      expect(pageMocks.uploadImage).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByRole('button', { name: '上传商品图' })).toBeInTheDocument()
    expect(screen.getByTestId('image-video-uploaded-grid')).toBeInTheDocument()
    expect(screen.getAllByTestId('image-video-uploaded-item')).toHaveLength(2)
    expect(screen.getByText('商品图 1')).toBeInTheDocument()
    expect(screen.getByText('商品图 2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '删除商品图-a.png' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '删除商品图-b.png' })).toBeInTheDocument()
    expect(screen.getAllByTestId('image-video-uploaded-preview')).toHaveLength(2)
  })

  it('keeps a dedicated inner scroll container for long page content', () => {
    renderPage()

    const previewCard = screen.getByTestId('image-video-preview-card')
    expect(findScrollableAncestor(previewCard)).not.toBeNull()
  })
})
