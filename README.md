# MAP BOX SAMPLE PROJECT

Mapbox GL JS is a JavaScript library that uses Mapbox GL to render interactive maps. It’s an open source library that’s free to use. You can add a Mapbox style or a custom style created with Mapbox Studio to your Mapbox GL JS application.

Mapbox GL JS is a client-side renderer. It uses JavaScript and WebGL to dynamically draw data with the speed and smoothness of a video game. Instead of fixing styles and zoom levels at the server level, Mapbox GL puts power in JavaScript, allowing for dynamic styling and freeform interactivity. Vector maps are the next evolution, and we're excited to see what developers build with this framework.

Mapbox styles  
- satellite-v9 : Gives satellite image of the particular latitude and longitude 
- streets-v9 : Gives a map image with streets and roads  of the particular latitude and longitude.
- dark-v10 : Gives a night vision image  of the particular latitude and longitude.

Access tokens are keys that allow you to access Mapbox APIs. Mapbox uses access tokens to associate API requests with your account. 

GeoLocateControl control provides a button that uses the browser's geolocation API to locate the user on the map. 
The GeolocateControl has two modes. 
- If trackUserLocation is false (default) the control acts as a button, which when pressed will set the map's camera to target the user location. If the user moves, the map won't update.  
- If trackUserLocation is true the control acts as a toggle button that when active the user's location is actively monitored for changes. In this mode the GeolocateControl has three states

showUserLocation {Boolean} - default: true - By default a dot will be shown on the map at the user's location. Set to false to disable.

style {Object} - default: {} - A react style object applied to Geolocate control button.

Properties for map : Zoom, Pitch, lat and long

GeoCoder - Mapbox gl geocoder control is used to search for places using Mapbox Geocoding API.