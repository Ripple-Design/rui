import type { ComponentPublicInstance, PublicProps, SetupContext, VNode } from "vue"

import type { RFormInvalidSubmitEvent, RFormProps, RFormSubmitEvent, RFormValues } from "./types.ts"

type RFormEmits<TValues extends RFormValues> = {
    invalidSubmit: (event: RFormInvalidSubmitEvent<TValues>) => void
    submit: (event: RFormSubmitEvent<TValues>) => void
}

type RFormPublicProps<TValues extends RFormValues> = RFormProps<TValues> &
    PublicProps & {
        onInvalidSubmit?: (event: RFormInvalidSubmitEvent<TValues>) => void
        onSubmit?: (event: RFormSubmitEvent<TValues>) => void
    }

type RFormInstance<TValues extends RFormValues> = ComponentPublicInstance<
    RFormProps<TValues>,
    {
        submit: (nativeEvent?: SubmitEvent) => Promise<boolean>
    },
    {},
    {},
    {},
    RFormEmits<TValues>,
    RFormPublicProps<TValues>
>

type RFormComponent = {
    <TValues extends RFormValues>(
        props: RFormPublicProps<TValues>,
        context?: Pick<SetupContext<RFormEmits<TValues>>, "attrs" | "emit" | "slots">,
    ): VNode
    new <TValues extends RFormValues>(props: RFormPublicProps<TValues>): RFormInstance<TValues>
}

declare const RForm: RFormComponent

export default RForm
