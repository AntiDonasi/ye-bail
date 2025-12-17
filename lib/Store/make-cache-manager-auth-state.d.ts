export const __esModule: boolean;
declare const makeCacheManagerAuthState: (store: any, sessionKey: string, opts?: {
    logger?: any;
}) => Promise<{
    clearState: () => Promise<void>;
    saveCreds: () => Promise<void>;
    state: {
        creds: any;
        keys: {
            get: (type: any, ids: any) => Promise<any>;
            set: (data: any) => Promise<void>;
        };
    };
}>;
export default makeCacheManagerAuthState;

