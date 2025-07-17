"use client"

import { useProvider } from '@/hooks/use-provider';
import { createOkxSwapWidget, EthereumProvider, IWidgetConfig, IWidgetParams, OkxEvents, OkxSwapWidgetProps, ProviderEventMessage, ProviderType } from '@okxweb3/dex-widget'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useAccount } from 'wagmi';

const SwapWidget = () => {
  const widgetRef = useRef<HTMLDivElement>(null)
  const widgetHandler = useRef<ReturnType<typeof createOkxSwapWidget>>(null);
  const provider = useProvider('', widgetHandler.current?.iframeWindow as Window);

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

  const initialConfig: IWidgetConfig = {
    params,
    provider,
    listeners: [
      {
        event: OkxEvents.ON_CONNECT_WALLET,
        handler: (payload: ProviderEventMessage) => {
          openConnectModal?.();
        },
      },
      // {
      //   event: OkxEvents.ON_SUBMIT_TX,
      //   handler: (res: ProviderEventMessage) => {
      //     console.log('ON_SUBMIT_TX===>', res.data);
      //     if (res.data.txHash) {
      //       setMessage(`Transaction submitted successfully, txHash: ${res.data.txHash}`);
      //       setOpen(true);
      //     }
      //   },
      // },
      // {
      //   event: OkxEvents.ON_FROM_CHAIN_CHANGE,
      //   handler: (res: ProviderEventMessage) => {
      //     console.log('ON_FROM_CHAIN_CHANGE===>', res.data);
      //   },
      // },
    ]
  }

  useEffect(() => {
    widgetHandler.current = createOkxSwapWidget(widgetRef.current as HTMLDivElement, initialConfig);

    return () => {
      widgetHandler.current?.destroy();
    };
  }, []);

  const { connector } = useAccount();

  const getProviderType = useCallback(() => {
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
        updateProvider: (newProvider: EthereumProvider, providerType: ProviderType) => {
          setOpen(false);
          widgetHandler.current?.updateProvider(newProvider, providerType);
        },
        destroy: () => {
          setOpen(false);
          widgetHandler.current?.destroy();
        },
        reload: (params: IWidgetParams) => {
          setOpen(false);
          widgetHandler.current?.destroy();
          widgetHandler.current = createOkxSwapWidget(widgetRef.current as HTMLDivElement, {
            ...(initialConfig),
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