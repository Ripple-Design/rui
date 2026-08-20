import type { RDataTableSelectItemKey } from "../components/dataTable"

export function getObjectValueByPath(object: unknown, path: string | null | undefined): unknown {
    if (!path) return object
    return path.split(".").reduce<unknown>((value, key) => {
        if (value != null && typeof value === "object") return (value as Record<string, unknown>)[key]
        return undefined
    }, object)
}

export function getPropertyFromItem<T>(
    item: T,
    property: RDataTableSelectItemKey<T> | null | undefined,
    fallback?: unknown,
): unknown {
    if (property == null) return fallback
    if (typeof property === "function") return property(item, fallback)
    if (typeof property !== "string")
        return property.reduce<unknown>((value, key) => getObjectValueByPath(value, key), item)
    return getObjectValueByPath(item, property) ?? fallback
}

export function toUnit(value: string | number | undefined): string | undefined {
    if (value == null || value === "") return undefined
    return typeof value === "number" ? `${value}px` : value
}

export function deepEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true
    if (!a || !b || typeof a !== "object" || typeof b !== "object") return false
    const aEntries = Object.entries(a as Record<string, unknown>)
    const bEntries = Object.entries(b as Record<string, unknown>)
    return (
        aEntries.length === bEntries.length &&
        aEntries.every(([key, value]) => deepEqual(value, (b as Record<string, unknown>)[key]))
    )
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}
