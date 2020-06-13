import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/add_objects';
import negotiation from './components/negotiation';

const addObjectHtml = document.getElementById('add_object');
const url = window.location.href;
const id = url.slice(url.lastIndexOf('/') + 1, url.length);
console.log(url.slice(0, url.indexOf('/', 7)));

if (addObjectHtml) {
  ReactDOM.render(<App id={id} url={url.slice(0, url.indexOf('/', 7))} />, addObjectHtml);
}

const negotiationHtml = document.getElementById('negotiation');

if (negotiationHtml) {
  ReactDOM.render(<negotiation id={id} />, negotiationHtml);
}