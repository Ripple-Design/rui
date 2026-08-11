type RFormRecord = Record<string, unknown>

function isRecord(value: unknown): value is RFormRecord {
    return typeof value === "object" && value != null && !Array.isArray(value) && !(value instanceof Date)
}

export function normalizePath(path: string) {
    return path.split(".").filter(Boolean).join(".")
}

export function getAtPath(value: unknown, path: string): unknown {
    const normalizedPath = normalizePath(path)
    if (!normalizedPath) {
        return value
    }

    return normalizedPath.split(".").reduce<unknown>((current, segment) => {
        if (Array.isArray(current)) {
            const index = Number(segment)
            return Number.isInteger(index) ? current[index] : undefined
        }

        if (isRecord(current)) {
            return current[segment]
        }

        return undefined
    }, value)
}

export function setAtPath(target: RFormRecord, path: string, value: unknown) {
    const segments = normalizePath(path).split(".").filter(Boolean)
    if (segments.length === 0) {
        return
    }

    let current: RFormRecord | unknown[] = target

    for (let index = 0; index < segments.length - 1; index += 1) {
        const segment = segments[index]!
        const nextSegment = segments[index + 1]!
        const nextIsArray = Number.isInteger(Number(nextSegment))
        const existing: unknown = Array.isArray(current) ? current[Number(segment)] : current[segment]

        if (!isRecord(existing) && !Array.isArray(existing)) {
            const next = nextIsArray ? [] : {}

            if (Array.isArray(current)) {
                current[Number(segment)] = next
            } else {
                current[segment] = next
            }

            current = next
            continue
        }

        current = existing
    }

    const lastSegment = segments.at(-1)!
    if (Array.isArray(current)) {
        current[Number(lastSegment)] = value
        return
    }

    current[lastSegment] = value
}

export function deepClone<TValue>(value: TValue): TValue {
    if (value instanceof Date) {
        return new Date(value) as TValue
    }

    if (Array.isArray(value)) {
        return value.map((item) => deepClone(item)) as TValue
    }

    if (isRecord(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, deepClone(item)])) as TValue
    }

    return value
}

export function replaceRecord(target: RFormRecord, source: RFormRecord) {
    for (const key of Object.keys(target)) {
        if (!(key in source)) {
            delete target[key]
        }
    }

    for (const [key, value] of Object.entries(source)) {
        target[key] = deepClone(value)
    }
}

export function isEmptyValue(value: unknown) {
    return value == null || value === "" || (Array.isArray(value) && value.length === 0)
}
