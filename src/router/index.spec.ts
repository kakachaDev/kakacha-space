import { describe, it, expect } from 'vitest'
import router from './index'

describe('router', () => {
  it('resolves known routes normally', () => {
    const resolved = router.resolve('/projects')
    expect(resolved.name).toBe('projects')
  })

  it('resolves unmatched paths to the not-found route', () => {
    const resolved = router.resolve('/this/path/does/not/exist')
    expect(resolved.name).toBe('not-found')
  })

  it('navigating to an unmatched path lands on the not-found route', async () => {
    await router.push('/some/nonexistent/page')
    expect(router.currentRoute.value.name).toBe('not-found')
  })
})
