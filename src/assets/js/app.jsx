import React from 'react';
import ReactDOM from 'react-dom';
import NegotiationsList from './components/negotiation';
import ObjectForm from './components/add_object';
import RegisterForm from './components/register';
import ProfilePic from './components/profile_pic';

const url = window.location.href;
const negotiationHtml = document.getElementById('negotiation');
const objectFormHtml = document.getElementById('add_object');
const objectInventoryFormHtml = document.getElementById('add_object_inventory');
const registerForm = document.getElementById('register_form');
const profilePicForm = document.getElementById('profilePic');

let idParam = url.slice(url.lastIndexOf('/') + 1, url.length);
if (!parseInt(idParam, 10)) {
  idParam = null;
}

if (negotiationHtml) {
  ReactDOM.render(<NegotiationsList url={url.slice(0, url.indexOf('/', 10))} id={idParam} />, negotiationHtml);
}

if (objectFormHtml) {
  ReactDOM.render(<ObjectForm url={url.slice(0, url.indexOf('/', 10))} />, objectFormHtml);
}

if (objectInventoryFormHtml) {
  ReactDOM.render(<ObjectForm url={url.slice(0, url.indexOf('/', 10))} />, objectInventoryFormHtml);
}

if (registerForm) {
  ReactDOM.render(<RegisterForm url={url.slice(0, url.indexOf('/', 10))} />, registerForm);
}

if (profilePicForm) {
  ReactDOM.render(<ProfilePic url={url.slice(0, url.indexOf('/', 10))} />, profilePicForm);
}
