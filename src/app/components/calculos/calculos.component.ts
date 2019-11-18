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
          console.log('Datos antes', data);
          if (data.body) {
            return JSON.parse(data.body);
          } else {
            return data;
          }
        })
      )
      .subscribe(
        (data: any) => {
          console.log('Datos pasados', this.formulario);

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

  async exportarPDF(event: any) {
    const doc = new jsPdf();

    const mt = 10;
    const ml = 20;

    // Empresa cliente
    // doc.text(this.formulario.propietario, ml, 30);
    doc.setFont('courier');
    doc.setFontSize(10);
    const hoy = new Date();
    doc.text(
      hoy.getDate() + '/' + hoy.getMonth() + '/' + hoy.getFullYear(),
      ml,
      mt
    );

    // Titular
    doc.setFontStyle('bold');
    doc.text('Nombre del titular:', ml, mt + 25);
    doc.setFontStyle('normal');
    doc.text(this.formulario.propietario, ml + 42, mt + 25);

    // CIF
    doc.setFontStyle('bold');
    doc.text('CIF:', ml, mt + 30);
    doc.setFontStyle('normal');
    doc.text('cif', ml + 10, mt + 30);

    // Tarifa
    doc.setFontStyle('bold');
    doc.text('Tarifa:', ml, mt + 35);
    doc.setFontStyle('normal');
    doc.text(this.formulario.tarifa, ml + 17, mt + 35);

    // CUPS
    doc.setFontStyle('bold');
    doc.text('CUPS:', ml, mt + 40);
    doc.setFontStyle('normal');
    doc.text(
      this.formulario.archivo.nombreArchivo.split('.')[0],
      ml + 12,
      mt + 40
    );

    doc.text('Potencia Actual', ml + 85, mt + 55, null, null, 'center');

    // Tabla de potencias
    doc.autoTable({
      head: [['', 'P1', 'P2', 'P3']],
      body: [
        [
          'Actual',
          this.datos[0].data[0].potenciaP1,
          this.datos[0].data[0].potenciaP2,
          this.datos[0].data[0].potenciaP3
        ]
        // [
        //   'Optimizada',
        //   this.datos[0].data[0].potenciaP1,
        //   this.datos[0].data[0].potenciaP2,
        //   this.datos[0].data[0].potenciaP3
        // ]
      ],
      margin: { left: ml, top: mt + 60 },
      tableWidth: 170
    });

    doc.text('Título gráfica', ml + 85, mt + 90, null, null, 'center');
    // Primera gráfica
    const anchor = event.target;
    const element = document.getElementsByTagName('canvas')[0];
    anchor.href = element.toDataURL();
    doc.addImage(anchor.href, 'PNG', ml - 10, mt + 95, 180, 100);

    // logo de la empresa en la esquina superior derecha
    await html2canvas(this.imagen.nativeElement).then(canvas => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    });

    const textoPrimerGrafico =
      // tslint:disable-next-line: max-line-length
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?';
    const textoCortado = doc.splitTextToSize(textoPrimerGrafico, 150);
    doc.text(textoCortado, ml, mt + 210, { maxWidth: 170, align: 'justify' });

    // Añadimos una segunda página
    doc.addPage('a4');

    // logo de la empresa en la esquina superior derecha
    await html2canvas(this.imagen.nativeElement).then(canvas => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    });

    doc.text(
      hoy.getDate() + '/' + hoy.getMonth() + '/' + hoy.getFullYear(),
      ml,
      mt
    );

    doc.text('Título gráfica', ml + 85, mt + 20, null, null, 'center');
    // Segunda gráfica
    const anchor2 = event.target;
    const element2 = document.getElementsByTagName('canvas')[1];
    anchor2.href = element2.toDataURL();
    doc.addImage(anchor2.href, 'PNG', ml - 10, mt + 30, 180, 100);

    const totalPagadoIE = this.totalPagado * 1.05;
    const totalAhorradoIE = this.totalAhorrado * 1.05;
    const totalPagadoIVA = totalPagadoIE * 1.21;
    const totalAhorradoIVA = totalAhorradoIE * 1.21;

    doc.autoTable({
      head: [['', 'Precio', 'Precio IE', 'Precio IVA']],
      body: [
        [
          'Actual',
          this.totalPagado.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          totalPagadoIE.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          totalPagadoIVA.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })
        ],
        [
          'Optimizado',
          this.totalAhorrado.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          totalAhorradoIE.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          totalAhorradoIVA.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })
        ],
        [
          'Diferencia',
          (this.totalPagado - this.totalAhorrado).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          (totalPagadoIE - totalAhorradoIE).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          (totalPagadoIVA - totalAhorradoIVA).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 2
          })
        ]
      ],
      margin: { left: ml, top: mt + 140 },
      tableWidth: 170
    });

    const textoModoPago =
      // tslint:disable-next-line: max-line-length
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const textoCortado2 = doc.splitTextToSize(textoModoPago, 150);
    doc.text(textoCortado2, ml, mt + 190, { maxWidth: 170, align: 'justify' });

    const textoExencion =
      // tslint:disable-next-line: max-line-length
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    const textoCortado3 = doc.splitTextToSize(textoExencion, 150);
    doc.text(textoCortado3, ml, mt + 220, { maxWidth: 170, align: 'justify' });

    // Nombre del archivo
    doc.save(`calculo-${this.formulario.propietario}.pdf`);
  }
}
