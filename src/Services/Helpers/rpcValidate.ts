import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useEffect, useState } from 'react';
import { RPC_URL_ASTAR } from '../../Constant';

export const RpcValidate = async() => {
    
    const [api, setApi] = useState<ApiPromise>();
    const [apiReady, setApiReady] = useState(false);

        useEffect(() => {
            const provider = new WsProvider(RPC_URL_ASTAR);
            setApiReady(false);
            setApi(new ApiPromise({ provider }));
        },[]);
        
    useEffect(() => {
        if (api) {
            api.isReady
                .then(() => {
                    setApiReady(true);
                })
                .catch((error) => {
                console.error(error);
                });
        }
    }, [api]);

    return api;
}
