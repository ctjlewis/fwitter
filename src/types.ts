export interface ApplicationState {
    user?: any;
    error?: boolean | { message: string };
    fweets: any[];
    loaded: boolean;
}

export type ApplicationStateAndSetter = [
    ApplicationState,
    (ApplicationState) => void
]