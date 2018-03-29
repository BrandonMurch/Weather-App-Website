/*
@description - Get the weather of a location by IP addres or search
@input - Input location via search bar. Submit by clicking the button or pressing enter.
@author - Brandon - Brandon.Murch@protonmail.com
*/



                /*Gets the location of the user via their IP address,
                then automatically searches for the weather in their location*/
const getLocation = () => {
$.get("http://ipinfo.io", (response) => {
  let location = response.loc.split(",");
  getWeather("lat=" + roundNumber(location[0]) + "&lon=" + roundNumber(location[1]));

}, "jsonp");
};
                //JSONP request to get weather data
const getWeather = (link) => {
  $.get("https://api.openweathermap.org/data/2.5/weather\?" + link
    + "&APPID=6c872f011601e23a892e15b2e285e699", (data) => {
    let windDir;
    $(".weather__text--town").html("Weather for " + data.name + ", " + data.sys.country);
    if (data.sys.country === "us"){
      $(".weather__text--temperature")
      .html("<img class='weather__icon' src='http://openweathermap.org/img/w/"
      + data.weather[0].icon + ".png'> " + kToF(data.main.temp)
      + "<sup>&#176;c</sup>");
    }else{
      $(".weather__text--temperature")
      .html("<img class='weather__icon' src='http://openweathermap.org/img/w/"
      + data.weather[0].icon + ".png'> " + kToC(data.main.temp)
      + "<sup>&#176;c</sup>");
    };
    $(".weather__text--skyCover").html(data.weather[0].main);
    switch (true){
        case data.wind.deg > 337:
        windDir = "N"
        break;
        case data.wind.deg > 293:
        windDir = "NW"
        break;
        case data.wind.deg > 248:
        windDir = "W"
        break;
        case data.wind.deg > 203:
        windDir = "SW"
        break;
        case data.wind.deg > 158:
        windDir = "S"
        break;
        case data.wind.deg > 113:
        windDir = "SE"
        break;
        case data.wind.deg > 68:
        windDir = "E"
        break;
        case data.wind.deg > 23:
        windDir = "NE"
        break;
        case data.wind.deg >= 0:
        windDir = "N"
        break;
      }
    $(".weather__text--windSpeed").html(data.wind.speed + " " + windDir);
    getBackground(data.main.temp, data.weather[0].id);

  }, "jsonp").fail(() => {
    alert('City Not Found.');
  });
};
                //round a number
const roundNumber = (number) => {
  return Math.floor(number)
};
                //converting kelvin to celsius
const kToC = (temperature) => {
  return roundNumber(temperature - 273.15)
};
                //converting kelvin to fahrenheit
const kToF = (temperature) => {
  return roundNumber(temperature * (9/5) - 459.67)
};
                //getting the background image depending on the weather
const getBackground = (temperature, id) => {
  switch (true){
    case id >= 600 && id <= 650:
      $(".background").css("background-image", "url(https://s20.postimg.org/dx598nnsd/tree-branch-snow-cold-winter-flower-1394449-pxhere.com-min.jpg)");
      break;
    case id >= 300 && id <= 550:
      $(".background").css("background-image", "url(https://s20.postimg.org/c5cadqwpp/raining-on-at-the-pier-min.jpg)");
      break;
    case id >= 200 && id <= 250:
      $(".background").css("background-image", "url(https://s20.postimg.org/qwpwdz8p9/nature-sky-night-atmosphere-weather-storm-725473-pxhere.com-min.jpg)");
      break;
    case temperature >= 305:
      $(".background").css("background-image", "url(https://s20.postimg.org/htil4mlml/beach-landscape-coast-nature-sand-sunlight-496230-pxhere.com-min.jpg)");
      break;
    case temperature <= 277:
      $(".background").css("background-image", "url(https://s20.postimg.org/ms63j5x59/landscape-tree-nature-forest-branch-mountain-1164378-pxhere.com-.jpg)");
      break;
    case id >= 801 && id <= 850:
      $(".background").css("background-image", "url(https://s20.postimg.org/pm98wljvx/nature-mountain-snow-cloud-mist-cloudy-1327773-pxhere.com-min.jpg)");
      break;
    default:
      $(".background").css("background-image", "url(https://s20.postimg.org/64elgopj1/landscape-sea-coast-nature-grass-rock-112839-pxhere.com-min.jpg)");
  }
};
                //for preparing a string to be turned into a link (lowercase and ecoding)
const prepareForLink = (string) => {
  return encodeURIComponent(string.toLowerCase());
};
                //Getting the weather via the search bar
$(document).on("click",".weather__searchButton", () =>{
  var inputLoc = $('.weather__searchInput').val();
  var link = "q=" + prepareForLink(inputLoc)
  getWeather(link);
  document.getElementsByClassName('weather__searchInput')[0].value='';
});
                //automatic running of the location and weather jsonp call
$(document).ready(() => {
  document.getElementsByClassName('weather__searchInput')[0].value='';
  getLocation();
  document.getElementsByClassName("weather__searchInput")[0]
    .onkeydown = function(event) {
    if (event.keyCode == 13) {
      $(".weather__searchButton").click();
    }
  }
});
