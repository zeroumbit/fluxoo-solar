import { describe, it, expect } from 'vitest'

describe('Global Store', () => {
  it('should toggle sidebar state', async () => {
    const { useGlobalStore } = await import('@/stores/global-store')
    
    const initialState = useGlobalStore.getState()
    expect(initialState.isSidebarOpen).toBe(true)

    useGlobalStore.getState().toggleSidebar()
    expect(useGlobalStore.getState().isSidebarOpen).toBe(false)

    useGlobalStore.getState().toggleSidebar()
    expect(useGlobalStore.getState().isSidebarOpen).toBe(true)
  })
})
