import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<<<<<<< HEAD
<<<<<<< HEAD
=======
  
>>>>>>> 900a47ebafb3058221e19406e7115d342661060e
=======
  
>>>>>>> 900a47ebafb3058221e19406e7115d342661060e
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
        <App />
        </PersistGate>
    </Provider>
<<<<<<< HEAD
<<<<<<< HEAD
=======
  
>>>>>>> 900a47ebafb3058221e19406e7115d342661060e
=======
  
>>>>>>> 900a47ebafb3058221e19406e7115d342661060e
);

reportWebVitals();