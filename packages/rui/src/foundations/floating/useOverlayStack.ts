import { shallowReactive } from "vue"

import { RUI_FLOATING_Z_INDEX_BASE } from "./constants"

type FloatingLayer = {
    id: symbol
    zIndex: number
}

const layers = shallowReactive<FloatingLayer[]>([])

function syncZIndexes() {
    layers.forEach((layer, index) => {
        layer.zIndex = RUI_FLOATING_Z_INDEX_BASE + index
    })
}

export function useOverlayStack() {
    function register() {
        const layer: FloatingLayer = {
            id: Symbol("floating-layer"),
            zIndex: RUI_FLOATING_Z_INDEX_BASE + layers.length,
        }

        layers.push(layer)
        syncZIndexes()

        return layer
    }

    function unregister(id: symbol) {
        const index = layers.findIndex((layer) => layer.id === id)
        if (index === -1) {
            return
        }

        layers.splice(index, 1)
        syncZIndexes()
    }

    function isTopLayer(id: symbol) {
        return layers.at(-1)?.id === id
    }

    return {
        isTopLayer,
        register,
        unregister,
    }
}
