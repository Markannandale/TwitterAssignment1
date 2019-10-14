const AVATAR_URL = 'https://avatars2.githubusercontent.com/u/2952019?v=4';
const main = document.querySelector('main');
const tweetBtn = document.querySelector('form');
const my_avatar = document.querySelectorAll('.my_avatar');
my_avatar.forEach(img => img.src = AVATAR_URL);
const imgGifPoll = document.querySelector('#imgGifPoll');
const searchGifBtn = document.querySelector('#searchGifBtn');
const searchGif = document.querySelector('#searchGif');
const browseGifs = document.querySelector('#browsegifs');
const emojibtn = document.querySelector('#emojibtn');
const emojimodalbody = document.querySelector('#emojimodalbody');
const textarea = document.querySelector('#textarea');
const searchEmoji = document.querySelector('#searchEmoji');
const emojiCategories = document.querySelector('#emojiCategories');
const pollBtn = document.querySelector('#pollbtn');

const tweets = JSON.parse(localStorage.getItem('twitter')) || [];
// const tweets = [];
let gifs = [];
let emojis = [];

function render() {
    remember();

    main.innerHTML = tweets.map((tweet, idx) => `
        <aside>
        <div>
            <img class="avatar" src="${tweet.avatar}">
        </div>
        <div class="formatted-tweet">
            <h6><a href="https://twitter.com/${tweet.username}">${tweet.name}</a> <span class="username">@${tweet.username}</span></h6>
            <p>${tweet.tweet}</p>
            <div class="imgGifPoll">
                <img src="${tweet.image}">
                ${tweet.isPollCreated ? displayVotes(tweet, idx) : ''}
            </div>
            <div>
                <section>
                    <div id="reactions" class="btn-group mr-2">
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-message-outline"
                            aria-label="reply"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-twitter-retweet"
                            aria-label="retweet"
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-heart-outline"
                            aria-label="like"
                            style=""
                        ></button>
                        <button
                            type="button"
                            class="btn btn-secondary mdi mdi-upload"
                            aria-label="share"
                        ></button>
                    </div>
                </section>
            </div>
        </div>
        </aside>
        `).join('');
}

function handleFileSelect(e) {
    const reader = new FileReader();

    reader.addEventListener('load', (e) => {
        console.log(e.target.result);
        imgGifPoll.innerHTML = `<img class="thumb" src="${e.target.result}" style="width: 100%"/>`;
    });

    reader.readAsDataURL(e.target.files[0]);
}

function fetchGifs() {
    const API_KEY = 'vBKW9GpJ37hqzRMMEH1j7cycGowlf2Q3';
    fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchGif.value}`)
      .then(res => res.json())
      .then(data => {
        gifs = data.data;
        const newHTML = gifs.map((gif,idx) => `<img src="${gif.images.fixed_height_small.url}" data-index="${idx}">`).join('');
        browseGifs.innerHTML = newHTML;
        // unhide switch to toggle gif animations
        imgGifPoll.classList.remove('hide');
    });
}
  
function chooseGif(e) {
    if (!e.target.matches('img')){
      return
    }
    const index = e.target.dataset.index;
    imgGifPoll.innerHTML = `<img src="${gifs[index].images.original.url}">`;
}

async function browseEmojis() {
    const response = await fetch('https://unpkg.com/emoji.json@12.1.0/emoji.json');
    const data = await response.json();
    emojis = data;
    emojimodalbody.innerHTML = emojis.map((emoji, idx) => `<div class="emoji" data-index="${idx}">${emoji.char}</div>`).join('');
}

function insertEmojis(e) {
    console.log('in')
    if (!e.target.matches(".emoji")){
        return
    }
    const index = e.target.dataset.index;
    console.log(index, emojis[index].char)
    textarea.value += `${emojis[index].char}`;
}

function searchEmojis () {
    const result = emojis.filter(emoji => emoji.name.includes(searchEmoji.value));
    emojimodalbody.innerHTML = result.map((emoji, idx) => `<div class="emoji" data-index="${idx}">${emoji.char}</div>`).join('');
}

function remember() {
    // store our current tweets array in localstorage
    // but remove last memory of it first
    localStorage.removeItem('twitter');
  
    // remember tweets array
    localStorage.setItem('twitter', JSON.stringify(tweets))
}
  
function votesToPercentages(votes) {
    const total = votes.a + votes.b + votes.c + votes.d;
  
    return {
      a: Math.floor((votes.a / total) * 100),
      b: Math.floor((votes.b / total) * 100),
      c: Math.floor((votes.c / total) * 100),
      d: Math.floor((votes.d / total) * 100),
      total
    }
  
}
  
function displayVotes(tweet, idx) {
    const percents = votesToPercentages(tweets[idx].pollResults)  // {a: 33, b: 20, ,,,, total: 133}
    const letterChosen = tweets[idx].pollResults.youChose; // a b c d 
  
    if (tweet.isPollDone) {
      return `
      <div class="bargraph">
      <div id="bar1" class="bar" style="flex-basis: ${
        percents.a
      }%" data-vote="a">${tweets[idx].voteOptions.a} ${
      letterChosen == "a" ? "&check;" : ""
    }</div>
      <div id="percentage1">${percents.a}%</div>
    </div>
    <div class="bargraph">
      <div id="bar2" class="bar" style="flex-basis: ${
        percents.b
      }%" data-vote="b">${tweets[idx].voteOptions.b} ${
      letterChosen == "b" ? "&check;" : ""
    }</div>
      <div id="percentage2">${percents.b}%</div>
    </div>
    <div class="bargraph">
      <div id="bar3" class="bar" style="flex-basis: ${
        percents.c
      }%" data-vote="c">${tweets[idx].voteOptions.c} ${
      letterChosen == "c" ? "&check;" : ""
    }</div>
    <div id="percentage3">${percents.c}%</div>
    </div>
    <div class="bargraph">
      <div id="bar4" class="bar" style="flex-basis: ${
        percents.d
      }%" data-vote="d">${tweets[idx].voteOptions.d} ${
      letterChosen == "d" ? "&check;" : ""
    }</div>
    <div id="percentage4">${percents.d}%</div>
    </div>
    <div id="totalVotes">${percents.total} votes</div>    
      `
    }
    return `
    <div class="poll flex-col" data-idx="${idx}">
       <button class="vote" value="a">${tweet.voteOptions.a}</button>
       <button class="vote" value="b">${tweet.voteOptions.b}</button>
       <button class="vote" value="c">${tweet.voteOptions.c}</button>
       <button class="vote" value="d">${tweet.voteOptions.d}</button>
    </div>
    `
}

function tweeting(e) {
    e.preventDefault();
    const p = document.querySelector('textarea');
    const image = imgGifPoll.querySelector("img");
    const voteOptions = {
        a: imgGifPoll.querySelector('#pollchoice1') ? imgGifPoll.querySelector('#pollchoice1').value : '',
        b: imgGifPoll.querySelector('#pollchoice2') ? imgGifPoll.querySelector('#pollchoice2').value : '',
        c: imgGifPoll.querySelector('#pollchoice3') ? imgGifPoll.querySelector('#pollchoice3').value : '',
        d: imgGifPoll.querySelector('#pollchoice4') ? imgGifPoll.querySelector('#pollchoice4').value : '',
    }
  
    tweets.unshift({
      avatar: AVATAR_URL,
      name: 'Mark A.',
      username: 'markannandale',
      tweet: p.value,
      image: image ? image.src : '',
      isPollCreated: !!(voteOptions.a && voteOptions.b && voteOptions.c && voteOptions.d),
      voteOptions,
      pollResults: {},
      isPollDone: false
    });
  
    p.value = '';
    imgGifPoll.innerHTML = '';
  
    render();
}

function insertPoll() {
    // todo: disable the tweet button until all fields plus a question is inserted
    textarea.placeholder = 'Ask a question...';
  
    imgGifPoll.innerHTML = `
                  <form>
                    <div class="form-group">
                      <input type="text" class="form-control" id="pollchoice1" aria-describedby="" maxlength="25" placeholder="Choice 1">
                      <br>
                      <input type="text" class="form-control" id="pollchoice2" aria-describedby="" maxlength="25" placeholder="Choice 2">
                      <br>
                      <input type="text" class="form-control" id="pollchoice3" aria-describedby="" maxlength="25" placeholder="Choice 3">
                      <br>
                      <input type="text" class="form-control" id="pollchoice4" aria-describedby="" maxlength="25" placeholder="Choice 4">
                      <br><br>
                      <h6>Poll length</h6>
                      <hr style="margin:0">
                      <div class="row">
                        <div class="col">
                          <label for="polldays">Days</label>
                          <select class="form-control" id="polldays">
                            <option>0</option>
                            <option selected>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                        <div class="col">
                          <label for="pollhours">Hours</label>
                          <select class="form-control" id="pollhours">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>
                        <div class="col">
                          <label for="pollminutes">Minutes</label>
                          <select class="form-control" id="pollminutes">
                            <option>0</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                          </select>
                        </div>                        
                      </div>
                    </div>
                  </form>
  
    `;
}
  
async function vote(e) {
    if (!e.target.matches('.vote')) {
      return;
    }
  
    // find data-idx's value so we know which element in tweets array to change
    const index = e.target.closest('.poll').dataset.idx;
  
    const res = await fetch('https://my.api.mockaroo.com/votes.json?key=2d95a440')
    const data = await res.json(); // {"a":"05-658-6533","b":"60-026-8075","c":"89-841-5434","d":"65-564-0648"}
    const keyValues = Object.entries(data); // [["a","05-658-6533"], ...]
    const newKeyValues = keyValues.map(keyValArr => [keyValArr[0], parseInt(keyValArr[1].slice(-2), 10)]) // [["a",33], ...]
  
    // push JSON results into our tweets array
    tweets[index].pollResults = Object.fromEntries(newKeyValues) // {"a":33], ...}
    tweets[index].pollResults.youChose = e.target.value // a b c d
    tweets[index].isPollDone = true;
  
    render();
}

document.querySelector('#uploadPic').addEventListener('change', handleFileSelect, false);
tweetBtn.addEventListener('submit', tweeting);
searchGifBtn.addEventListener('click', fetchGifs);
browseGifs.addEventListener('click', chooseGif);
emojimodalbody.addEventListener('click', insertEmojis);
emojibtn.addEventListener('click', browseEmojis);
searchEmoji.addEventListener('keyup', searchEmojis);
pollBtn.addEventListener('click', insertPoll);
main.addEventListener('click', vote)

render();