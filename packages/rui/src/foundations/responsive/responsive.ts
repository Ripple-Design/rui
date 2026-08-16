export type RViewportBreakpoint = "sm" | "md" | "lg" | "xl" | "xxl"

export type RContainerBreakpoint = "csm" | "cmd" | "clg" | "cxl" | "cxxl"

type RViewportExclusiveKeys = {
    csm?: never
    cmd?: never
    clg?: never
    cxl?: never
    cxxl?: never
}

type RContainerExclusiveKeys = {
    sm?: never
    md?: never
    lg?: never
    xl?: never
    xxl?: never
}

export type RViewportResponsiveValue<T> = {
    sm: T
    md?: T
    lg?: T
    xl?: T
    xxl?: T
} & RViewportExclusiveKeys

export type RContainerResponsiveValue<T> = {
    csm: T
    cmd?: T
    clg?: T
    cxl?: T
    cxxl?: T
} & RContainerExclusiveKeys

export type RResponsiveObjectValue<T> = RViewportResponsiveValue<T> | RContainerResponsiveValue<T>

export type RResponsiveValue<T> = T | RResponsiveObjectValue<T>
