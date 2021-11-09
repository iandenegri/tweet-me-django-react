import React, {useEffect, useState} from 'react';
import {loadTweets} from './utils';

export function ActionBtn(props){
    const tweet = props.tweet;
    const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0);
    const [justClicked, setJustClicked] = useState(false);
    const styles = {
        "Like": "btn btn-primary btn-sm",
        "Unlike":"btn btn-danger btn-sm",
        "Retweet": "btn btn-success btn-sm"
    };
    const className = props.className ? props.className : styles[props.action];
    const buttonText = (props.action === "Like" ? likes.toString() + " " : "") + props.action + (props.action === "Like" ? "(s)" : "");
    const handleClick =(event) => {
        event.preventDefault();
        if (props.action === "Like"){
            if (!justClicked){
                setLikes(likes + 1);
                setJustClicked(true);
            } else {
                setLikes(likes - 1);
                setJustClicked(false);
            }
        }
    }
    return (
      <button className={className} onClick={handleClick}>
        {buttonText}
      </button>
    );
}
  
export function Tweet(props){
    const {tweet} = props
    const className = props.className ? props.className : "col-10 mx-auto col-md-6"
    return (
    <div className={className}>
      <p>{tweet.id} - {tweet.content}</p>
      <div>
        <ActionBtn tweet={tweet} action="Like" />
        <ActionBtn tweet={tweet} action="Unlike" />
        <ActionBtn tweet={tweet} action="Retweet" />
      </div>
    </div>
    )
}
  
export function TweetsList(props){
    const [tweets, setTweets] = useState([]);
    const tweetsLookup = () => {
      const myCallback = (response, status) => {
        if (status === 200){
          setTweets(response);
        }
      }
      loadTweets(myCallback);
    }
  
    useEffect(tweetsLookup, []);
    return (
      tweets.map((item, index) => {
        return <Tweet tweet={item} key={`${index}-{item.id}`} className="my-5 py-5 border bg-white text-dark"/>
      })
    )
  }