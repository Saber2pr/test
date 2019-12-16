/*
 * @Author: saber2pr
 * @Date: 2019-12-07 15:20:04
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-12-16 14:43:31
 */
let MAX_STACK_SIZE = 10000
const MAX_STACK_ID = Symbol("MAX_STACK_ID")

export type StackSizeMap = { [id: string]: number }
export type StackListener = (
  stackSize: { id: string; size: number },
  stackSizeMap: StackSizeMap
) => void

let listeners: StackListener[]

function TestStackSize(id = "default") {
  if (!TestStackSize[MAX_STACK_ID]) {
    TestStackSize.resetStack()
  }
  const size = TestStackSize[MAX_STACK_ID]

  if (id in size) {
    size[id]++
  } else {
    size[id] = 1
  }

  if (size[id] > MAX_STACK_SIZE) {
    throw new Error(
      `STACK SIZE OVERFLOW: ${id}, try to reset the MAX_STACK_SIZE(${MAX_STACK_SIZE}).`
    )
  }

  if (listeners) {
    listeners.forEach(listener => listener({ id, size: size[id] }, size))
  }
}

namespace TestStackSize {
  export const setMaxStackSize = (size: number) => {
    MAX_STACK_SIZE = size
  }

  export const resetStackSize = (id = "default") => {
    const size = TestStackSize[MAX_STACK_ID]
    if (size) {
      size[id] = 0
    }
  }

  export const resetStack = () => {
    TestStackSize[MAX_STACK_ID] = {}
  }

  export const watchStackSize = (callback: StackListener) => {
    if (!listeners) {
      listeners = []
    }

    listeners.push(callback)
    return () => {
      listeners.splice(listeners.indexOf(callback), 1)
    }
  }
}

export { TestStackSize }
