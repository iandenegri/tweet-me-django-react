import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TweetsComponent, TweetDetailComponent, FeedComponent, ProfileBadgeComponent } from './tweets';

let defaultElem = document.getElementById('root');
let tweetme2Elem = document.getElementById('tweetme2');
let tweetFeedElem = document.getElementById('tweetme2-feed');
let tweetDetailElem = document.querySelectorAll('.tweetme2-detail');
let profileBadgeElem = document.querySelectorAll('.tweetme2-profile-badge')
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
    tweetme2Elem
  );  
}

if (tweetFeedElem){
  const passedData = tweetFeedElem.dataset;
  const FeedCompElem = e(FeedComponent, passedData);

  ReactDOM.render(
    FeedCompElem,
    tweetFeedElem
  );  
}

tweetDetailElem.forEach(container=> {
  const passedData = container.dataset;
  const tweetDetailCompElem = e(TweetDetailComponent, passedData);
  ReactDOM.render(
    tweetDetailCompElem,
    container
  );
})

profileBadgeElem.forEach(container=> {
  const passedData = container.dataset;
  const profileBadgeCompElem = e(ProfileBadgeComponent, passedData);
  ReactDOM.render(
    profileBadgeCompElem,
    container
  );
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
