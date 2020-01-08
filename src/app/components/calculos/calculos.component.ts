import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CalculosService } from '../../services/calculos.service';
import { ChartDataSets, ChartOptions, ChartYAxe } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
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

  public optionsGraficoTotal: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' }
        }
      ],
      yAxes: []
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black'
      }
    }
  };

  public optionsGraficoPeriodos: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' }
        }
      ],
      yAxes: []
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black'
      }
    }
  };

  datos: any;
  labels: Label[] = [];
  labelsTotal: Label[] = ['Total'];

  costePagado: number[] = [];
  costeOptimizado: number[] = [];

  totalPagado: number = 0;
  totalOptimizado: number = 0;

  calculoTotal: ChartDataSets[] = [];
  costeTotal: ChartDataSets[] = [];

  constIE: number = 1.05113;
  iva: number = 1.21;

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
      // .pipe(
      //   filter(value => {
      //     if (value instanceof HttpResponse) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   })
      // )
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
              if (!this.esTarifa6x()) {
                this.costeOptimizado.push(
                  this.redondear(data.results[0].data[i].coste)
                );
                this.totalOptimizado += data.results[0].data[i].coste;
              } else {
                this.costeOptimizado.push(
                  this.redondear(
                    data.results[0].data[i].costeSinExc +
                      data.results[0].data[i].excesos
                  )
                );
                this.totalOptimizado +=
                  data.results[0].data[i].costeSinExc +
                  data.results[0].data[i].excesos;
              }
            }
          }
          if (data.results.length >= 2) {
            for (let i = data.results[1].data.length - 1; i >= 0; i--) {
              if (!this.esTarifa6x()) {
                this.costePagado.push(
                  this.aplicarDescuento(data.results[1].data[i].coste)
                );
                this.totalPagado += data.results[1].data[i].coste;
              } else {
                this.costePagado.push(
                  this.aplicarDescuento(
                    data.results[1].data[i].costeSinExc +
                      data.results[1].data[i].excesos
                  )
                );
                this.totalPagado +=
                  data.results[1].data[i].costeSinExc +
                  data.results[1].data[i].excesos;
              }
            }
          }

          this.costeTotal = [
            { data: this.costePagado, label: 'Pagado' },
            { data: this.costeOptimizado, label: 'Optimizado' }
          ];

          const confEjeYPeriodos: any = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(Math.min.apply(null, this.costeOptimizado) / 2000) *
                  1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];
          this.optionsGraficoPeriodos.scales.yAxes.push(confEjeYPeriodos);

          this.totalPagado = this.aplicarDescuento(this.totalPagado);
          this.totalOptimizado = this.redondear(this.totalOptimizado);

          this.calculoTotal = [
            {
              data: [this.totalPagado],
              label: 'Total Pagado'
            },
            {
              data: [this.totalOptimizado],
              label: 'Total Optimizado'
            }
          ];

          const confEjeY: any = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min(this.totalPagado, this.totalOptimizado) / 2000
                  ) * 1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];
          this.optionsGraficoTotal.scales.yAxes.push(confEjeY);

          Swal.close();
        },
        err => {
          Swal.close();
          console.log(err);
          const error = err;
          // const error = JSON.parse(err.error);
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
      hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear(),
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
    if (!this.esTarifa6x()) {
      doc.autoTable({
        head: [['', 'P1', 'P2', 'P3']],
        body: [
          [
            'Actual',
            this.datos[1].data[0].potenciaP1,
            this.datos[1].data[0].potenciaP2,
            this.datos[1].data[0].potenciaP3
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
    } else {
      doc.autoTable({
        head: [['', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6']],
        body: [
          [
            'Actual',
            this.datos[1].data[0].potenciaP1,
            this.datos[1].data[0].potenciaP2,
            this.datos[1].data[0].potenciaP3,
            this.datos[1].data[0].potenciaP4,
            this.datos[1].data[0].potenciaP5,
            this.datos[1].data[0].potenciaP6
          ]
        ],
        margin: { left: ml, top: mt + 60 },
        tableWidth: 170
      });
    }

    doc.text(
      'Coste del termino de potencia por factura',
      ml + 85,
      mt + 90,
      null,
      null,
      'center'
    );
    // Primera gráfica
    const anchor = event.target;
    const element = document.getElementsByTagName('canvas')[0];
    anchor.href = element.toDataURL();
    doc.addImage(anchor.href, 'PNG', ml - 10, mt + 95, 180, 100);

    // logo de la empresa en la esquina superior derecha
    await html2canvas(this.imagen.nativeElement).then(canvas => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    });

    // const textoTabla =
    //   // tslint:disable-next-line: max-line-length
    //   'El gráfico anterior, representa el coste de cada una de las facturas del último año móvil.
    // En color rosa, representa los costes pagados con las potencias actuales del cliente. En color azul,
    // representa los costes que se hubiesen pagado con las potencias recomendadas.';
    // const textoTablaCortado = doc.splitTextToSize(textoTabla, 150);
    // doc.text(textoTablaCortado, ml, mt + 210, { maxWidth: 170, align: 'justify' });

    const textoPrimerGrafico =
      // tslint:disable-next-line: max-line-length
      'En la tabla superior, están recogidas las potencias contratadas por el cliente. SADCA recomienda modificar estas potencias para conseguir un ahorro en la factura de la luz.\nEl gráfico anterior representa el coste de la potencia de cada una de las facturas del último año móvil. En color rosa se representan los costes a los que ha tenido que hacer frente el cliente por el termino de potencia. En color azul se representan los costes que se hubiesen pagado con las potencias recomendadas.';
    const textoCortado = doc.splitTextToSize(textoPrimerGrafico, 150);
    doc.text(textoCortado, ml, mt + 210, { maxWidth: 170, align: 'justify' });

    // Añadimos una segunda página
    doc.addPage('a4');

    // logo de la empresa en la esquina superior derecha
    await html2canvas(this.imagen.nativeElement).then(canvas => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    });

    doc.text(
      hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear(),
      ml,
      mt
    );

    doc.text(
      'Coste del termino de potencia anual',
      ml + 85,
      mt + 20,
      null,
      null,
      'center'
    );
    // Segunda gráfica
    const anchor2 = event.target;
    const element2 = document.getElementsByTagName('canvas')[1];
    anchor2.href = element2.toDataURL();
    doc.addImage(anchor2.href, 'PNG', ml - 10, mt + 30, 180, 100);

    const impuestoElectrico =
      (this.constIE * this.formulario.impuestoElectrico) / 100;

    const totalPagadoIE = this.totalPagado * impuestoElectrico;
    const totalAhorradoIE = this.totalOptimizado * impuestoElectrico;
    const totalPagadoIVA = totalPagadoIE * this.iva;
    const totalAhorradoIVA = totalAhorradoIE * this.iva;

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
          this.totalOptimizado.toLocaleString('es-ES', {
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
          (this.totalPagado - this.totalOptimizado).toLocaleString('es-ES', {
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
      'Los cálculos realizados en este informe, han tomado como base el consumo del cliente en el último año. Si dicho cliente en los meses posteriores cambia su forma de consumo, SADCA no se compromete a que se alcance el ahorro estimado.';
    const textoCortado2 = doc.splitTextToSize(textoModoPago, 150);
    doc.text(textoCortado2, ml, mt + 190, { maxWidth: 170, align: 'justify' });

    // const textoExencion =
    //   // tslint:disable-next-line: max-line-length
    //   'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    // tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    // quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    // consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    // cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
    // non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    // const textoCortado3 = doc.splitTextToSize(textoExencion, 150);
    // doc.text(textoCortado3, ml, mt + 220, { maxWidth: 170, align: 'justify' });

    // if (this.esTarifa6x()) {
    //   // Añadimos una tercera página
    //   doc.addPage('a4');
    //   // logo de la empresa en la esquina superior derecha
    //   await html2canvas(this.imagen.nativeElement).then(canvas => {
    //     doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    //   });

    //   doc.text(
    //     hoy.getDate() + '/' + hoy.getMonth() + '/' + hoy.getFullYear(),
    //     ml,
    //     mt
    //   );

    //   doc.text('Título gráfica', ml + 85, mt + 20, null, null, 'center');
    //   // Tercera gráfica
    //   const anchor3 = event.target;
    //   const element3 = document.getElementsByTagName('canvas')[2];
    //   anchor3.href = element3.toDataURL();
    //   doc.addImage(anchor3.href, 'PNG', ml - 10, mt + 30, 180, 100);

    //   doc.autoTable({
    //     head: [['Excesos Pagados', 'Excesos Calculados', 'Diferencia']],
    //     body: [
    //       [
    //         this.excesosPagado,
    //         this.excesosAhorrado,
    //         this.excesosPagado - this.excesosAhorrado
    //       ]
    //     ],
    //     margin: { left: ml, top: mt + 140 },
    //     tableWidth: 170
    //   });
    // }

    // Nombre del archivo
    doc.save(`calculo-${this.formulario.propietario}.pdf`);
  }

  esTarifa6x() {
    if (
      this.formulario.tarifa === '6.1A' ||
      this.formulario.tarifa === '6.2' ||
      this.formulario.tarifa === '6.3' ||
      this.formulario.tarifa === '6.4' ||
      this.formulario.tarifa === '6.5'
    ) {
      return true;
    } else {
      return false;
    }
  }

  aplicarDescuento(valor: number) {
    valor = valor - (valor * this.formulario.descuento) / 100;
    valor = this.redondear(valor);
    return valor;
  }

  redondear(valor: number) {
    valor = Math.round(valor * 100);
    return valor / 100;
  }
}
