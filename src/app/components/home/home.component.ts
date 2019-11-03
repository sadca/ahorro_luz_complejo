import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  calculoHecho: boolean = false;
  formulario: any;
  constructor() {}

  ngOnInit() {}

  calculoRealizado(event: any) {
    this.formulario = event;
    this.calculoHecho = true;
  }
}
