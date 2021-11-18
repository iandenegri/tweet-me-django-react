import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TweetsComponent } from './tweets';

let defaultElem = document.getElementById('root');
let tweetme2Elem = document.getElementById('tweetme2');
const e = React.createElement;

if (defaultElem) {
  ReactDOM.render(
    <React.StrictMode>
      <App defaultElem />
    </React.StrictMode>,
    document.getElementById('root')
  );  
}
if (tweetme2Elem){
  const passedData = tweetme2Elem.dataset;
  const tweetsCompElem = e(TweetsComponent, passedData);

  ReactDOM.render(
    tweetsCompElem,
    document.getElementById('tweetme2')
  );  
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
