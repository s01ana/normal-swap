"use client"

import { useProvider } from '@/hooks/use-provider';
import { createOkxSwapWidget, IWidgetConfig, OkxSwapWidgetProps, ProviderEventMessage, ProviderType } from '@okxweb3/dex-widget'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

const SwapWidget = () => {
  const widgetRef = useRef<HTMLDivElement>(null)
  const widgetHandler = useRef<ReturnType<typeof createOkxSwapWidget>>(null);
  const provider = useProvider('', widgetHandler.current?.iframeWindow as any);

  console.log('provider===>', provider);

  const { open: openConnectModal } = useAppKit()
  const { isConnected } = useAppKitAccount()

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const params: OkxSwapWidgetProps['params'] = {
    chainIds: [1, 56],
    lang: "en_us",
    providerType: 'EVM',
    theme: 'dark',
    tradeType: 'swap',
    feeConfig: {
      1: {
        referrerAddress: '0x0C629FbE26FF641A28729e7d82a1329a8010bE60',
        feePercent: 3,
      },
      56: {
        referrerAddress: '0x0C629FbE26FF641A28729e7d82a1329a8010bE60',
        feePercent: 3,
      }
    }
  }

  const initialConfig = {
    params,
    provider,
    listeners: [
      {
        event: 'ON_CONNECT_WALLET',
        handler: (payload: ProviderEventMessage) => {
          console.log('NO_WALLET_CONNECT===>', payload);
          openConnectModal?.();
        },
      },
      {
        event: 'ON_SUBMIT_TX',
        handler: (res: any) => {
          console.log('ON_SUBMIT_TX===>', res.data);
          if (res.data.txHash) {
            setMessage(`Transaction submitted successfully, txHash: ${res.data.txHash}`);
            setOpen(true);
          }
        },
      },
      {
        event: 'ON_FROM_CHAIN_CHANGE',
        handler: (res: any) => {
          console.log('ON_FROM_CHAIN_CHANGE===>', res.data);
        },
      },
    ]
  }

  useEffect(() => {
    widgetHandler.current = createOkxSwapWidget(widgetRef.current as HTMLDivElement, initialConfig as unknown as IWidgetConfig);

    return () => {
      widgetHandler.current?.destroy();
    };
  }, []);

  const { connector } = useAccount();

  const getProviderType = useCallback(() => {
    console.log('getProviderType====>', connector);
    const isWalletConnect =
      connector?.id === 'walletConnect' || connector?.type === 'walletConnect';

    if (!connector) {
      return undefined;
    }
    const providerType = isWalletConnect ? ProviderType.WALLET_CONNECT : ProviderType.EVM;
    return providerType;
  }, [connector]);

  useEffect(() => {
    if (widgetHandler.current && provider) {
      widgetHandler.current?.updateProvider(provider, getProviderType()!);
    }
  }, [provider, getProviderType]);

  useImperativeHandle(
    null,
    () => {
      return {
        updateParams: (newParams: OkxSwapWidgetProps['params']) => {
          setOpen(false);
          widgetHandler.current?.updateParams(newParams);
        },
        updateProvider: (newProvider: any, providerType: ProviderType) => {
          setOpen(false);
          widgetHandler.current?.updateProvider(newProvider, providerType);
        },
        destroy: () => {
          setOpen(false);
          widgetHandler.current?.destroy();
        },
        reload: (params: any) => {
          setOpen(false);
          widgetHandler.current?.destroy();
          widgetHandler.current = createOkxSwapWidget(widgetRef.current as HTMLDivElement, {
            ...(initialConfig as unknown as IWidgetConfig),
            params,
          });
        },
      };
    },
    [openConnectModal],
  );

  return (
    <>
      <div className='flex justify-center items-center w-full'>
        <div ref={widgetRef} className="okx-swap-widget" />
      </div>
    </>
  )
}

export default SwapWidget;