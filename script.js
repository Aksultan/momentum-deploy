// DOM Elements
const time = document.querySelector('.time'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  weatherIcon = document.querySelector('.weather-icon'),
  temperature = document.querySelector('.temperature'),
  weatherHumidity = document.querySelector('.weather-humidity'),
  weatherVelocity = document.querySelector('.weather-velocity'),
  city = document.querySelector('.city');


// Show Time
function showTime() {
  let options = { weekday: 'long', month: 'long', day: 'numeric' }, 
    today = new Date(),
    fullDate = today.toLocaleString('en', options)
    hour = today.getHours(),
    min = today.getMinutes(),
    sec = today.getSeconds();

  // Output Time
  time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}
    <br/><span class="full-date">${fullDate[0].toUpperCase()+fullDate.slice(1)}</span>`;

  setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}
let currentBack = 0
// Set Background and Greeting
function setBgGreet() {
  let today = new Date(),
    hour = today.getHours(),
    random = addZero((Math.floor(Math.random()*20)+1)%20+1),
    currentBack = random;

  if(hour >= 0 && hour < 6){  
    document.body.style.backgroundImage =
      `url(./assets/images/night/${random}.jpg)`;
    greeting.textContent = 'Good night, ';
    document.body.style.color = 'white';
    document.querySelector('.wrapper').style.background = 'rgba(0,0,0,.3)'
  } else if (hour >= 18) {
    document.body.style.backgroundImage =
    `url(./assets/images/evening/${random}.jpg)`;
    greeting.textContent = 'Good evening, ';
    document.body.style.color = 'white';
    document.querySelector('.wrapper').style.background = 'rgba(0,0,0,.3)'
  } else if (hour > 12) {
    document.body.style.backgroundImage =
    `url(./assets/images/day/${random}.jpg)`;
    greeting.textContent = 'Good afternoon, ';
    document.querySelector('.wrapper').style.background = 'rgba(255,255,255,.3)'
  } else if(hour < 12 && hour > 6){
    document.body.style.backgroundImage =
    `url(./assets/images/morning/${random}.jpg)`;
    greeting.textContent = 'Good morning, ';
    document.querySelector('.wrapper').style.background = 'rgba(255,255,255,.3)'
  }
}
let loadQuotes = async () => {
  let x = await fetch("https://type.fit/api/quotes")
  return await x.json()
}

function addQuote(){
  loadQuotes().then(data=>{
    let quote = Object.assign(data)[Math.floor(Math.random()*data.length)]
    document.querySelector('.quote-head').innerText = quote.text
    document.querySelector('.quote-footer').innerText = quote.author?quote.author:"Unknown"
  })
}


// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Введите имя]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress' || e.type === 'focusout') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13 || e.type === 'focusout') {
      if(name.textContent){
        localStorage.setItem('name', e.target.innerText);
      }
      name.blur()
      getName()
    }
  } else {
    // getName()
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Your focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}

// Set Focus
function setFocus(e) {
  if (e.type === 'keypress' || e.type === 'focusout') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13 || e.type === 'focusout') {
      if(focus.textContent){
        localStorage.setItem('focus', e.target.innerText);
      }
      focus.blur()
      getFocus()
    }
  }
}

function switchBack(){
  let back = document.body.style.backgroundImage,
  current = addZero((Number(back.match(/\d/g).join(''))+1)%20),
  img = document.createElement('img')
  current = current=="00"?"01":current
  img.src = back.substring(5,back.length-8)+current+'.jpg'  
  img.onload = () => document.body.style.backgroundImage = back.substring(0,back.length-8)+current+'.jpg")'
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=en&appid=yourIdHere&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.cod === "404") {
      weatherIcon.className = 'weather-icon owf owf-2x';
      city.textContent = 'Wrong City Name';
      temperature.textContent = '';
      weatherHumidity.textContent = '';
      weatherVelocity.textContent = '';
  }

  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp}°C`;
  weatherHumidity.textContent = `Humidity: ${data.main.humidity}%`;
  weatherVelocity.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)}km/h`;
}

function setCity(e) {
  if (e.type === 'keypress') {
      if (e.which == 13 || e.keyCode == 13) {
          if (e.target.innerText === '') {
              city.textContent = localStorage.getItem('prevText');
          }
          localStorage.setItem('city', e.target.innerText);
          getWeather();
          city.blur();
      }
  } else {
      if (e.target.innerText === '') {
          city.textContent = localStorage.getItem('prevText');
      }
      localStorage.setItem('city', e.target.innerText);
      getWeather();
  }
}

const clearText = (e) => {
  prevText = e.target.innerText;
  e.target.innerText = '';
  localStorage.setItem('prevText', prevText);
}


const getCity = () => {
  if (localStorage.getItem('city') === null) {
      city.textContent = 'Pavlodar';
  } else {
      city.textContent = localStorage.getItem('city');
  }
}


name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', ()=>name.textContent = '')
name.addEventListener('focusout', setName)
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', ()=>focus.textContent = '')
focus.addEventListener('focusout', setFocus)

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);
city.addEventListener('click', clearText)


// Run
showTime();
setBgGreet();
getName();
getFocus();
addQuote();
