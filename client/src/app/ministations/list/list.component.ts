import { Component, OnInit, NgZone, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { MiniStationsService } from '../../shared/services/ministations.service';

@Component({
  templateUrl: 'list.component.html'
})
export class ListComponent implements OnInit {
  nodes: any = [];
  meta : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService : NotificationsService,
    private miniStationsService  : MiniStationsService,
    private zone: NgZone
  ) { }

  ngOnInit(){
    this.loadData();
  }

  loadData(){
    this.miniStationsService.getControllerNodes(this.page-1, this.pageSize)
    .subscribe(
      response => {
        this.nodes = response.data;
      },
      error => {
        this.notificationsService.error('Error', 'Ocurrió un error al consultar los nodos.');
        console.log(error);
      }
    )
  }

  edit(node){
    this.router.navigate(['../edit/'+node._id], {
      relativeTo: this.route
    });
  }

  openInMap(node){
    this.router.navigate(['../map/'], {
      relativeTo: this.route,
      queryParams : {
        lat : node.location.coordinates[1],
        lng : node.location.coordinates[0]
      }
    });
  }

  onPageChange(event: Event){
    this.loadData();
  }
}
