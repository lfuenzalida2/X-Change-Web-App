import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/add_objects';

const addObject = document.getElementById('add_object');
const url = window.location.href;
const id = url.slice(url.lastIndexOf('/') + 1, url.length);

if (addObject) {
  ReactDOM.render(<App id={id} />, addObject);
}
