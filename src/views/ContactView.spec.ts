import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ContactView from './ContactView.vue'

async function fillForm(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('input[name="name"]').setValue('Егор')
  await wrapper.find('input[name="reply"]').setValue('hr@example.com')
  await wrapper.find('textarea[name="message"]').setValue('Привет!')
}

describe('ContactView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders contact links', () => {
    const wrapper = mount(ContactView)
    expect(wrapper.find('a[href="https://github.com/kakachaDev"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('krougzee@yandex.ru')
  })

  it('submits the netlify form payload and shows success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(ContactView)
    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/')
    expect(init.body).toContain('form-name=contact')
    expect(init.body).toContain('reply=hr%40example.com')
    expect(wrapper.find('[data-testid="form-ok"]').exists()).toBe(true)
  })

  it('shows an error message when submission fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const wrapper = mount(ContactView)
    await fillForm(wrapper)
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.find('[data-testid="form-error"]').exists()).toBe(true)
  })
})
