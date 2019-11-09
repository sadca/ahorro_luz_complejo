import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CalculosService } from '../../services/calculos.service';
import { HttpResponse } from '@angular/common/http';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as jsPdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-calculos',
  templateUrl: './calculos.component.html',
  styles: []
})
export class CalculosComponent implements OnInit {
  @Input() formulario: any = {
    propietario: 'Usureros',
    tarifa: '2HA'
  };

  @ViewChild('imagen', { static: true }) imagen: ElementRef;

  tiposChart: any[] = [
    { default: false, valor: 'line', nombre: 'Lineas' },
    { default: true, valor: 'bar', nombre: 'Barras' },
    { default: false, valor: 'horizontalBar', nombre: 'Barras Horizontales' },
    { default: false, valor: 'radar', nombre: 'Radar' },
    { default: false, valor: 'doughnut', nombre: 'Donut' },
    { default: false, valor: 'polarArea', nombre: 'Area' },
    { default: false, valor: 'bubble', nombre: 'Burbujas' },
    { default: false, valor: 'pie', nombre: 'Tarta' },
    { default: false, valor: 'scatter', nombre: 'Dispersión' }
  ];

  datos: any;
  costePagado: number[] = [];
  labels: Label[] = [];
  costeAhorrado: number[] = [];
  costeCalculadoMax: number[] = [];

  totalPagado: number = 0;
  totalAhorrado: number = 0;
  totalCalculadoMax: number = 0;
  labelsTotal: Label[] = ['Total'];
  calculoTotal: ChartDataSets[] = [];
  costeTotal: ChartDataSets[] = [];
  costeTotal2: ChartDataSets[] = [];
  calculoMaxTotal: ChartDataSets[] = [];

  constructor(private calculoServ: CalculosService, private router: Router) {}

  ngOnInit() {
    Swal.fire({
      type: 'info',
      text: 'Calculando...',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.calculoServ
      .getCalculo(this.formulario)
      .pipe(
        filter(value => {
          if (value instanceof HttpResponse) {
            return true;
          } else {
            return false;
          }
        })
      )
      .pipe(
        map((data: any) => {
          // console.log('Datos antes', data);
          if (data.body) {
            return JSON.parse(data.body);
          } else {
            return data;
          }
        })
      )
      .subscribe(
        (data: any) => {
          // console.log('Datos pasados', this.formulario);

          if (!data.ok) {
            Swal.fire({
              type: 'error',
              title: 'Algo ha ocurrido...',
              text:
                'No hemos podido calcular su factura, repita el proceso de nuevo, por favor'
            });
            return;
          }

          this.datos = data.results;
          console.log(this.datos);
          if (data.results.length >= 1) {
            for (let i = data.results[0].data.length - 1; i >= 0; i--) {
              // data.results[0].data[i].CUPS
              this.labels.push(
                this.construirLabel(data.results[0].data[i].fechaInicio) +
                  ' - ' +
                  this.construirLabel(data.results[0].data[i].fechaFin)
              );
              this.costeAhorrado.push(
                Math.floor(data.results[0].data[i].coste)
              );
              this.totalAhorrado += Math.floor(data.results[0].data[i].coste);
            }
          }
          if (data.results.length >= 2) {
            for (let i = data.results[1].data.length - 1; i >= 0; i--) {
              this.costePagado.push(Math.round(data.results[1].data[i].coste));
              this.totalPagado += Math.round(data.results[1].data[i].coste);
            }
          }

          if (data.results.length >= 3) {
            for (let i = data.results[2].data.length - 1; i >= 0; i--) {
              this.costeCalculadoMax.push(
                Math.round(data.results[2].data[i].coste)
              );
              this.totalCalculadoMax += Math.round(
                data.results[2].data[i].coste
              );
            }
          }

          this.costeTotal = [
            { data: this.costePagado, label: 'Pagado' },
            { data: this.costeAhorrado, label: 'Ahorrado' }
          ];

          this.calculoTotal = [
            { data: [this.totalPagado], label: 'Total Pagado' },
            { data: [this.totalAhorrado], label: 'Total Ahorrado' }
          ];

          if (this.costeCalculadoMax.length > 1) {
            this.costeTotal2 = [
              { data: this.costePagado, label: 'Pagado' },
              { data: this.costeCalculadoMax, label: 'Calculado Max' }
            ];
          }

          this.calculoMaxTotal = [
            { data: [this.totalPagado], label: 'Total Pagado' },
            { data: [this.totalCalculadoMax], label: 'Total Calculado Max' }
          ];

          Swal.close();
        },
        err => {
          Swal.close();
          const error = JSON.parse(err.error);
          let mensaje = '';
          if (error.message) {
            mensaje = error.message;
          }
          Swal.fire({
            type: 'error',
            title: 'Algo ha ocurrido...',
            text:
              'No hemos podido calcular su factura, repita el proceso de nuevo, por favor',
            footer: mensaje
          });
          console.log(err);
          this.router.navigate(['/home']);
        },
        () => {
          console.log('Completado');
        }
      );
  }

  construirLabel(label: string): string {
    let result = '';
    const partes = label.split('-');

    const dias = partes[2].split('T')[0];
    const mes = partes[1];
    const anio = partes[0];
    result = dias + '/' + mes + '/' + anio.substr(2, 2);

    return result;
  }

  exportarGrafico(event: any, index: number) {
    const anchor = event.target;

    const element = document.getElementsByTagName('canvas')[index];

    anchor.href = element.toDataURL();

    anchor.download = 'test.png';
  }

  exportarPDF(event: any) {
    const anchor = event.target;
    const element = document.getElementsByTagName('canvas')[0];
    anchor.href = element.toDataURL();

    const doc = new jsPdf();
    // doc.setFontSize(15);
    // doc.text('SADCA', 170, 15);
    // const columns = ['', 'P1', 'P2', 'P3'];
    // const data = [
    //   [1, 'Hola', 'hola@gmail.com', 'Mexico'],
    //   [2, 'Hello', 'hello@gmail.com', 'Estados Unidos'],
    //   [3, 'Otro', 'otro@gmail.com', 'Otro']
    // ];
    // doc.autoTable(columns, data, { margin: 25, tableWidth: 'wrap' });
    doc.setFontSize(40);
    doc.text(this.formulario.propietario, 20, 30);
    doc.addImage(anchor.href, 'PNG', 15, 40, 180, 100);
    doc.autoTable({
      head: [['', 'P1', 'P2', 'P3']],
      body: [
        [
          'Actual',
          this.datos[1].data[0].potenciaP1,
          this.datos[1].data[0].potenciaP2,
          this.datos[1].data[0].potenciaP3
        ],
        [
          'Optimizada',
          this.datos[0].data[0].potenciaP1,
          this.datos[0].data[0].potenciaP2,
          this.datos[0].data[0].potenciaP3
        ]
      ],
      margin: { top: 160 }
    });
    html2canvas(this.imagen.nativeElement).then(canvas => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 170, 15, 20, 6);
    });
    setTimeout(() => {
      const anchor2 = event.target;
      const element2 = document.getElementsByTagName('canvas')[1];
      anchor2.href = element2.toDataURL();

      doc.addPage('a4');
      doc.addImage(anchor2.href, 'PNG', 15, 40, 180, 100);
      doc.save('a4.pdf');
      console.log('gola');
    }, 5000);
    // anchor.download = 'test.png';
  }
}
