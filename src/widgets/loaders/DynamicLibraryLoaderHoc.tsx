import { Helmet, HelmetProvider } from 'react-helmet-async';
import { HelmetTags, StateUpdate } from 'react-helmet-async/lib/types';
import { FC, useState } from 'react';

export type DynamicLibraryLoadedHoc = {
  scriptUrl: string;
  scriptCss: string;
};

const withDynamicLibraryLoader =
  ({ scriptUrl, scriptCss }: DynamicLibraryLoadedHoc) =>
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

export default withDynamicLibraryLoader;
