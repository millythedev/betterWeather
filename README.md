# Better Weather

my better weather web app. search any city (or use your location) and it shows the current weather, the next 24 hours and a 7 day forecast. the background changes with the weather and if its day or night.

## Live Site

[Better Weather](https://millythedev.github.io/betterWeather/)

## Features

- city search with suggestions as you type
- use my location button
- current temp, feels like, humidity, wind, rain chance, sunrise and sunset
- hourly forecast for the next 24 hours
- 7 day forecast with high/low range bars
- switch between °F and °C
- remembers your last city and units

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- [Open-Meteo](https://open-meteo.com/) for the weather and city search (free, no api key needed)

## Running Locally

```bash
git clone https://github.com/millythedev/betterWeather.git
cd betterWeather
npm install
npm run dev
```

## Deployment

pushing to main runs the GitHub Actions workflow which builds the site and pushes it to the gh-pages branch
