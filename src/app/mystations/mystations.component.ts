import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FrostService } from '../shared/services/frost.service';

@Component({
  templateUrl: 'mystations.component.html'
})
export class MyStationsComponent implements OnInit {
  stations: any[] = [];
  constructor(
    private frostService : FrostService,
    private route        : ActivatedRoute
  ) { }

  ngOnInit(){
    this.route.params.subscribe(params => {
       let userId = params['id'];
       // Los IDS son hashes CRC32 de los números
       // Hash creado con http://www.fileformat.info/tool/hash.htm
       // ID: 1 -> Tutuquén (Soler)
       if(userId=='83dcefb7'){
         this.stations = [
           {
             id_est: 291,
             nom_est: 'Tutuquén'
           }
         ]
       }
       // ID: 2 -> Linares
       if(userId=='1ad5be0d'){
         this.stations = [
           {
             id_est: 100,
             nom_est: 'Longaví Norte'
           },
           {
             id_est: 101,
             nom_est: 'Longaví Sur'
           }
         ]
       }
       // ID: 1 -> Tutuquén (Soler)
       if(userId=='6dd28e9b'){
         this.stations = [
           {
             id_est: 97,
             nom_est: 'Yerbas Buenas'
           }
         ]
       }
    });
  }

}
