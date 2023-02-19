//search mountain peak by name
const mountSelect = document.querySelector("#mName");
const tempForm = document.querySelector("#temp");
const mountSubmit = document.querySelector(".mName-btn");
const list = document.querySelector(".output");

mountSubmit.addEventListener("click", () => {
  function getWeather() {
    const mValue = mountSelect.options[mountSelect.selectedIndex].value;
    const tForm = tempForm.options[tempForm.selectedIndex].value;

    fetch(`http://localhost:8000/results/?peak=${mValue}&temp=${tForm}`, {})
      .then((response) => response.json())
      //.then(response => console.log(response))
      .then((response) => forecastList(response))
      //.then(response => console.log(response))
      .catch((err) => errorResponse(err));
    //.catch(err => console.error(err));
  }
  getWeather();
});

function errorResponse(err) {
  //console.log(list);
  if (list.children.length > 0) {
    list.innerHTML = "";
  }

  const errorDiv = document.createElement("div");
  errorDiv.className = "errorMessage";
  const errorStatus = document.createElement("span");
  errorStatus.innerText = `${err.response.status} ${err.response.statusText}`;
  errorDiv.append(errorStatus);
  list.append(errorDiv);
  //console.log(error.response.status, error.response.statusText);
}

function forecastList(data) {
  if (list.firstChild) {
    list.innerHTML = "";
  }

  //console.log(data);

  //converts object to an array
  let reports = Object.entries(data);
  //console.log(reports);
  const entries = reports.values();
  const reportContainer = document.createElement("div");
  reportContainer.className = "repContainer";

  for (const entry of entries) {
    const reportList = document.createElement("div");
    const period = entry[0].toLowerCase();
    reportList.className = `report ${period}`;
    const reportHeader = document.createElement("h5");
    reportHeader.innerText = entry[0];
    reportList.append(reportHeader);
    const tempContainer = document.createElement("div");
    tempContainer.className = "tempContainer";
    reportList.append(tempContainer);
    const arrEntry = entry[1];
    //console.log(arrEntry);

    const forecastDetails = {
      //date: arrEntry.dayOfTheWeek,
      high: arrEntry.high,
      low: arrEntry.low,
      windChill: arrEntry.windChill,
      weatherConditions: arrEntry.weatherConditions,
      expectedRainfall: arrEntry.expectedRainfall,
      expectedSnowfall: arrEntry.expectedSnowfall,
      windConditions: arrEntry.windConditions,
      //weatherConditions: `${arrEntry.weatherConditions.charAt(0).toUpperCase() + arrEntry.weatherConditions.slice(1)}`,
    };

    //const weatherItems = forecastDetails;
    //console.log(forecastDetails);

    for (const [key, value] of Object.entries(forecastDetails)) {
      const wValueDiv = document.createElement("div");
      //const wValueSpan = document.createElement('span');
      wValueDiv.className = key;

      if (key == "high") {
        const wValueSpan = document.createElement("span");
        wValueSpan.innerHTML = `H ${value}<sup>\u00B0</sup>`;
        wValueDiv.append(wValueSpan);
        //console.log(key);
      } else if (key == "low") {
        const wValueSpan = document.createElement("span");
        wValueSpan.innerHTML = `L ${value}<sup>\u00B0</sup>`;
        wValueDiv.append(wValueSpan);
      } else if (key == "windChill") {
        const wValueSpan = document.createElement("span");
        wValueSpan.innerHTML = `Feels like ${value}<sup>\u00B0</sup>`;
        wValueDiv.append(wValueSpan);
      } else if (key == "expectedRainfall") {
        const wValueSpan = document.createElement("span");
        wValueSpan.innerText = `Rainfall ${value} mm`;
        wValueDiv.append(wValueSpan);
      } else if (key == "expectedSnowfall") {
        const wValueSpan = document.createElement("span");
        wValueSpan.innerText = `Snowfall ${value} cm`;
        wValueDiv.append(wValueSpan);
      } else if (key == "weatherConditions") {
        const weatherText = value
          .replace("shwrs", "showers")
          .replace("mod.", "moderate");
        wValueDiv.append(weatherCondition(weatherText));
        //console.log(weatherCondition(weatherText), wValueDiv.innerHTML);
      } else if (key == "windConditions") {
        const windConText = value;
        wValueDiv.append(windCondition(windConText));
      }

      reportList.append(wValueDiv);
    }

    //Move DIVs high and low to tempContainer DIV
    tempContainer.append(tempContainer.nextElementSibling);
    tempContainer.append(tempContainer.nextElementSibling);

    function weatherCondition(weatherText) {
      const timeOfDay = entry[0].toLowerCase();
      const weatherIcon = document.createElement("img");

      if (weatherText == "some clouds" || weatherText == "clear") {
        weatherIcon.src = `/img/${weatherText} ${timeOfDay}.svg`;
        weatherIcon.alt = `${weatherText} ${timeOfDay}`;
      } else {
        weatherIcon.src = `/img/${weatherText}.svg`;
        weatherIcon.alt = weatherText;
      }

      weatherIcon.className = "we-icon";
      //console.log(weatherIcon);
      return weatherIcon;
    }

    //reportList.append(weatherDiv);

    //Wind Condition arrow icon and direction
    function windCondition(windConText) {
      //const windCon = forecastDetails.windConditions;
      const windConSplit = windConText.split(/\s+/);
      //console.log(windConSplit);
      const windDiv = document.createElement("div");
      //windDiv.className = "windCon";

      for (const result of windConSplit) {
        const windSpan = document.createElement("span");
        windSpan.innerHTML = result;
        windDiv.append(windSpan);
      }

      const windArrow = document.createElement("img");
      windArrow.src = "/img/arrow-icon.svg";
      windArrow.className = "windDirect";

      const windDirection = windDiv.children[1];
      //console.log(windDirection);
      const speed = windDiv.children[0].innerText;
      const speedInMph = `${Math.floor(speed / 1.609)} mph`;
      windDiv.children[0].innerText = speedInMph;
      //console.log(speedInMph);
      arrowDirection(windDirection.innerText, speedInMph, windArrow);
      //console.log(windChild.innerText);

      function arrowDirection(windDirection, speedInMph, windArrow) {
        let fromDirection = "";
        let angle = 0;
        if (windDirection == "N") {
          angle = 180;
          fromDirection = "North";
        } else if (windDirection == "NNE") {
          angle = 202.5;
          fromDirection = "North-Northeast";
        } else if (windDirection == "NE") {
          angle = 225;
          fromDirection = "Northeast";
        } else if (windDirection == "ENE") {
          angle = 247.5;
          fromDirection = "East-Northeast";
        } else if (windDirection == "E") {
          angle = 270;
          fromDirection = "East";
        } else if (windDirection == "ESE") {
          angle = 292.5;
          fromDirection = "East-Southeast";
        } else if (windDirection == "SE") {
          angle = 315;
          fromDirection = "Southeast";
        } else if (windDirection == "SSE") {
          angle = 337.5;
          fromDirection = "South-Southeast";
        } else if (windDirection == "S") {
          angle = 0;
          fromDirection = "South";
        } else if (windDirection == "SSW") {
          angle = 22.5;
          fromDirection = "South-Southwest";
        } else if (windDirection == "SW") {
          angle = 45;
          fromDirection = "Southwest";
        } else if (windDirection == "WSW") {
          angle = 67.5;
          fromDirection = "West-Southwest";
        } else if (windDirection == "W") {
          angle = 90;
          fromDirection = "West";
        } else if (windDirection == "WNW") {
          angle = 112.5;
          fromDirection = "West-Northwest";
        } else if (windDirection == "NW") {
          angle = 135;
          fromDirection = "Northwest";
        } else if (windDirection == "NNW") {
          angle = 157.5;
          fromDirection = "North-Northwest";
        }

        windArrow.style = `transform-origin:50% 50%; transform: rotate(${angle}deg);`;
        windArrow.alt = `${speedInMph} from ${fromDirection}`;
      }

      windDiv.insertBefore(windArrow, windDirection);
      return windDiv;
    }

    reportContainer.append(reportList);
    list.append(reportContainer);

    //console.log(reportList);

    //console.log(entry[1]);
  }

  addDate();
  addPhoto();
}

function addPhoto(e) {
  const mName = mountSelect.options[mountSelect.selectedIndex].text;
  const mountDiv = document.querySelector(".output");
  const mountImg = document.createElement("img");
  mountImg.src = `/img/${mName}.jpg`;
  mountImg.className = "mountImg";
  mountDiv.prepend(mountImg);

  //Add credit link for Unsplash Photos
  const credit = document.createElement("div");
  credit.className = "credit";
  const location = document.createElement("div");
  location.className = "loc";
  const locSpan = document.createElement("span");
  const eleSpan = document.createElement("span");

  if (mName == "Snowdon") {
    credit.innerHTML = `Photo by <a href="https://unsplash.com/@lukas_blass?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Lukas Blaskevicius</a> on <a href="https://unsplash.com/photos/S8ckX180EIo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>`;
    locSpan.innerText = "Snowdon, Caernarfon, Wales";
    eleSpan.innerText = "Elevation: 1,085 m";
  } else if (mName == "Ben Nevis") {
    credit.innerHTML = `Photo by <a href="https://unsplash.com/@jack_skinner?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Jack Skinner</a> on <a href="https://unsplash.com/photos/sXU6nx9F3L4?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>`;
    locSpan.innerText = "Ben Nevis, Fort William, Scotland";
    eleSpan.innerText = "Elevation: 1,345 m";
  } else if (mName == "Scafell Pike") {
    credit.innerHTML = `Photo by <a href="https://unsplash.com/@benjaminsharpe?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Benjamin Sharpe</a> on <a href="https://unsplash.com/photos/UGENfvU870Q?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>`;
    locSpan.innerText = "Scafell Pike, Lake District, Cumbria, England";
    eleSpan.innerText = "Elevation: 978 m";
  } else if (mName == "The Storr") {
    credit.innerHTML = `Photo by <a href="https://unsplash.com/@kylepasalskyj?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Kyle Pasalskyj</a> on <a href="https://unsplash.com/photos/3nTPYQHDc5U?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>`;
    locSpan.innerText = "The Storr, Isle of Skye, Scotland";
    eleSpan.innerText = "Elevation: 719 m";
  } else if (mName == "Glyder Fawr") {
    credit.innerHTML = `Photo by <a href="https://unsplash.com/@v2osk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">v2osk</a> on <a href="https://unsplash.com/photos/3uQN4erCF5o?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText" target="_blank">Unsplash</a>`;
    locSpan.innerText = "Glyder Fawr, Caernarfon, Wales";
    eleSpan.innerText = "Elevation: 1,001 m";
  } else if (mName == "Helvellyn") {
    locSpan.innerText = "Helvellyn, Lake District, Cumbria, England";
    eleSpan.innerText = "Elevation: 950 m";
  }

  mountDiv.append(credit);
  location.append(locSpan, eleSpan);
  mountDiv.append(location);
}

//Add today's date to h2 header
function addDate() {
  const date = new Date();
  //console.log(date.toDateString());
  const rContainer = document.querySelector(".repContainer");
  const dateHeader = document.createElement("h3");
  dateHeader.innerText = date.toDateString();
  dateHeader.className = "date";
  rContainer.prepend(dateHeader);
}
