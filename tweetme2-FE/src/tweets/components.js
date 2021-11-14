import React, {useEffect, useState} from 'react';
import {apiTweetCreate, apiTweetList, apiTweetAction} from './utils';

export function TweetsComponent(props){
  const [newTweets, setNewTweets] = useState([])
  const textAreaRef = React.createRef();

  // Code to handle creating tweet
  const handleSubmit = function(e){
    e.preventDefault();

    const tweetContent = textAreaRef.current.value;
    let tempNewTweets = [...newTweets];
    
    apiTweetCreate(tweetContent, (response, status)=>{
      if (status === 201){
        tempNewTweets.unshift(response);
        setNewTweets(tempNewTweets);
      } else {
        console.log(response);
        alert("An error occured when creating your Tweet.")
      }
    });
    textAreaRef.current.value = '';
  }

  // Component code
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
  // Vars
  const tweet = props.tweet;
  const action = props.action;
  const [likes, setLikes] = useState(tweet.likes ? tweet.likes : 0);
  const styles = {
      "Like": "btn btn-primary btn-sm",
      "Unlike":"btn btn-danger btn-sm",
      "Retweet": "btn btn-success btn-sm",
      "Unretweet":"btn btn-danger btn-sm",
  };
  const className = props.className ? props.className : styles[props.action];
  const buttonText = (props.action === "Like" ? likes.toString() + " " : "") + props.action + (props.action === "Like" ? "(s)" : "");

  // Functions
  const handleTweetActionEvent = (response, status) => {
    console.log(response)
    console.log(status)
    if (status === 200){
      setLikes(response.likes);
    }
  }

  const handleClick =(event) => {
    event.preventDefault();
    console.log(tweet.id)
    console.log(action)
    apiTweetAction(tweet.id, action, handleTweetActionEvent);
  }
  return (
    <button className={className} onClick={handleClick}>
      {buttonText}
    </button>
  );
}

export function ParentTweet(props){
  const tweet = props.tweet;
  return tweet.parent ? (
    <div className="row">
      <div className="col-11 mx-auto p-3 border rounded">
        <p className="mb-0 text-muted small">Retweet:</p>
        <Tweet className={' '} tweet={tweet.parent} />
      </div>
    </div>
  ) : null
}

export function Tweet(props){
    const tweet = props.tweet
    const className = props.className ? props.className : "col-10 mx-auto col-md-6"
    return (
    <div className={className}>
      <div>
        <p>{tweet.id} - {tweet.content}</p>
        <ParentTweet tweet={tweet} />
      </div>
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
      const handleTweetListLookup = (response, status) => {
        if (status === 200){
          setTweetsInit(response);
          setTweetsDidGet(true);
        }
      }
  
      apiTweetList(handleTweetListLookup);
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