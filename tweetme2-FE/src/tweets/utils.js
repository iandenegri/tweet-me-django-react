// Django provided func
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

function lookup(method, endpoint, callback, data){
  let json_data;
  if (data){
    json_data = JSON.stringify(data);
  }

  const csrftoken = getCookie('csrftoken');
  const xhr = new XMLHttpRequest();
  const url = `http://localhost:8000/api${endpoint}`;
  const responseType = 'json';

  xhr.responseType = responseType;
  xhr.open(method, url);
  if (csrftoken){
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("HTTP-X-REQUESTED-WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }
  xhr.onload = function() {
    callback(xhr.response, xhr.status);
  }
  xhr.onerror = function(e){
    console.log(e);
    callback({"message": "Error occurred when fetching tweets."});
  }
  xhr.send(json_data);

}

export function apiTweetCreate(newTweetData, callback){
  let data = {content: newTweetData};
  lookup("POST", "/tweets/create/", callback, data);
}

export function apiTweetList(username, callback){
  let endpoint = "/tweets/" 
  if (username){
    endpoint = `/tweets/?username=${username}`
  }
  lookup("GET", endpoint, callback);
}

export function apiTweetDetail(tweetId, callback){
  let endpoint = `/tweets/${tweetId}`;
  lookup("GET", endpoint, callback);
}

export function apiTweetAction(tweetID, action, callback){
  let data = {id: tweetID, action: action}
  lookup("POST", "/tweets/action/", callback, data);
}