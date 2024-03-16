import { useEffect } from 'react';
import gatewayLibraryLoader from './loaders/GatewayLibraryLoaderHoc';

export type ExchangeWidgetProps = {
  scriptLoaded: boolean; // ignore this prop, it's injected by HOC
  widgetId: string; // your widget id (required)
  widgetLanguage: string; // ISO Alpha-2 language code e.g. 'en', 'pl' (default 'en')
};

const ExchangeWidget = ({ scriptLoaded, widgetId, widgetLanguage }: ExchangeWidgetProps) => {
  useEffect(() => {
    window.widget_id_6851681344231 = widgetId;
    window.widget_language_1776290735652 = widgetLanguage;
  }, [widgetId, widgetLanguage]);

  const dispatchStartTransactionEvent = (buyCurrencyCode: string, offerCurrencyCode: string, offerAmount: string) => {
    window.dispatchEvent(
      new CustomEvent('ari10-widget-start-transaction-request', {
        detail: {
          buyCurrencyCode,
          offerMoney: {
            amount: offerAmount,
            currencyCode: offerCurrencyCode,
          },
        },
      })
    );
  };

  return (
    <div>
      <button onClick={() => dispatchStartTransactionEvent('ARI10', 'PLN', '100')} disabled={!scriptLoaded}>
        Start transaction
      </button>
    </div>
  );
};

export default gatewayLibraryLoader()(ExchangeWidget);
