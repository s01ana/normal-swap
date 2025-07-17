import { ProviderType } from '@okxweb3/dex-widget';

export const getProviderMap = () => {
    return {
        [ProviderType.EVM]: {
            metamask: window?.ethereum,
        },
    };
};
