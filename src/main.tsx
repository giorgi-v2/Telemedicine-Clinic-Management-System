import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import '@fontsource-variable/noto-sans-georgian';
import { store } from './app/store';
import './patient.css';
import './styles/tailwind.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}><App /></Provider>
  </StrictMode>,
);
