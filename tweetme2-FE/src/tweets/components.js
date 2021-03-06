import React, {useEffect, useState} from 'react';
import numeral from 'numeral';
import {apiTweetCreate, apiTweetList, apiTweetAction, apiTweetDetail, apiTweetFeed, apiProfileDetail, apiProfileFollow} from './utils';

export function TweetsComponent(props){
  const canTweet = props.canTweet === "false" ? false : true;
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
      {canTweet && <div className="col-12 mb-3">
        <form onSubmit={handleSubmit}>
          <textarea ref={textAreaRef} className="form-control" name="tweet" required={true}></textarea>
          <button type="submit" className="btn btn-primary my-3">Tweet</button>
        </form>
      </div>}
      <TweetsList newTweets={newTweets} {...props} />
    </div>
  )
}

export function FeedComponent(props){
  const canTweet = props.canTweet === "false" ? false : true;
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
      {canTweet && <div className="col-12 mb-3">
        <form onSubmit={handleSubmit}>
          <textarea ref={textAreaRef} className="form-control" name="tweet" required={true}></textarea>
          <button type="submit" className="btn btn-primary my-3">Tweet</button>
        </form>
      </div>}
      <TweetFeedList newTweets={newTweets} {...props} />
    </div>
  )
}

export function TweetFeedList(props){
  const username = props.username;
  const [tweetsInit, setTweetsInit] = useState([]);
  const [tweetsList, setTweetsList] = useState([]);
  const [tweetsDidGet, setTweetsDidGet] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);

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
          setNextUrl(response.next);
          setTweetsInit(response.results);
          setTweetsDidGet(true);
        } else {
          alert("there was an error!");
        }
      }
  
      apiTweetFeed(handleTweetListLookup);
    }
  }
  useEffect(addNewTweets, [props.newTweets, tweetsInit, tweetsList]);
  useEffect(tweetsLookup, [tweetsDidGet, username]);

  const handleDidRetweet = (newTweet) => {
    const updatedTweetsInit = [...tweetsInit];
    updatedTweetsInit.unshift(newTweet);
    setTweetsInit(updatedTweetsInit);

    const updatedTweetsList = [...tweetsList];
    updatedTweetsList.unshift(newTweet);
    setTweetsList(updatedTweetsList);
  }

  const handleLoadNext = (event) => {
    event.preventDefault();
    if (nextUrl !== null){
      const handleLoadNextResponse = (response, status)=>{
        if (status === 200){
          const newTweets = [...tweetsList].concat(response.results)
          setNextUrl(response.next);
          setTweetsInit(newTweets);
          setTweetsList(newTweets);
        } else {
          alert("there was an error!");
        }
      }
      apiTweetFeed(handleLoadNextResponse, nextUrl)
    }
  }

  return (<React.Fragment>{
    tweetsList.map((item, index) => {
      return <Tweet tweet={item} key={`${index}-{item.id}`} didRetweet={handleDidRetweet} className="my-5 py-5 border bg-white text-dark"/>
    })}
    { nextUrl !== null && <button className='btn btn-outline-primary' onClick={handleLoadNext}>Load Next</button>}
    </React.Fragment>
  )
}

export function TweetDetailComponent(props){
  const tweetId = props.tweetId;
  const className = props.className;
  const [didLookup, setDidLookup] = useState(false);
  const [tweet, setTweet] = useState(null);

  const handleBackendLookup = (response, status) => {
    if (status === 200){
      setTweet(response);
    } else {
      alert("There was an error finding the tweet.");
    }
  }

  const backendCall = () => {
    if (didLookup === false){
      apiTweetDetail(tweetId, handleBackendLookup);
      setDidLookup(true);
    }
  }

  useEffect(backendCall, [tweetId, didLookup, setDidLookup]);

  return tweet === null ? null : <Tweet tweet={tweet} className={className} />
}

export function ParentTweet(props){
  const tweet = props.tweet;
  const retweeter = props.retweeter;
  return tweet.parent ? <Tweet className={' '} tweet={tweet.parent} retweeter={retweeter} hideActions isRetweet /> : null;
}

export function AuthorPicture(props){
  const author = props.author;
  return (
    <AuthorLink username={author.username}><span className="mx-1 my-3 rounded-circle px-3 py-2 bg-dark text-white">{author.first_name[0]}</span></AuthorLink>
  )
}

export function AuthorLink(props){
  const username = props.username;
  const handleAuthorLink = (event) => {
    window.location.href = `/profile/${username}`
  }

  return (
    <span className='pointer' onClick={handleAuthorLink}>
    {props.children}
    </span>
  )
}

export function AuthorNameDisplay(props){
  const author = props.author;
  const includeFullName = props.includeFullName;
  const hideLink = props.hideLink;
  const nameDisplay = includeFullName === true ? `${author.first_name} ${author.last_name}` : null

  return (
    <React.Fragment>{nameDisplay}{" "}
    {hideLink === true ? `@${author.username}` : <AuthorLink username={author.username}>@{author.username}</AuthorLink>}
    </React.Fragment>
  )
}

export function ProfileBadge(props){
  const user = props.user;
  const didFollowToggle = props.didFollowToggle;
  const profileLoading = props.profileLoading;
  let currentAction = (user && user.is_following) ? "Unfollow" : "Follow";
  currentAction = profileLoading ? "Loading..." : currentAction;
  const handleToggleFollow = (event) => {
    event.preventDefault();
    if (didFollowToggle && !profileLoading){
      didFollowToggle(currentAction);
    }
  }
  return user ? <div>
    <AuthorPicture author={user} />
    <p><AuthorNameDisplay author={user} includeFullName={true} hideLink={true} /></p>
    <p>Follower(s): {numeral(user.follower_count).format("0a")}</p>
    <p>Following: {numeral(user.following_count).format("0a")}</p>
    <p>{user.bio}</p>
    <p>{user.location}</p>
    <button className="btn btn-primary" onClick={handleToggleFollow} >{currentAction}</button>
  </div> : null
}

export function ProfileBadgeComponent(props){
  const username = props.username;

  const [didLookup, setDidLookup] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  // lookup
  const handleBackendLookup = (response, status) => {
    if (status === 200){
      setProfile(response);
    } 
  }

  const backendCall = () => {
    if (didLookup === false){
      apiProfileDetail(username, handleBackendLookup);
      setDidLookup(true);
    }
  }
  useEffect(backendCall, [username, didLookup, setDidLookup]);

  const handleNewFollow = (actionVerb) => {
    apiProfileFollow(username, actionVerb, (response, status) => {
      if (status === 200){
        setProfile(response["data"]);
      }
      setProfileLoading(false);
    });
    setProfileLoading(true);
  }

  // return
  return didLookup === false ? "Loading..." : profile ? <ProfileBadge user={profile} didFollowToggle={handleNewFollow} profileLoading={profileLoading} /> : null;
}


export function Tweet(props){
    const tweet = props.tweet;
    const didRetweet = props.didRetweet;
    const hideActions = props.hideActions;
    const isRetweet = props.isRetweet;
    const retweeter = props.retweeter;
    const [actionTweet, setActionTweet] = useState(props.tweet ? props.tweet : null);
    let className = props.className ? props.className : "col-10 mx-auto col-md-6";
    className = isRetweet === true ? `${className} border rounded p-2` : className;

    let isDetailView = false;
    let path = window.location.pathname;
    let idRegex = /(?<tweetid>\d+)/;
    let match = path.match(idRegex);
    let tweetId = match ? match.groups.tweetid : -1;
    if (`${tweetId}` === `${tweet.id}`){
      isDetailView = true;
    }

    const handlePerformAction = (newActionTweetResponse, status) => {
      if (status === 200){
        setActionTweet(newActionTweetResponse);
      } else if (status === 201) {
        if (didRetweet){
          didRetweet(newActionTweetResponse);
        }
      }
    }

    const handleTweetDetailLink = (event) => {
      event.preventDefault();
      window.location.href=`/${tweet.id}`
    }

    return (
    <div className={className}>
      {isRetweet === true && <div className="mb-2"><span className="small text-muted">Retweet via: <AuthorNameDisplay author={retweeter} includeFullName={false} /></span></div>}
      <div className="d-flex">
        <div className="">
          <AuthorPicture author={tweet.author} />
        </div>
        <div className="col-11">
          <div>
            <AuthorNameDisplay author={tweet.author} includeFullName={true} />
            <p>{tweet.content}</p>
            <ParentTweet tweet={tweet} retweeter={tweet.author}/>
          </div>
          <div className="btn btn-group px-0">
            {(actionTweet && hideActions !== true) && <React.Fragment>
              <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action="Like" />
              <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action="Unlike" />
              <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action="Retweet" />
            </React.Fragment>}
            {isDetailView === false && <button className="btn btn-outline-primary btn-sm"onClick={handleTweetDetailLink}>View</button>}
          </div>
        </div>
      </div>
    </div>
    )
}
  
export function TweetsList(props){
  const username = props.username;
  const [tweetsInit, setTweetsInit] = useState([]);
  const [tweetsList, setTweetsList] = useState([]);
  const [tweetsDidGet, setTweetsDidGet] = useState(false);
  const [nextUrl, setNextUrl] = useState(null);

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
          setNextUrl(response.next);
          setTweetsInit(response.results);
          setTweetsDidGet(true);
        } else {
          alert("there was an error!");
        }
      }
  
      apiTweetList(username, handleTweetListLookup);
    }
  }
  useEffect(addNewTweets, [props.newTweets, tweetsInit, tweetsList]);
  useEffect(tweetsLookup, [tweetsDidGet, username]);

  const handleDidRetweet = (newTweet) => {
    const updatedTweetsInit = [...tweetsInit];
    updatedTweetsInit.unshift(newTweet);
    setTweetsInit(updatedTweetsInit);

    const updatedTweetsList = [...tweetsList];
    updatedTweetsList.unshift(newTweet);
    setTweetsList(updatedTweetsList);
  }

  const handleLoadNext = (event) => {
    event.preventDefault();
    if (nextUrl !== null){
      const handleLoadNextResponse = (response, status)=>{
        if (status === 200){
          const newTweets = [...tweetsList].concat(response.results)
          setNextUrl(response.next);
          setTweetsInit(newTweets);
          setTweetsList(newTweets);
        } else {
          alert("there was an error!");
        }
      }
      apiTweetList(props.username, handleLoadNextResponse, nextUrl)
    }
  }

  return (<React.Fragment>{
    tweetsList.map((item, index) => {
      return <Tweet tweet={item} key={`${index}-{item.id}`} didRetweet={handleDidRetweet} className="my-5 py-5 border bg-white text-dark"/>
    })}
    { nextUrl !== null && <button className='btn btn-outline-primary' onClick={handleLoadNext}>Load Next</button>}
    </React.Fragment>
  )
}

export function ActionBtn(props){
  // Vars
  const tweet = props.tweet;
  const action = props.action;
  const didPerformAction = props.didPerformAction;
  const likes = tweet.likes ? tweet.likes : 0;
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
    if ((status === 200 || status === 201) && didPerformAction){
      didPerformAction(response, status);
    }
  }

  const handleClick =(event) => {
    event.preventDefault();
    apiTweetAction(tweet.id, action, handleTweetActionEvent);
  }
  return (
    <button className={className} onClick={handleClick}>
      {buttonText}
    </button>
  );
}
