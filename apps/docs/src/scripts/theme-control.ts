import { applyTheme } from "@ripple-design/rui"

const themePopover = document.querySelector("[data-theme-popover]")
const primaryInput = document.querySelector("[data-primary-input]")
const primaryReset = document.querySelector("[data-primary-reset]")
const primaryApply = document.querySelector("[data-primary-apply]")
const storedPrimary = localStorage.getItem("rui-docs-primary")
const defaultPrimary = "#6200ee"

if (primaryInput instanceof HTMLInputElement) {
    primaryInput.value = storedPrimary ?? defaultPrimary
}

function applyPrimaryColor(value: string) {
    if (!value) {
        localStorage.removeItem("rui-docs-primary")
        document.documentElement.style.removeProperty("--rui-sys-color-primary")
        return
    }

    applyTheme({ color: { primary: value } })
    localStorage.setItem("rui-docs-primary", value)
}

if (primaryApply instanceof HTMLButtonElement && primaryInput instanceof HTMLInputElement) {
    primaryApply.addEventListener("click", () => {
        applyPrimaryColor(primaryInput.value.trim())
        if (themePopover instanceof HTMLDetailsElement) {
            themePopover.open = false
        }
    })
}

if (primaryReset instanceof HTMLButtonElement && primaryInput instanceof HTMLInputElement) {
    primaryReset.addEventListener("click", () => {
        primaryInput.value = defaultPrimary
        localStorage.removeItem("rui-docs-primary")
        document.documentElement.style.removeProperty("--rui-sys-color-primary")
        if (themePopover instanceof HTMLDetailsElement) {
            themePopover.open = false
        }
    })
}
