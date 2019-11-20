import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxDraw from 'mapbox-gl-draw'
import ReactDOM from 'react-dom'
import * as turf from '@turf/turf'
import Tooltip from './tooltip'
import MapboxGeocoder from 'mapbox-gl-geocoder'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

class Basic extends React.Component {

  tooltipContainer;

  setTooltip(features) {
    if (features.length) {
      ReactDOM.render(
        React.createElement(
          Tooltip, {
            features
          }
        ),
        this.tooltipContainer
      );
    } else {
      this.tooltipContainer.innerHTML = '';
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      lng: 77.6766,
      lat: 12.9270
    };
  }

  componentDidMount() {

    this.tooltipContainer = document.createElement('div');

    const { lng, lat } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom: 16,
      pitch: 60
    });

    var draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      }
    });

    map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });


    map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl
    }));

    map.addControl(draw);
    
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);
    
    function updateArea(e) {
      var data = draw.getAll();
      var answer = document.getElementById('calculated-area');
      if (data.features.length > 0) {
        var area = turf.area(data);
        var rounded_area = Math.round(area*100)/100;
        answer.innerHTML = '<p><strong>' + rounded_area + '</strong> square meters</p>';
      } else {
        answer.innerHTML = '';
        if (e.type !== 'draw.delete') alert("Use the draw tools to draw a polygon!");
      }
    }

    const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
      offset: [0, 0]
    }).setLngLat([0,0]).addTo(map);
    
    map.on('mousemove', (e) => {

      document.getElementById('info').innerHTML = JSON.stringify(e.point) + '----' ;
      const features = map.queryRenderedFeatures(e.point);
      tooltip.setLngLat(e.lngLat);
      map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      this.setTooltip(features);
    });

    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));


    map.on('load', function() {
        // Insert the layer beneath any symbol layer.
        var layers = map.getStyle().layers;

        var labelLayerId;
        for (var i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
          }
        }
         
        map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
              'fill-extrusion-color': '#bfe6eb',
              'fill-extrusion-height': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "height"]
              ],
              'fill-extrusion-opacity': .6
            }
        }, labelLayerId);
    });
  }

  render() {
    const { lng, lat } = this.state;

    return (
      <div>
        <style>
          {"\
            .mapboxgl-ctrl-geocoder {\
              position:relative !important;\
              height: 30px !important;\
              min-width:170px !important;\
              width: auto !important; \
            }\
          /"}
        </style>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div style={{display:'inline-block'}} id='info'>{`Longitude: ${lng} Latitude: ${lat}`}</div>
          <div style={{display:'inline-block'}}>{`Longitude: ${lng} Latitude: ${lat}`}</div>
        </div>
        
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
        
        <div style={{ height: 'auto', width: '250px', backgroundColor: 'rgba(255, 255, 255, .9)', position: 'fixed', bottom: '40px', left: '10px', padding: '15px' }}>
          <p>Draw a polygon using the draw tools.</p>
          <div id='calculated-area'></div>
        </div>
        
      </div>
    );
  }
}

export default Basic;