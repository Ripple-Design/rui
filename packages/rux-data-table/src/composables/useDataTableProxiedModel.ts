import { computed, getCurrentInstance, ref, type Ref } from "vue"

function kebabCase(value: string) {
    return value.replace(/[A-Z]/g, character => `-${character.toLowerCase()}`)
}

export function useDataTableProxiedModel<T>(props: Record<string, unknown>, key: string, emit: (value: T) => void, defaultValue: () => T): Ref<T> {
    const instance = getCurrentInstance()
    const vnodeProps = instance?.vnode.props ?? {}
    const updateEvent = `onUpdate:${key}`
    const controlled = (key in vnodeProps || kebabCase(key) in vnodeProps) && updateEvent in vnodeProps
    const internal = ref(defaultValue()) as Ref<T>

    return computed({
        get: () => controlled ? props[key] as T : internal.value,
        set: (value) => {
            const current = controlled ? props[key] as T : internal.value
            if (Object.is(current, value)) return
            if (!controlled) internal.value = value
            emit(value)
        },
    })
}
