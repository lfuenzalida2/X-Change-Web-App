import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/negotiation';

const url = window.location.href;
const negotiationHtml = document.getElementById('negotiation');

if (negotiationHtml) {
  ReactDOM.render(<App url={url.slice(0, url.indexOf('/', 7))} />, negotiationHtml);
}
