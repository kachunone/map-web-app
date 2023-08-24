# Location Tracking Web Page

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)

## Introduction

This web page allows users to acquire their current location using their browser's geolocation API. It also provides a search module for users to input the name of a location. The page displays the location on a map and adds a marker for each searched location. Additionally, it includes a table with pagination to show all searched places, allowing users to select and delete multiple records. The page also displays the time zone and local time of the latest searched location.

## Features

- Acquire current location using the browser's geolocation API.
- Search for locations by name with support for button clicks and keyboard enter key.
- Display locations on a map with markers.
- Pagination for the list of searched places (10 records per page).
- Checkbox for selecting multiple records for deletion.
- Delete selected records along with their markers.
- Display time zone and local time of the latest searched location.

## Technologies Used

- Vue.js 3
- Vuestic UI (for UI components)
- Tailwind CSS (for styling)
- Google Geocoding API (for location data)
- Google Maps JavaScript API (for displaying maps)
- Timezone API (for time zone information)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine
- Google Maps API keys

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/location-tracking-webpage.git

2. Change to the project directory:

   ```bash
   cd map-web-app

3. Install the project dependencies:

   ```bash
   npm install

## Configuration

1. Create a .env file in the project root directory.

2. Add your Google Maps API keys to the created .env following format from .env.example file

3. Start the development server:
   
   ```bash
   npm run dev
   
   
