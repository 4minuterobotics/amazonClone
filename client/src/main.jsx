import React from 'react';
import {createRoot} from 'react-dom/client';
import {PayPalScriptProvider} from '@paypal/react-paypal-js'
import {HelmetProvider} from 'react-helmet-async'
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import {StoreProvider} from './Store'

const root = createRoot(document.getElementById('root'));

root.render(	
	<React.StrictMode>
		<StoreProvider>
		<HelmetProvider>
		<PayPalScriptProvider deferLoading={true}> {/*derfer loading is set to true cuz i'm not loaind paypal at the beginnig of loading the app. */}
			<App />
		</PayPalScriptProvider>
		</HelmetProvider>
		</StoreProvider>
	</React.StrictMode>
);
