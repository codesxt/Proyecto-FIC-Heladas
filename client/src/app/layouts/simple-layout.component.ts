import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './simple-layout.component.html'
})
export class SimpleLayoutComponent implements OnInit {
  isCollapsed : boolean = true;
  constructor() { }

  ngOnInit(): void { }

  toggleCollapse(){
    console.log("Toggling");
    this.isCollapsed = !this.isCollapsed;
  }
}
