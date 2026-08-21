export type RViewportBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

export type RContainerBreakpoint = "cxs" | "csm" | "cmd" | "clg" | "cxl" | "cxxl"

type RViewportExclusiveKeys = {
    cxs?: never
    csm?: never
    cmd?: never
    clg?: never
    cxl?: never
    cxxl?: never
}

type RContainerExclusiveKeys = {
    xs?: never
    sm?: never
    md?: never
    lg?: never
    xl?: never
    xxl?: never
}

export type RViewportResponsiveValue<T> = {
    xs: T
    sm?: T
    md?: T
    lg?: T
    xl?: T
    xxl?: T
} & RViewportExclusiveKeys

export type RContainerResponsiveValue<T> = {
    cxs: T
    csm?: T
    cmd?: T
    clg?: T
    cxl?: T
    cxxl?: T
} & RContainerExclusiveKeys

export type RResponsiveObjectValue<T> = RViewportResponsiveValue<T> | RContainerResponsiveValue<T>

export type RResponsiveValue<T> = T | RResponsiveObjectValue<T>
