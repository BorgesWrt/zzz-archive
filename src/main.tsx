import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
const root=document.getElementById('root')!;
const app=<React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>;
// Static HTML represents the unfiltered route. Query-driven tools render from their shared URL.
if(root.dataset.prerender&&!window.location.search)hydrateRoot(root,app);else createRoot(root).render(app);

