import React from 'react';
import ReactDOM from 'react-dom';
import NegotiationsList from './components/negotiation';
import ObjectForm from './components/add_object';
import RegisterForm from './components/register';

const url = window.location.href;
const negotiationHtml = document.getElementById('negotiation');
const objectFormHtml = document.getElementById('add_object');
const registerForm = document.getElementById('register_form');

if (negotiationHtml) {
  ReactDOM.render(<NegotiationsList url={url.slice(0, url.indexOf('/', 10))} />, negotiationHtml);
}

if (objectFormHtml) {
  ReactDOM.render(<ObjectForm url={url.slice(0, url.indexOf('/', 10))} />, objectFormHtml);
}

if (registerForm) {
  ReactDOM.render(<RegisterForm url={url.slice(0, url.indexOf('/', 10))} />, registerForm);
}
