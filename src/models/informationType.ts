export enum InfoMessageStatus {
    Error,
    Success,
    None,
}

export type Information = {
    infoMessage: string;
    status: InfoMessageStatus;
};
