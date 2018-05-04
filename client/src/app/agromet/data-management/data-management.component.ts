import { Component, OnInit, ViewChild, TemplateRef, Inject } from '@angular/core';
import { AgrometService } from '../../shared/services/agromet.service';
import { NotificationsService } from 'angular2-notifications';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as zpad from 'zpad';
import * as moment from 'moment';

import {
  CalendarEvent,
  CalendarEventAction
} from 'angular-calendar';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';

function getDaysInMonth(month, year) {
  return new Date(year, month+1, 0).getDate();
}

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  green: {
    primary: '#107823',
    secondary: '#457741'
  }
};

@Component({
  selector: 'app-admin-agromet-data-management',
  templateUrl: './data-management.component.html'
})
export class AgrometDataManagementComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  locale          : string = 'es-cl';
  activeDayIsOpen : boolean = true;
  viewDate        : Date = new Date();
  events          : CalendarEvent[]  = [];
  actions         = {
    backupData : {
      label: '<i class="fa fa-fw fa-upload"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Upload', event);
      }
    },
    removeData : {
      label: '<i class="fa fa-fw fa-trash"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Remove', event);
      }
    }
  }
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  station : any = null;
  constructor(
    private agrometService       : AgrometService,
    private notificationsService : NotificationsService,
    private route                : ActivatedRoute,
    private router               : Router,
    private formBuilder          : FormBuilder,
    private modal                : NgbModal,
    @Inject('moment') private moment
  ) { }

  ngOnInit() {
    this.viewDate = new Date();
    this.generatePlaceholderEvents();
    this.route.params.subscribe(params => {
       let stationId = params['id'];
       this.agrometService.getAgrometStation(stationId)
       .subscribe(
         data => {
           this.station = {
             _id     : data.id,
             name    : data.attributes.name,
             station : data.attributes.station,
             region  : data.attributes.region,
             city    : data.attributes.city
           };
           this.loadData();
         },
         error => {
           this.notificationsService.error('Error', 'Ocurrió un error al cargar la estación. Detalles: ' + error.json().message);
           this.router.navigate(['/agromet/list']);
         }
       )
    });
  }

  loadData(){
    let thisDate = this.viewDate.getDate();
    let daysInMonth = getDaysInMonth(this.viewDate.getMonth(), this.viewDate.getFullYear());
    let limit = null;
    let now = new Date();
    if(now.getMonth() == this.viewDate.getMonth() && now.getFullYear() == this.viewDate.getFullYear()){
      limit = thisDate;
    }else{
      limit = daysInMonth;
    }
    let fromDate = moment(this.viewDate).set('date', 1).format('YYYY-MM-DD');
    let toDate   = moment(this.viewDate).set('date', limit).format('YYYY-MM-DD');
    this.agrometService.getAgrometDataCount(this.station._id, fromDate, toDate)
    .subscribe(
      response => {
        let dataCount = response.data;
        dataCount.forEach((item) => {
          let itemDate = new Date(item.date);
          let ev = this.events.filter((event) => {
            return (
              event.start.getDate() == itemDate.getDate() &&
              event.start.getMonth() == itemDate.getMonth() &&
              event.start.getFullYear() == itemDate.getFullYear()
            )
          })[0];
          ev.title = 'Datos disponibles: ' + item.count;
          ev.color = colors.green;
          ev.actions = [
            this.actions.backupData,
            this.actions.removeData
          ]
        })
      },
      error    => {
        this.notificationsService.error('Error', 'Error al obtener los datos');
      }
    )
  }

  generatePlaceholderEvents(){
    let thisDate = this.viewDate.getDate();
    let daysInMonth = getDaysInMonth(this.viewDate.getMonth(), this.viewDate.getFullYear());

    let limit = null;
    let now = new Date();
    if(now.getMonth() == this.viewDate.getMonth() && now.getFullYear() == this.viewDate.getFullYear()){
      limit = thisDate;
    }else{
      limit = daysInMonth;
    }
    this.events = [];
    for(let i=0; i<limit; i++){
      let date = new Date((new Date()).setDate(i+1));
      let event = {
        start  : date,
        title  : 'Datos no respaldados en esta fecha.',
        color  : colors.red,
        allDay  : true,
        actions : [
          this.actions.backupData
        ]
      }
      this.events.push(event);
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    let fromDate = moment(this.viewDate).format('YYYY-MM-DD');
    if(action=='Upload'){
      let modalRef = this.modal.open(this.modalContent, { size: 'lg' });
      this.agrometService.backupAgrometData(this.station._id, fromDate)
      .subscribe(
        response => {
          this.notificationsService.success('Datos Cargados', response.nData + ' datos de Agromet guardados en la Base de Datos.');
          event.title = 'Datos disponibles: ' + response.nData;
          event.color = colors.green;
          event.actions = [
            this.actions.backupData,
            this.actions.removeData
          ]
          modalRef.close();
        },
        error    => {
          console.log(error);
          this.notificationsService.error('Error', 'Error al obtener los datos.');
        }
      )
    }
    if(action=='Remove'){
      this.agrometService.removeAgrometData(this.station._id, fromDate)
      .subscribe(
        data => {
          this.notificationsService.success('Datos Eliminados', 'Los datos se eliminaron correctamente de la base de datos.');
          event.title = 'Datos no respaldados en esta fecha.';
          event.color = colors.red;
          event.actions = [
            this.actions.backupData
          ]
        },
        error => {
          console.log(error);
          this.notificationsService.error('Error', 'Error al eliminar los datos.');
        }
      )
    }
  }
}
