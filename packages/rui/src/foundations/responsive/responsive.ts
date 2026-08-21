export type RViewportBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

export type RViewportResponsiveValue<T> = {
    xs: T
    sm?: T
    md?: T
    lg?: T
    xl?: T
    xxl?: T
}

export type RResponsiveValue<T> = T | RViewportResponsiveValue<T>
