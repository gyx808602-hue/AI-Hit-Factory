import { lazy } from 'react'
import type { AppRoute, RouteKey } from './routeTypes'

const DashboardPage = lazy(() =>
  import('../../pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)

const ProductVideoPage = lazy(() =>
  import('../../pages/ProductVideoPage').then((module) => ({
    default: module.ProductVideoPage,
  })),
)

const ViralRemixPage = lazy(() =>
  import('../../pages/ViralRemixPage').then((module) => ({
    default: module.ViralRemixPage,
  })),
)

const ViralRemixTasksPage = lazy(() =>
  import('../../pages/VideoRemixTasksPage').then((module) => ({
    default: module.VideoRemixTasksPage,
  })),
)

const ViralRemixTaskDetailPage = lazy(() =>
  import('../../pages/VideoRemixTaskDetailPage').then((module) => ({
    default: module.VideoRemixTaskDetailPage,
  })),
)

const ImageVideoPage = lazy(() =>
  import('../../pages/ImageVideoPage').then((module) => ({
    default: module.ImageVideoPage,
  })),
)

const TextImageVideoTasksPage = lazy(() =>
  import('../../pages/TextImageVideoTasksPage').then((module) => ({
    default: module.TextImageVideoTasksPage,
  })),
)

const TextImageVideoTaskDetailPage = lazy(() =>
  import('../../pages/TextImageVideoTaskDetailPage').then((module) => ({
    default: module.TextImageVideoTaskDetailPage,
  })),
)

const DigitalHumansPage = lazy(() =>
  import('../../pages/DigitalHumansPage').then((module) => ({
    default: module.DigitalHumansPage,
  })),
)

const DigitalHumanDetailPage = lazy(() =>
  import('../../pages/DigitalHumanDetailPage').then((module) => ({
    default: module.DigitalHumanDetailPage,
  })),
)

const DigitalHumanVideoTasksPage = lazy(() =>
  import('../../pages/DigitalHumanVideoTasksPage').then((module) => ({
    default: module.DigitalHumanVideoTasksPage,
  })),
)

const DigitalHumanVideoTaskDetailPage = lazy(() =>
  import('../../pages/DigitalHumanVideoTaskDetailPage').then((module) => ({
    default: module.DigitalHumanVideoTaskDetailPage,
  })),
)

const TaskRecordsPage = lazy(() =>
  import('../../pages/TaskRecordsPage').then((module) => ({
    default: module.TaskRecordsPage,
  })),
)

const AssetLibraryPage = lazy(() =>
  import('../../pages/AssetLibraryPage').then((module) => ({
    default: module.AssetLibraryPage,
  })),
)

const LoginPage = lazy(() =>
  import('../../pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
)

export const routeRegistry: AppRoute[] = [
  {
    key: 'auth.login',
    path: '/login',
    component: LoginPage,
    meta: {
      title: '登录',
      icon: 'User2',
      cache: false,
      hideInMenu: true,
      requiresAuth: false,
    },
  },
  {
    key: 'workspace.dashboard',
    path: '/',
    component: DashboardPage,
    meta: {
      title: '工作台',
      icon: 'LayoutDashboard',
      cache: true,
      requiresAuth: true,
    },
  },
  {
    key: 'content.productVideo',
    path: '/product-video',
    component: ProductVideoPage,
    meta: {
      title: '商品视频生成',
      icon: 'Video',
      cache: false,
      requiresAuth: true,
    },
  },
  {
    key: 'content.viralRemix',
    path: '/viral-remix',
    component: ViralRemixPage,
    meta: {
      title: '爆款视频改编',
      icon: 'Repeat2',
      cache: false,
      requiresAuth: true,
    },
  },
  {
    key: 'content.viralRemixTasks',
    path: '/viral-remix/tasks',
    component: ViralRemixTasksPage,
    meta: {
      title: '追爆任务',
      icon: 'ListTodo',
      cache: true,
      requiresAuth: true,
    },
  },
  {
    key: 'content.viralRemixTaskDetail',
    path: '/viral-remix/tasks/:taskId',
    component: ViralRemixTaskDetailPage,
    meta: {
      title: '追爆任务详情',
      icon: 'Clapperboard',
      cache: false,
      hideInMenu: true,
      requiresAuth: true,
      activeMenuKey: 'content.viralRemixTasks',
    },
  },
  {
    key: 'content.imageVideo',
    path: '/image-video',
    component: ImageVideoPage,
    meta: {
      title: '文图生成视频',
      icon: 'Image',
      cache: false,
      requiresAuth: true,
    },
  },
  {
    key: 'content.imageVideoTasks',
    path: '/image-video/tasks',
    component: TextImageVideoTasksPage,
    meta: {
      title: '文图生视频任务',
      icon: 'ListTodo',
      cache: true,
      requiresAuth: true,
    },
  },
  {
    key: 'content.imageVideoTaskDetail',
    path: '/image-video/tasks/:taskId',
    component: TextImageVideoTaskDetailPage,
    meta: {
      title: '文图生视频详情',
      icon: 'Clapperboard',
      cache: false,
      hideInMenu: true,
      requiresAuth: true,
      activeMenuKey: 'content.imageVideoTasks',
    },
  },
  {
    key: 'content.digitalHumans',
    path: '/digital-humans',
    component: DigitalHumansPage,
    meta: {
      title: '数字人管理',
      icon: 'User2',
      cache: true,
      requiresAuth: true,
    },
  },
  {
    key: 'content.digitalHumanDetail',
    path: '/digital-humans/:humanId',
    component: DigitalHumanDetailPage,
    meta: {
      title: '数字人详情',
      icon: 'User2',
      cache: false,
      hideInMenu: true,
      requiresAuth: true,
      activeMenuKey: 'content.digitalHumans',
    },
  },
  {
    key: 'content.digitalHumanVideoTasks',
    path: '/digital-humans/videos',
    component: DigitalHumanVideoTasksPage,
    meta: {
      title: '数字人视频任务',
      icon: 'ListTodo',
      cache: true,
      requiresAuth: true,
    },
  },
  {
    key: 'content.digitalHumanVideoTaskDetail',
    path: '/digital-humans/videos/:taskId',
    component: DigitalHumanVideoTaskDetailPage,
    meta: {
      title: '数字人视频详情',
      icon: 'Clapperboard',
      cache: false,
      hideInMenu: true,
      requiresAuth: true,
      activeMenuKey: 'content.digitalHumanVideoTasks',
    },
  },
  {
    key: 'workspace.tasks',
    path: '/tasks',
    component: TaskRecordsPage,
    meta: {
      title: '任务记录',
      icon: 'ClipboardList',
      cache: true,
      requiresAuth: true,
    },
  },
  {
    key: 'workspace.assets',
    path: '/assets',
    component: AssetLibraryPage,
    meta: {
      title: '素材库',
      icon: 'FolderOpen',
      cache: true,
      requiresAuth: true,
    },
  },
]

export function getRouteByKey(routeKey: RouteKey): AppRoute {
  const route = routeRegistry.find((item) => item.key === routeKey)

  if (!route) {
    throw new Error(`Unknown route key: ${routeKey}`)
  }

  return route
}
