# 上传与详情统一体验 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变现有后端接口载荷结构的前提下，统一项目内图片上传、删除、详情回显与下载的用户体验。

**Architecture:** 采用“统一体验层，保留业务值结构”的稳妥方案。各页面内部增加 `UploadFile[]` 与业务值之间的适配逻辑，统一接入 `ant.design Upload / Upload.Dragger`，并为详情页统一补齐图片/视频预览与下载入口。

**Tech Stack:** React 19, TypeScript, Ant Design 6, React Query, Vitest, Testing Library

---

### Task 1: 为图文视频页补上传体验回归测试

**Files:**
- Modify: `src/pages/ImageVideoPage.test.tsx`
- Modify: `src/pages/upload-integration.test.tsx`

- [ ] **Step 1: 写失败测试，覆盖多图上传后的统一展示**

```tsx
it("renders uploaded images as managed upload items", async () => {
  renderImageVideoPage();

  fireEvent.change(screen.getByTestId("image-video-upload-input"), {
    target: {
      files: [
        new File(["image-a"], "a.png", { type: "image/png" }),
        new File(["image-b"], "b.png", { type: "image/png" }),
      ],
    },
  });

  await waitFor(() => {
    expect(pageMocks.uploadImage).toHaveBeenCalledTimes(2);
  });

  expect(screen.getByText("a.png")).toBeInTheDocument();
  expect(screen.getByText("b.png")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /删除图片-a\\.png/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认红灯**

Run: `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx`

Expected: 失败，原因是当前页面还没有统一上传列表与删除按钮。

- [ ] **Step 3: 补删除同步测试**

```tsx
it("removes deleted upload item from ui and payload", async () => {
  renderImageVideoPage();

  fireEvent.change(screen.getByTestId("image-video-upload-input"), {
    target: {
      files: [new File(["image"], "a.png", { type: "image/png" })],
    },
  });

  await waitFor(() => {
    expect(pageMocks.uploadImage).toHaveBeenCalledTimes(1);
  });

  fireEvent.click(screen.getByRole("button", { name: /删除图片-a\\.png/i }));

  fireEvent.change(screen.getByPlaceholderText(/请输入视频提示词/i), {
    target: { value: "生成一条茶饮种草视频" },
  });

  fireEvent.click(screen.getByRole("button", { name: /开始生成视频/i }));

  await waitFor(() => {
    expect(pageMocks.createTextImageVideoTask).not.toHaveBeenCalledWith(
      expect.objectContaining({
        imageUrls: ["https://example.com/a.png"],
      }),
    );
  });
});
```

- [ ] **Step 4: 再次运行测试，确认删除断言也先失败**

Run: `npm test -- src/pages/ImageVideoPage.test.tsx`

Expected: 失败，原因是当前删除交互尚未实现。

### Task 2: 实现图文视频页统一上传体验

**Files:**
- Modify: `src/pages/ImageVideoPage.tsx`

- [ ] **Step 1: 引入 `Upload` 与 `UploadFile` 受控状态**

```tsx
import { Alert, Button, Input, Segmented, Switch, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
```

- [ ] **Step 2: 增加页面内上传适配状态，并补中文注释**

```tsx
const [imageFileList, setImageFileList] = useState<UploadFile[]>([])

// Upload 组件需要 fileList 维护展示态；
// formValues.imageUrls 维护的则是提交给后端的真实业务值。
// 两者分离可以避免删除、回显和提交时互相污染。
const [formValues, setFormValues] = useState(() =>
  createDefaultTextImageVideoFormValues(),
)
```

- [ ] **Step 3: 将上传逻辑改为 `beforeUpload` 手动上传并写回双状态**

```tsx
const uploadProps: UploadProps = {
  multiple: true,
  accept: 'image/png,image/jpeg,image/webp',
  showUploadList: false,
  beforeUpload: async (file) => {
    setUploadingImages(true)

    try {
      const result = await uploadImage(file)
      const nextItem: UploadFile = {
        uid: result.objectKey || result.url,
        name: result.originalFilename,
        status: 'done',
        url: result.url,
      }

      setImageFileList((current) => [...current, nextItem])
      setFormValues((current) => ({
        ...current,
        imageUrls: [...current.imageUrls, result.url],
      }))
      setErrors((current) => ({ ...current, imageUrls: undefined }))
    } finally {
      setUploadingImages(false)
    }

    return false
  },
}
```

- [ ] **Step 4: 实现统一删除逻辑，并补中文注释**

```tsx
function handleRemoveImage(file: UploadFile) {
  // 删除时必须同时同步 Upload 的展示列表和表单真实值，
  // 否则界面删除了，但提交给后端的图片地址仍然存在。
  setImageFileList((current) => current.filter((item) => item.uid !== file.uid))
  setFormValues((current) => ({
    ...current,
    imageUrls: current.imageUrls.filter((url) => url !== file.url),
  }))
}
```

- [ ] **Step 5: 将原生上传区域改为统一缩略图卡片 + 删除按钮**

```tsx
<Upload {...uploadProps}>
  <div className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border border-dashed border-[var(--line-subtle)] bg-[var(--muted-bg)] text-[var(--text-muted)] transition hover:border-[#22D3EE]/40 hover:text-[#22D3EE]">
    <Plus size={18} />
  </div>
</Upload>
```

```tsx
{imageFileList.map((file) => (
  <div key={file.uid} className="relative overflow-hidden rounded-xl border border-[var(--line-subtle)] bg-[var(--muted-bg)]">
    <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
    <button
      type="button"
      aria-label={`删除图片-${file.name}`}
      className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] text-white"
      onClick={() => handleRemoveImage(file)}
    >
      删除
    </button>
  </div>
))}
```

- [ ] **Step 6: 运行图文视频页测试确认转绿**

Run: `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx`

Expected: PASS

### Task 3: 统一商品视频页与爆款改编页的图片上传体验

**Files:**
- Modify: `src/pages/ProductVideoPage.tsx`
- Modify: `src/pages/ViralRemixPage.tsx`

- [ ] **Step 1: 为 `ProductVideoPage` 增加 `UploadFile[]` 展示态与删除能力**

```tsx
const [productImageFileList, setProductImageFileList] = useState<UploadFile[]>([])
```

```tsx
function handleRemoveProductImage(file: UploadFile) {
  setProductImageFileList((current) => current.filter((item) => item.uid !== file.uid))
}
```

- [ ] **Step 2: 将 `ProductVideoPage` 原生文件输入改为 `Upload`**

```tsx
<Upload
  multiple
  accept="image/png,image/jpeg,image/webp"
  showUploadList={false}
  beforeUpload={async (file) => {
    setProductImageUploading(true)
    try {
      const result = await uploadImage(file)
      setProductImageFileList((current) => [
        ...current,
        {
          uid: result.objectKey || result.url,
          name: result.originalFilename,
          status: 'done',
          url: result.url,
        },
      ])
    } finally {
      setProductImageUploading(false)
    }
    return false
  }}
>
```

- [ ] **Step 3: 清理 `ViralRemixPage` 中混合的隐藏 input，实现一致的 `Upload.Dragger` 行为**

```tsx
<Upload.Dragger
  multiple={false}
  showUploadList={false}
  beforeUpload={handleReplaceProductImageUpload}
>
```

```tsx
async function handleReplaceProductImageUpload(file: File) {
  setReplaceProductImageUploading(true)
  try {
    const result = await uploadImage(file)
    setReplaceProductImageFile({
      uid: result.objectKey || result.url,
      name: result.originalFilename,
      status: 'done',
      url: result.url,
    })
    setReplaceProductImageUrl(result.url)
  } finally {
    setReplaceProductImageUploading(false)
  }
  return false
}
```

- [ ] **Step 4: 为爆款改编页单图上传增加删除按钮**

```tsx
<button
  type="button"
  aria-label={`删除图片-${replaceProductImageFile?.name}`}
  onClick={() => {
    setReplaceProductImageFile(null)
    setReplaceProductImageName(null)
    setReplaceProductImageUrl("")
  }}
>
  删除
</button>
```

- [ ] **Step 5: 运行上传集成测试**

Run: `npm test -- src/pages/upload-integration.test.tsx`

Expected: PASS

### Task 4: 统一数字人视频页与视频混剪详情页的图片资源上传体验

**Files:**
- Modify: `src/pages/DigitalHumanVideoTasksPage.tsx`
- Modify: `src/pages/VideoRemixTaskDetailPage.tsx`

- [ ] **Step 1: 为数字人视频背景图上传改为 `Upload` 并支持删除**

```tsx
const [backgroundFileList, setBackgroundFileList] = useState<UploadFile[]>([])
```

```tsx
function handleRemoveBackground() {
  setBackgroundFileList([])
  onChange({
    ...values,
    backgroundImageUrl: "",
  })
}
```

- [ ] **Step 2: 为 `VideoRemixTaskDetailPage` 的商品图与人物图增加 `UploadFile[]` 适配**

```tsx
const productImageFileList = useMemo(
  () =>
    productImageUrls.map((url, index) => ({
      uid: `product-${index}-${url}`,
      name: `商品图-${index + 1}`,
      status: 'done' as const,
      url,
    })),
  [productImageUrls],
)
```

```tsx
function removeAssetUrl(field: 'productImageUrlsText' | 'characterImageUrlsText', targetUrl: string) {
  const currentUrls = splitAssetUrls(form.getFieldValue(field))
  const nextUrls = currentUrls.filter((url) => url !== targetUrl)
  form.setFieldValue(field, nextUrls.join('\n'))
}
```

- [ ] **Step 3: 将当前按钮 + TextArea 组合补成统一的缩略图展示和删除交互**

```tsx
{productImageFileList.map((file) => (
  <div key={file.uid} className="relative overflow-hidden rounded-lg border border-[var(--line-subtle)]">
    <img src={file.url} alt={file.name} className="h-28 w-full object-cover" />
    <button
      type="button"
      aria-label={`删除图片-${file.name}`}
      className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[11px] text-white"
      onClick={() => removeAssetUrl('productImageUrlsText', file.url ?? '')}
    >
      删除
    </button>
  </div>
))}
```

- [ ] **Step 4: 运行相关页面测试**

Run: `npm test -- src/pages/DigitalHumanVideoTasksPage.test.tsx src/pages/VideoRemixTaskDetailPage.test.tsx`

Expected: PASS

### Task 5: 统一详情页图片/视频回显与下载入口

**Files:**
- Modify: `src/pages/TextImageVideoTaskDetailPage.tsx`
- Modify: `src/pages/DigitalHumanVideoTaskDetailPage.tsx`
- Modify: `src/pages/TextImageVideoTaskDetailPage.test.tsx`
- Modify: `src/pages/DigitalHumanVideoTaskDetailPage.test.tsx`

- [ ] **Step 1: 先写详情页失败测试，断言预览与下载按钮存在**

```tsx
expect(screen.getByRole("img", { name: /参考图-1/i })).toBeInTheDocument()
expect(screen.getByRole("button", { name: /下载封面/i })).toBeInTheDocument()
expect(screen.getByRole("button", { name: /下载视频/i })).toBeInTheDocument()
```

- [ ] **Step 2: 运行详情页测试确认红灯**

Run: `npm test -- src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx`

Expected: 失败，原因是当前仍以文本链接展示为主。

- [ ] **Step 3: 将图文视频详情页改为缩略图、视频预览与下载按钮**

```tsx
<img
  src={imageUrl}
  alt={`参考图-${index + 1}`}
  className="h-28 w-full rounded-lg border border-[var(--line-subtle)] object-cover"
/>
```

```tsx
<video
  className="w-full rounded-lg border border-[var(--line-subtle)]"
  controls
  src={task.videoUrl}
/>
```

```tsx
<a href={task.videoUrl} download target="_blank" rel="noreferrer">
  <Button type="primary">下载视频</Button>
</a>
```

- [ ] **Step 4: 将数字人视频详情页改为封面预览、视频预览、字幕下载**

```tsx
{task.coverUrl ? (
  <img
    src={task.coverUrl}
    alt="数字人视频封面"
    className="w-full rounded-lg border border-[var(--line-subtle)] object-cover"
  />
) : null}
```

```tsx
<a href={task.subtitleUrl} download target="_blank" rel="noreferrer">
  <Button>下载字幕</Button>
</a>
```

- [ ] **Step 5: 运行详情页测试确认转绿**

Run: `npm test -- src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx`

Expected: PASS

### Task 6: 全量回归与类型验证

**Files:**
- Modify: `doc/2026-06-23-image-video-upload-detail-progress.md`

- [ ] **Step 1: 运行本轮相关测试**

Run:

```bash
npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx src/pages/DigitalHumanVideoTasksPage.test.tsx src/pages/VideoRemixTaskDetailPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx
```

Expected: PASS

- [ ] **Step 2: 运行类型检查**

Run: `npm run typecheck`

Expected: PASS

- [ ] **Step 3: 更新进展文档**

```md
## 第六阶段完成：统一上传体验实现与验证

### 已完成
- 统一图片上传入口到 Ant Design Upload
- 补齐删除、详情回显、下载
- 补齐关键中文注释

### 验证结果
- 相关页面测试通过
- typecheck 通过
```

