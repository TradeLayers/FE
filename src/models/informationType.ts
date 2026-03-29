export enum InfoMessageStatus {
    Error = 'Error',
    Success = 'Success',
    None = 'None',
}

export type Information = {
    infoMessage: string;
    status: InfoMessageStatus;
};
