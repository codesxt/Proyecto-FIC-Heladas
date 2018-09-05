import { Component, EventEmitter, OnInit, Output, Input, NgZone } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AgrometService } from '../../shared/services/agromet.service';
import { Map, latLng, tileLayer, marker, polygon, icon, geoJSON } from 'leaflet';
import * as L from 'leaflet';
import { NotificationsService } from 'angular2-notifications';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ministation-modal',
  templateUrl: './ministation-modal.component.html'
})
export class MinistationModalComponent implements OnInit {
  @Input() data : any = null;

  station : any = null;

  options : any = null;
  layers  : any[] = [];
  map     : Map = null;
  zoom    : number = null;
  constructor(
    public activeModal : NgbActiveModal,
    private zone       : NgZone,
    private notificationsService : NotificationsService,
  ) { }

  ngOnInit(){
    if(this.data && this.data.station){
      this.station = this.data.station;
    }else{
      this.station = {
        name : '',
        location: {
          type        : 'Point',
          coordinates : [
            this.data.controllerNode.location.coordinates[0],
            this.data.controllerNode.location.coordinates[1]
          ]
        }
      }
    }

    this.options = {
      layers: [
        tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 16,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoiY29kZXN4dCIsImEiOiJjamxvNmRia2kwM3pwM3BxanYwa3Fha21iIn0.Rva9tK3ZY_XobZhaoyWIJg'
        })
      ],
      zoom: 11,
      center: latLng(this.station.location.coordinates[1], this.station.location.coordinates[0])
    };
    this.zoom = this.options.zoom;

    this.setMarker(this.options.center.lat, this.options.center.lng);
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e) => this.onLeafletClick(e));
    this.map.on('zoomend', (e) => this.onZoomChange(e));
    L.control.scale().addTo(this.map);
    this.map.invalidateSize();
    setTimeout(() => { // Little hack to center the map inside of the modal
      this.map.setView(this.options.center, this.zoom, { animation: true });
      this.map.invalidateSize();
    }, 100)
    this.zone.run(() => { })
  }

  onZoomChange($event){
    this.zone.run(() => {
      this.zoom = this.map.getZoom();
    })
  }

  onLeafletClick($event){
    this.map.invalidateSize();
    this.map.setView($event.latlng, this.zoom, { animation: true })
    this.station.location.coordinates = [
      $event.latlng.lng,
      $event.latlng.lat
    ]
    this.zone.run(() => {
      this.setMarker($event.latlng.lat, $event.latlng.lng);
    })
  }

  setMarker(lat, lng){
    this.layers = [];
    let mkr = marker([ lat, lng ], {
       icon: icon({
          iconSize: [ 25, 41 ],
          iconAnchor: [ 13, 41 ],
          iconUrl: 'assets/img/marker-icon.png',
          shadowUrl: 'assets/img/marker-shadow.png'
       })
    });
    this.layers.push(mkr);
  }

  addMiniStation(){
    if(this.station.name==''){
      this.notificationsService.error('Error', 'Se debe asignar un nombre a la Mini Estación.');
      return;
    }
    this.activeModal.close({
      station   : this.station
    })
  }
}
