import type { UnwrapRef } from 'vue'

declare global {
  type UnwrapRef<T> = import('vue').UnwrapRef<T>
}
