import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import AdptDialog from '@/lib/components/overlay/adpt-dialog/index.vue'

describe('adpt-dialog', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: function showModal(this: HTMLDialogElement) {
        this.setAttribute('open', '')
      },
    })

    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: function close(this: HTMLDialogElement) {
        this.removeAttribute('open')
      },
    })

    Object.defineProperty(HTMLDialogElement.prototype, 'focus', {
      configurable: true,
      value: function focus(this: HTMLDialogElement) {
        this.setAttribute('data-focused', 'true')
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('applies a closing state before fully closing the dialog', async () => {
    vi.useFakeTimers()

    const wrapper = mount(AdptDialog, {
      global: {
        provide: {
          fw: {
            cx: (name: string) => `fw-${name}`,
          },
        },
        stubs: {
          AdptButton: {
            template: '<button />',
            emits: ['clicked'],
          },
        },
      },
    })

    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    wrapper.vm.open()
    await nextTick()

    expect(dialog.hasAttribute('open')).toBe(true)
    expect(dialog.classList.contains('is-closing')).toBe(false)
    expect(dialog.classList.contains('is-opening')).toBe(true)

    wrapper.vm.close()
    await nextTick()

    expect(dialog.classList.contains('is-closing')).toBe(true)

    vi.advanceTimersByTime(260)
    await nextTick()

    expect(dialog.hasAttribute('open')).toBe(false)
  })

  it('starts the closing animation when the dialog is dismissed with Escape', async () => {
    vi.useFakeTimers()

    const wrapper = mount(AdptDialog, {
      global: {
        provide: {
          fw: {
            cx: (name: string) => `fw-${name}`,
          },
        },
        stubs: {
          AdptButton: {
            template: '<button />',
            emits: ['clicked'],
          },
        },
      },
    })

    const dialog = wrapper.get('dialog').element as HTMLDialogElement

    wrapper.vm.open()
    await nextTick()

    dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    await nextTick()

    expect(dialog.classList.contains('is-closing')).toBe(true)

    vi.advanceTimersByTime(260)
    await nextTick()

    expect(dialog.hasAttribute('open')).toBe(false)
  })
})
