import type { BreadcrumbItem } from '../types'

interface UseBreadcrumbOptions {
  songTitle?: string
}

export function useBreadcrumb(_options?: UseBreadcrumbOptions): BreadcrumbItem[] {
  return []
}
