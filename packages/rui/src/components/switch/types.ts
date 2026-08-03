import type { RippleOptions } from "@/foundations/ripple"

/** Props for the {@link RSwitch} component. */
export type RSwitchProps = {
 /** Disables the switch and all interactive feedback. */
 disabled?: boolean
 /** Controls ripple behavior or disables it entirely. */
 ripple?: boolean | RippleOptions
}
