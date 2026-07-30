export type RViewportBreakpoint = "sm" | "md" | "lg" | "xl"

export type RContainerBreakpoint = "csm" | "cmd" | "clg" | "cxl"

type RViewportExclusiveKeys = {
    csm?: never
    cmd?: never
    clg?: never
    cxl?: never
}

type RContainerExclusiveKeys = {
    sm?: never
    md?: never
    lg?: never
    xl?: never
}

export type RViewportResponsiveValue<T> = {
    sm: T
    md?: T
    lg?: T
    xl?: T
} & RViewportExclusiveKeys

export type RContainerResponsiveValue<T> = {
    csm: T
    cmd?: T
    clg?: T
    cxl?: T
} & RContainerExclusiveKeys

export type RResponsiveObjectValue<T> = RViewportResponsiveValue<T> | RContainerResponsiveValue<T>

export type RResponsiveValue<T> = T | RResponsiveObjectValue<T>
