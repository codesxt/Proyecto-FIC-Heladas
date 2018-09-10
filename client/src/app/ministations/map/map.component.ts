import { Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MiniStationsService } from '../../shared/services/ministations.service';
import { NotificationsService } from 'angular2-notifications';
import { Map, latLng, tileLayer, marker, polygon, icon, geoJSON } from 'leaflet';
import * as L from 'leaflet';

@Component({
  templateUrl: 'map.component.html'
})
export class MapComponent implements OnInit {
  options : any = null;
  layersControl : any = null;
  layers  : any[] = [];
  map: Map = null;
  zoom : number = null;


  constructor(
    private router               : Router,
    private route                : ActivatedRoute,
    private notificationsService : NotificationsService,
    private miniStationsService  : MiniStationsService,
    private zone                 : NgZone
  ) { }

  ngOnInit(){
    this.options = {
      layers: [
        tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoiY29kZXN4dCIsImEiOiJjamlrcHo2d3EyNmdhM3BvY3R1azJteG5kIn0.i8ptPl7Jl1I06oDoPgeZYA'
        })
      ],
      zoom: 11,
      center: latLng(-35.426550, -71.665928)
    };
    this.layersControl = {
    	baseLayers: {
    		'Calles': tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoiY29kZXN4dCIsImEiOiJjamlrcHo2d3EyNmdhM3BvY3R1azJteG5kIn0.i8ptPl7Jl1I06oDoPgeZYA'
        }),
        'Satelital': tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.satellite',
          accessToken: 'pk.eyJ1IjoiY29kZXN4dCIsImEiOiJjamlrcHo2d3EyNmdhM3BvY3R1azJteG5kIn0.i8ptPl7Jl1I06oDoPgeZYA'
        })
    	}
    }
    this.zoom = this.options.zoom;
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e) => this.onLeafletClick(e));
    this.map.on('zoomend', (e) => this.onZoomChange(e));

    this.loadData();
    L.control.scale().addTo(this.map);

    this.route.queryParams.subscribe(
      params => {
        console.log(params)
        this.map.setView({lat: params.lat, lng: params.lng}, this.zoom, { animation: true })
      }
    )
  }

  loadData(){
    this.miniStationsService.getControllerNodes(0, 0)
    .subscribe(
      response => {
        this.layers = [];
        response.data.forEach((item) => {
          let mkr = marker([ item.location.coordinates[1], item.location.coordinates[0] ], {
             icon: icon({
                iconSize: [ 25, 41 ],
                iconAnchor: [ 13, 41 ],
                iconUrl: 'assets/img/marker-icon.png',
                shadowUrl: 'assets/img/marker-shadow.png'
             })
          });
          mkr.bindPopup('<b>Coordinador: '+item.name+'</b>').openPopup();
          this.layers.push(mkr);
          item.stations.forEach(station => {
            let mkr = marker([ station.location.coordinates[1], station.location.coordinates[0] ], {
               icon: icon({
                  iconSize: [ 25, 41 ],
                  iconAnchor: [ 13, 41 ],
                  iconUrl: 'assets/img/map-warning.png',
                  shadowUrl: 'assets/img/marker-shadow.png'
               })
            });
            mkr.bindPopup('<b>Estación: '+station.name+'</b><br/><b>Coordinador: ' +item.name+ '</b>').openPopup();
            this.layers.push(mkr);
          })
          this.zone.run(() => {

          })
        })
      },
      error => {

      }
    )
  }

  onZoomChange($event){
    this.zone.run(() => {
      this.zoom = this.map.getZoom();
    })
  }

  onLeafletClick($event){
    this.map.setView($event.latlng, this.zoom, { animation: true })
  }

  onBoundsChange($event){

  }
}
