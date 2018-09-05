import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MiniStationsService } from '../../shared/services/ministations.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { Map, latLng, tileLayer, marker, polygon, icon, geoJSON } from 'leaflet';
import * as L from 'leaflet';

import { MinistationModalComponent } from '../ministation-modal/ministation-modal.component';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ministations',
  templateUrl: './create.component.html'
})
export class CreateComponent implements OnInit {
  controllerNode : any = null;
  options : any = null;
  layers  : any[] = [];
  map     : Map = null;
  zoom    : number = null;

  stations : any[] = [];
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private miniStationsService  : MiniStationsService,
    private router               : Router,
    private zone                 : NgZone,
    private modalService         : NgbModal,
  ) {  }

  ngOnInit() {
    this.controllerNode = {
      name : '',
      location: {
        type: 'Point',
        coordinates: [-71.665928, -35.426550]
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
      center: latLng(-35.426550, -71.665928)
    };
    this.zoom = this.options.zoom;

    this.setMarker(this.options.center.lat, this.options.center.lng);
  }

  inputChange(){
    this.setMarker(
      this.controllerNode.location.coordinates[1],
      this.controllerNode.location.coordinates[0]
    )
  }

  onMapReady(map: Map) {
    this.map = map;
    this.map.on('click', (e) => this.onLeafletClick(e));
    this.map.on('zoomend', (e) => this.onZoomChange(e));
    L.control.scale().addTo(this.map);
  }

  onZoomChange($event){
    this.zone.run(() => {
      this.zoom = this.map.getZoom();
    })
  }

  onLeafletClick($event){
    this.map.setView($event.latlng, this.zoom, { animation: true })
    this.controllerNode.location.coordinates = [
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

  addStation(){
    this.zone.run(() => {
      let modalRef = this.modalService.open(MinistationModalComponent, {
        size     : 'lg',
        //backdrop : 'static'
      });
      modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
        if(result.station != null){
          this.stations.push(result.station);
        }
      }, (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      });
      modalRef.componentInstance.data = {
        controllerNode : this.controllerNode
      }
    })
  }

  editStation(station){
    this.zone.run(() => {
      let modalRef = this.modalService.open(MinistationModalComponent, {
        size     : 'lg',
        //backdrop : 'static'
      });
      modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
        if(result.station != null){
          let index = this.stations.indexOf(station);
          this.stations[index] = result.station;
        }
      }, (reason) => {
        console.log(`Dismissed ${this.getDismissReason(reason)}`);
      });
      modalRef.componentInstance.data = {
        controllerNode : this.controllerNode,
        station : station
      }
    })
  }

  deleteStation(station){
    let index = this.stations.indexOf(station);
    this.stations.splice(index, 1);
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  save(){
    if(this.controllerNode.name==''){
      this.notificationsService.error('Error', 'Se debe asignar un nombre al nodo controlador.');
      return;
    }

    // Subir controlador a la base de datos
    let controllerNode = {
      name : this.controllerNode.name,
      location : this.controllerNode.location,
      stations : this.stations
    }

    this.miniStationsService.createControllerNode(controllerNode)
    .subscribe(
      data => {
        this.notificationsService.success('Creación Exitosa', 'El nodo controlador fue creado exitosamente.');
      },
      error => {
        this.notificationsService.error('Error', 'Ocurrió un error al crear el nodo controlador.');
        console.log(error);
      }
    )
  }
}
