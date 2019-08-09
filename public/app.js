"use strict";

// Add event listeners to subreddit buttons
let subreddits = document.querySelectorAll(".subreddit");
subreddits.forEach(e => {
  e.addEventListener("click", function() {
    if (this.innerHTML === "Random") {
      let randomArray = [
        "/r/nba",
        "/r/mma",
        "/r/userexperience",
        "/r/ui_design",
        "/r/webdev",
        "/r/football",
        "/r/personalfinance"
      ];

      let randomThread = Math.floor(Math.random() * randomArray.length);

      getSubreddits(randomArray[randomThread]);
    } else {
      getSubreddits(this.innerHTML);
    }
  });
});

let searchButton = document.getElementById("searchBtn");
searchButton.addEventListener("click", function(e) {
  let searchVal = document.getElementById("text");
  getSubreddits(searchVal.value);
  e.preventDefault();
});

// load subreddits
function getSubreddits(thread) {
  // XHR
  const redditXHR = new XMLHttpRequest();
  redditXHR.open("GET", `http://www.reddit.com${thread}.json`, true);
  redditXHR.addEventListener("load", loadSubreddits);
  redditXHR.send();

  // Reddit XHR
  let contentContainer = document.getElementById("contentContainer");

  function loadSubreddits() {
    contentContainer.innerHTML = "";
    let response = JSON.parse(this.responseText);
    let posts = response.data.children;
    posts.forEach(e => {
      // define UI variables
      let author = e.data.author;
      let title = e.data.title;
      let votes = e.data.ups.toString();
      let message = e.data.selftext;
      let postImage = e.data.url;
      let created = moment(e.data.created * 1000).fromNow();
      let url = e.data.permalink;

      // 1. Create box/card and append to content container
      let box = document.createElement("div");
      box.className = "box";
      contentContainer.appendChild(box);

      // 2. Append reddit image to box
      let image = document.createElement("img");
      image.className = "redditPics";
      image.src = postImage;
      box.appendChild(image);
      image.addEventListener("error", function() {
        this.src = "/assets/stockphoto.jpeg";
      });

      // 3. Append title to box.
      let topic = document.createElement("h3");
      topic.className = "topic";
      topic.innerHTML = title;
      box.appendChild(topic);

      // 4. Create container for post details and append to box
      let postContainer = document.createElement("div");
      postContainer.className = "postContainer";
      box.appendChild(postContainer);

      //5. Append details to post container
      let user = document.createElement("div");
      user.innerHTML = `by ${author}`;
      postContainer.appendChild(user);

      let dot = document.createElement("span");
      dot.className = "dot";
      postContainer.appendChild(dot);

      let whenPosted = document.createElement("div");
      whenPosted.innerHTML = created;
      postContainer.appendChild(whenPosted);

      let dot2 = document.createElement("span");
      dot2.className = "dot";
      postContainer.appendChild(dot2);

      let upvotes = document.createElement("div");
      upvotes.className = "upvotes";
      upvotes.innerHTML = `${votes} upvotes`;
      postContainer.appendChild(upvotes);

      let messageBody = document.createElement("p");
      messageBody.className = "message";
      messageBody.innerHTML = message;
      box.appendChild(messageBody);
    });
  }
}

let plus = document.getElementById("plus");
plus.addEventListener("click", function() {
  window.location.reload();
});
