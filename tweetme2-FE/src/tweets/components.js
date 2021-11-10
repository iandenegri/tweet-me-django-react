import React, {useEffect, useState} from 'react';
import {loadTweets, createTweet} from './utils';

export function TweetsComponent(props){
  const [newTweets, setNewTweets] = useState([])
  const textAreaRef = React.createRef();

  const handleSubmit = function(e){
    e.preventDefault();
    const tweetContent = textAreaRef.current.value;
    let tempNewTweets = [...newTweets];
    createTweet(tweetContent, (response, status)=>{
      if (status === 201){
        tempNewTweets.unshift(response);
      } else {
        console.log(response);
        alert("An error occured when creating your Tweet.")
      }
    });
    setNewTweets(tempNewTweets);
    textAreaRef.current.value = '';
  }
  return (
    <div className={props.className}>
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit}>
          <textarea ref={textAreaRef} className="form-control" name="tweet" required={true}></textarea>
          <button type="submit" className="btn btn-primary my-3">Tweet</button>
        </form>
      </div>
      <TweetsList newTweets={newTweets}/>
    </div>
  )
}

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
  const [tweetsInit, setTweetsInit] = useState([]);
  const [tweetsList, setTweetsList] = useState([]);
  const [tweetsDidGet, setTweetsDidGet] = useState(false);

  const addNewTweets = () => {
    const finalList = [...props.newTweets].concat(tweetsInit);
    if (finalList.length !== tweetsList.length){
      setTweetsList(finalList);
    }
  }

  const tweetsLookup = () => {
    // If we haven't gotten tweets, get them
    if (tweetsDidGet === false){
      const myCallback = (response, status) => {
        if (status === 200){
          setTweetsInit(response);
          setTweetsDidGet(true);
        }
      }
  
      loadTweets(myCallback);
    }
  }
  useEffect(addNewTweets, [props.newTweets, tweetsInit, tweetsList]);
  useEffect(tweetsLookup, [tweetsDidGet]);
  return (
    tweetsList.map((item, index) => {
      return <Tweet tweet={item} key={`${index}-{item.id}`} className="my-5 py-5 border bg-white text-dark"/>
    })
  )
}