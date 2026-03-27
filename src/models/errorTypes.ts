export type BackendError = {
    error: string
}

export const BackednErrorPresent = (beError: BackendError) => beError.error != '';