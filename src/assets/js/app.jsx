import React from 'react';
import ReactDOM from 'react-dom';
import NegotiationsList from './components/negotiation';
import ObjectForm from './components/add_object';

const url = window.location.href;
const negotiationHtml = document.getElementById('negotiation');
const objectFormHtml = document.getElementById('add_object');

if (negotiationHtml) {
  ReactDOM.render(<NegotiationsList url={url.slice(0, url.indexOf('/', 7))} />, negotiationHtml);
}

if (objectFormHtml) {
  ReactDOM.render(<ObjectForm url={url.slice(0, url.indexOf('/', 7))} />, objectFormHtml);
}
