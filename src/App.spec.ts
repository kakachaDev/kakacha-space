import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// App.vue itself requires router-view (added in Task 4). For this
// scaffold-only smoke test we mount a stand-in root with the same id
// to verify the test toolchain (Vitest + jsdom + @vue/test-utils) works.
const StubRoot = defineComponent({
  render: () => h('div', { id: 'app-root' }, 'ok'),
})

describe('test toolchain', () => {
  it('mounts a component and finds it by id', () => {
    const wrapper = mount(StubRoot)
    expect(wrapper.find('#app-root').exists()).toBe(true)
  })
})
