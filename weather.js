//Gets the location of the user via their IP address, then automatically searches for the weather in their location
function getLocation() {
$.get("http://ipinfo.io", function(response) {
  var  city = response.city;
  var  country = response.country;
  var  ip = response.ip;
  var  location = response.loc.split(",");
  var  postal = response.postal;
  var link = "lat=" + roundNumber(location[0]) + "&lon=" + roundNumber(location[1]);
  getWeather(link);

}, "jsonp");
};
//JSONP request to get weather data
function getWeather(link){
  $.get("https://api.openweathermap.org/data/2.5/weather\?" + link + "&APPID=6c872f011601e23a892e15b2e285e699", function(data) {
    var  temperature = data.main.temp;
    var    windSpeed = data.wind.speed;
    var    windDeg = data.wind.deg;
    var    weatherMain = data.weather[0].main;
    var    weatherIcon = data.weather[0].icon;
    var    tempID = data.weather[0].id;
    var    city = data.name;
    var    country = data.sys.country
    console.log(city, country, tempID);
    $("#town").html("<h2> Weather for " + city + ", " + country + ".</h2>");
    if (country === "us"){
      $("#temperatureNumber").html("<h1 id='temperature'><img id='icon' src='http://openweathermap.org/img/w/" + weatherIcon + ".png'> " + kToF(temperature) + "<sup>&#176;c</sup></h1>");
    }else{
      $("#temperatureNumber").html("<h1 id='temperature'><img id='icon' src='http://openweathermap.org/img/w/" + weatherIcon + ".png'> " + kToC(temperature) + "<sup>&#176;c</sup></h1>");
    };
    $("#skyText").html("<h6 class='lowerText'>" + weatherMain + "</h6>");
    switch (true){
        case windDeg > 337:
        windDir = "N"
        break;
        case windDeg > 293:
        windDir = "NW"
        break;
        case windDeg > 248:
        windDir = "W"
        break;
        case windDeg > 203:
        windDir = "SW"
        break;
        case windDeg > 158:
        windDir = "S"
        break;
        case windDeg > 113:
        windDir = "SE"
        break;
        case windDeg > 68:
        windDir = "E"
        break;
        case windDeg > 23:
        windDir = "NE"
        break;
        case windDeg >= 0:
        windDir = "N"
        break;
      }
    $("#windText").html("<h6 class='lowerText'>" + windSpeed + " " + windDir + "</h6>");
    getBackground(temperature, tempID);

  }, "jsonp").fail(function() {
    alert('City Not Found.');
  });
};
//round a number
function roundNumber(number){
  return Math.floor(number)
};
//converting kelvin to celsius
function kToC(temperature){
  return roundNumber(temperature - 273.15)
};
//converting kelvin to fahrenheit
function kToF(temperature){
  return roundNumber(temperature * (9/5) - 459.67)
};
//getting the background image depending on the weather
function getBackground(temperature, id){
  switch (true){
    case id >= 600 && id <= 650:
      $("body").css("background-image", "url(https://s20.postimg.org/dx598nnsd/tree-branch-snow-cold-winter-flower-1394449-pxhere.com-min.jpg)");
      break;
    case id >= 300 && id <= 550:
      $("body").css("background-image", "url(https://s20.postimg.org/c5cadqwpp/raining-on-at-the-pier-min.jpg)");
      break;
    case id >= 200 && id <= 250:
      $("body").css("background-image", "url(https://s20.postimg.org/qwpwdz8p9/nature-sky-night-atmosphere-weather-storm-725473-pxhere.com-min.jpg)");
      break;
    case temperature >= 305:
      $("body").css("background-image", "url(https://s20.postimg.org/htil4mlml/beach-landscape-coast-nature-sand-sunlight-496230-pxhere.com-min.jpg)");
      break;
    case temperature <= 277:
      $("body").css("background-image", "url(https://s20.postimg.org/ms63j5x59/landscape-tree-nature-forest-branch-mountain-1164378-pxhere.com-.jpg)");
      break;
    case id >= 801 && id <= 850:
      $("body").css("background-image", "url(https://s20.postimg.org/pm98wljvx/nature-mountain-snow-cloud-mist-cloudy-1327773-pxhere.com-min.jpg)");
      break;
    default:
      $("body").css("background-image", "url(https://s20.postimg.org/64elgopj1/landscape-sea-coast-nature-grass-rock-112839-pxhere.com-min.jpg)");
  }
};
//for preparing a string to be turned into a link (lowercase and ecoding)
function prepareForLink(string){
  return encodeURIComponent(string.toLowerCase());
};
//Getting the weather via the search bar
$(document).on("click","#searchBtn",function searchQuery(){
  var inputLoc = $('#searchQuery').val();
  var link = "q=" + prepareForLink(inputLoc)
  getWeather(link);
  document.getElementById('searchQuery').value='';
});
//automatic running of the location and weather jsonp call
$(document).ready(function(){
  document.getElementById('searchQuery').value='';
  getLocation();
  document.getElementById("searchQuery").onkeydown = function(event) {
    if (event.keyCode == 13) {
      $("#searchBtn").click();
    }
  }
});
