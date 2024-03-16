import { Helmet, HelmetProvider } from 'react-helmet-async';
import { HelmetTags, StateUpdate } from 'react-helmet-async/lib/types';
import { FC, useState } from 'react';

// make sure to set this env variables in your .env file and provide correct URL (tst/prd)
const scriptUrl = process.env.REACT_APP_GATEWAY_JS_URL as string;
const scriptCss = process.env.REACT_APP_GATEWAY_CSS_URL as string;

const gatewayLibraryLoader = () =>
  (Component: FC<any>) =>
  (props: any) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [scriptInitialized, setScriptInitialized] = useState(false);

    const handleChangeClientState = (_newState: StateUpdate, addedTags: HelmetTags) => {
      if (addedTags && addedTags.scriptTags) {
        const foundScript = addedTags.scriptTags.find(({ src }) => src === scriptUrl);
        if (foundScript) {
          window.addEventListener('ari10-transaction-window-loaded-event', () => setScriptInitialized(true), { once: true });
          foundScript.addEventListener('load', () => setScriptLoaded(true), { once: true });
        }
      }
    };

    return (
      <HelmetProvider>
        <div>
          <Helmet onChangeClientState={handleChangeClientState}>
            <script async src={scriptUrl} type='text/javascript' />
          </Helmet>
          <link rel='stylesheet' type='text/css' href={scriptCss} />
          <Component {...props} scriptLoaded={scriptLoaded && scriptInitialized} />
        </div>
      </HelmetProvider>
    );
  };

export default gatewayLibraryLoader;
