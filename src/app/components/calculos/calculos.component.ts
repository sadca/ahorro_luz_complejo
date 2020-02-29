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

  public optGrafPerPot: ChartOptions = {
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
  public optGrafTotalPot: ChartOptions = {
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
  public optGrafPerEner: ChartOptions = {
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
  public optGrafTotalEner: ChartOptions = {
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
  public optGrafPerTotal: ChartOptions = {
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
  public optGrafTotal: ChartOptions = {
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

  labelsTotal: Label[] = ['Total'];

  datos: any;
  labelsPotencia: Label[] = [];
  labelsTotalPotencia: Label[] = ['Total Potencia'];

  costePagadoPotencia: number[] = [];
  costeOptimizadoPotencia: number[] = [];

  totalPagadoPotencia: number = 0;
  totalOptimizadoPotencia: number = 0;

  calculoTotalPotencia: ChartDataSets[] = [];
  costeTotalPotencia: ChartDataSets[] = [];

  labelsEnergia: Label[] = [];
  labelsTotalEnergia: Label[] = ['Total Energía'];

  costePagadoEnergiaMensual: number[] = [];
  costeOptimizadoEnergiaMensual: number[] = [];

  totalPagadoEnergia: number = 0;
  totalOptimizadoEnergia: number = 0;

  calculoTotalEnergia: ChartDataSets[] = [];
  costeTotalEnergia: ChartDataSets[] = [];

  costePagadoConjunto: number[] = [];
  costeOptimizadoConjunto: number[] = [];
  sumaTotalPagado: number = 0;
  sumaTotalOptimizado: number = 0;
  sumaTotal: ChartDataSets[] = [];
  sumaTotalPeriodos: ChartDataSets[] = [];

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

          if (this.formulario.comparadorPrecios === true) {
            this.datos = data.results;

            for (let i = data.results[0].data.length - 1; i >= 0; i--) {
              this.labelsPotencia.push(
                this.construirLabel(data.results[0].data[i].fechaInicio) +
                  ' - ' +
                  this.construirLabel(data.results[0].data[i].fechaFin)
              );
              this.labelsEnergia.push(
                this.construirLabel(data.results[0].data[i].fechaInicio) +
                  ' - ' +
                  this.construirLabel(data.results[0].data[i].fechaFin)
              );

              this.costePagadoPotencia.push(
                this.aplicarDescuentoPotencia(
                  data.results[0].data[i].ImportePotencia1 +
                    data.results[0].data[i].ImportePotencia2 +
                    data.results[0].data[i].ImportePotencia3 +
                    data.results[0].data[i].ImportePotencia4 +
                    data.results[0].data[i].ImportePotencia5 +
                    data.results[0].data[i].ImportePotencia6
                )
              );

              this.totalPagadoPotencia +=
                data.results[0].data[i].ImportePotencia1 +
                data.results[0].data[i].ImportePotencia2 +
                data.results[0].data[i].ImportePotencia3 +
                data.results[0].data[i].ImportePotencia4 +
                data.results[0].data[i].ImportePotencia5 +
                data.results[0].data[i].ImportePotencia6;

              this.costePagadoEnergiaMensual.push(
                this.aplicarDescuentoEnergia(
                  data.results[0].data[i].ImporteEnergia1 +
                    data.results[0].data[i].ImporteEnergia2 +
                    data.results[0].data[i].ImporteEnergia3 +
                    data.results[0].data[i].ImporteEnergia4 +
                    data.results[0].data[i].ImporteEnergia5 +
                    data.results[0].data[i].ImporteEnergia6
                )
              );

              this.totalPagadoEnergia +=
                data.results[0].data[i].ImporteEnergia1 +
                data.results[0].data[i].ImporteEnergia2 +
                data.results[0].data[i].ImporteEnergia3 +
                data.results[0].data[i].ImporteEnergia4 +
                data.results[0].data[i].ImporteEnergia5 +
                data.results[0].data[i].ImporteEnergia6;

              this.sumaTotalPagado += this.redondear(
                data.results[0].data[i].coste
              );
            }

            for (let i = data.results[1].data.length - 1; i >= 0; i--) {
              this.costeOptimizadoPotencia.push(
                this.aplicarDescuentoPotencia(
                  data.results[1].data[i].ImportePotencia1 +
                    data.results[1].data[i].ImportePotencia2 +
                    data.results[1].data[i].ImportePotencia3 +
                    data.results[1].data[i].ImportePotencia4 +
                    data.results[1].data[i].ImportePotencia5 +
                    data.results[1].data[i].ImportePotencia6
                )
              );

              this.totalOptimizadoPotencia +=
                data.results[1].data[i].ImportePotencia1 +
                data.results[1].data[i].ImportePotencia2 +
                data.results[1].data[i].ImportePotencia3 +
                data.results[1].data[i].ImportePotencia4 +
                data.results[1].data[i].ImportePotencia5 +
                data.results[1].data[i].ImportePotencia6;

              this.costeOptimizadoEnergiaMensual.push(
                this.aplicarDescuentoEnergia(
                  data.results[1].data[i].ImporteEnergia1 +
                    data.results[1].data[i].ImporteEnergia2 +
                    data.results[1].data[i].ImporteEnergia3 +
                    data.results[1].data[i].ImporteEnergia4 +
                    data.results[1].data[i].ImporteEnergia5 +
                    data.results[1].data[i].ImporteEnergia6
                )
              );

              this.totalOptimizadoEnergia +=
                data.results[1].data[i].ImporteEnergia1 +
                data.results[1].data[i].ImporteEnergia2 +
                data.results[1].data[i].ImporteEnergia3 +
                data.results[1].data[i].ImporteEnergia4 +
                data.results[1].data[i].ImporteEnergia5 +
                data.results[1].data[i].ImporteEnergia6;

              this.sumaTotalOptimizado += this.redondear(
                data.results[1].data[i].coste
              );
            }
          } else {
            this.datos = data.results;
            // console.log(this.datos);
            if (data.results.length >= 1) {
              for (let i = data.results[0].data.length - 1; i >= 0; i--) {
                // data.results[0].data[i].CUPS
                this.labelsPotencia.push(
                  this.construirLabel(data.results[0].data[i].fechaInicio) +
                    ' - ' +
                    this.construirLabel(data.results[0].data[i].fechaFin)
                );
                if (!this.esTarifa6x()) {
                  this.costeOptimizadoPotencia.push(
                    this.redondear(data.results[0].data[i].coste)
                  );
                  this.totalOptimizadoPotencia += data.results[0].data[i].coste;
                } else {
                  this.costeOptimizadoPotencia.push(
                    this.redondear(
                      data.results[0].data[i].costeSinExc +
                        data.results[0].data[i].excesos
                    )
                  );
                  this.totalOptimizadoPotencia +=
                    data.results[0].data[i].costeSinExc +
                    data.results[0].data[i].excesos;
                }
              }
            }

            if (data.results.length >= 2) {
              for (let i = data.results[1].data.length - 1; i >= 0; i--) {
                if (!this.esTarifa6x()) {
                  this.costePagadoPotencia.push(
                    this.aplicarDescuentoPotencia(data.results[1].data[i].coste)
                  );
                  this.totalPagadoPotencia += data.results[1].data[i].coste;
                } else {
                  this.costePagadoPotencia.push(
                    this.aplicarDescuentoPotencia(
                      data.results[1].data[i].costeSinExc +
                        data.results[1].data[i].excesos
                    )
                  );
                  this.totalPagadoPotencia +=
                    data.results[1].data[i].costeSinExc +
                    data.results[1].data[i].excesos;
                }
              }
            }

            if (data.results.length >= 3) {
              // console.log(data.results[2]);
              for (let i = data.results[2].data.length - 1; i >= 0; i--) {
                this.labelsEnergia.push(
                  this.construirLabel(data.results[2].data[i].fechaInicio) +
                    ' - ' +
                    this.construirLabel(data.results[2].data[i].fechaFin)
                );

                if (!this.esTarifa6x()) {
                  this.costeOptimizadoEnergiaMensual.push(
                    this.redondear(
                      data.results[2].data[i].costeNuevo1 +
                        data.results[2].data[i].costeNuevo2 +
                        data.results[2].data[i].costeNuevo3
                    )
                  );
                  this.totalOptimizadoEnergia +=
                    data.results[2].data[i].costeNuevo1 +
                    data.results[2].data[i].costeNuevo2 +
                    data.results[2].data[i].costeNuevo3;

                  this.costePagadoEnergiaMensual.push(
                    this.aplicarDescuentoEnergia(
                      data.results[2].data[i].costeActual1 +
                        data.results[2].data[i].costeActual2 +
                        data.results[2].data[i].costeActual3
                    )
                  );
                  this.totalPagadoEnergia +=
                    data.results[2].data[i].costeActual1 +
                    data.results[2].data[i].costeActual2 +
                    data.results[2].data[i].costeActual3;
                } else {
                  this.costeOptimizadoEnergiaMensual.push(
                    this.redondear(
                      data.results[2].data[i].costeNuevo1 +
                        data.results[2].data[i].costeNuevo2 +
                        data.results[2].data[i].costeNuevo3 +
                        data.results[2].data[i].costeNuevo4 +
                        data.results[2].data[i].costeNuevo5 +
                        data.results[2].data[i].costeNuevo6
                    )
                  );
                  this.totalOptimizadoEnergia +=
                    data.results[2].data[i].costeNuevo1 +
                    data.results[2].data[i].costeNuevo2 +
                    data.results[2].data[i].costeNuevo3 +
                    data.results[2].data[i].costeNuevo4 +
                    data.results[2].data[i].costeNuevo5 +
                    data.results[2].data[i].costeNuevo6;

                  this.costePagadoEnergiaMensual.push(
                    this.aplicarDescuentoEnergia(
                      data.results[2].data[i].costeActual1 +
                        data.results[2].data[i].costeActual2 +
                        data.results[2].data[i].costeActual3 +
                        data.results[2].data[i].costeActual4 +
                        data.results[2].data[i].costeActual5 +
                        data.results[2].data[i].costeActual6
                    )
                  );
                  this.totalPagadoEnergia +=
                    data.results[2].data[i].costeActual1 +
                    data.results[2].data[i].costeActual2 +
                    data.results[2].data[i].costeActual3 +
                    data.results[2].data[i].costeActual4 +
                    data.results[2].data[i].costeActual5 +
                    data.results[2].data[i].costeActual6;
                }
              }
            }

            this.sumaTotalPagado = this.redondear(
              this.totalPagadoPotencia + this.totalPagadoEnergia
            );
            this.sumaTotalOptimizado = this.redondear(
              this.totalOptimizadoPotencia + this.totalOptimizadoEnergia
            );
          }

          this.costeTotalPotencia = [
            { data: this.costePagadoPotencia, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoPotencia,
              label: 'Factura Optimizada'
            }
          ];

          let confEjeY: any = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min.apply(null, this.costeOptimizadoPotencia) / 2000
                  ) * 1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];
          this.optGrafPerPot.scales.yAxes.push(confEjeY);

          this.totalPagadoPotencia = this.aplicarDescuentoPotencia(
            this.totalPagadoPotencia
          );
          this.totalOptimizadoPotencia = this.redondear(
            this.totalOptimizadoPotencia
          );

          this.calculoTotalPotencia = [
            {
              data: [this.totalPagadoPotencia],
              label: 'Factura anual actual'
            },
            {
              data: [this.totalOptimizadoPotencia],
              label: 'Factura anual optimizada'
            }
          ];

          confEjeY = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min(
                      this.totalPagadoPotencia,
                      this.totalOptimizadoPotencia
                    ) / 2000
                  ) * 1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];
          this.optGrafTotalPot.scales.yAxes.push(confEjeY);

          this.costeTotalEnergia = [
            { data: this.costePagadoEnergiaMensual, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoEnergiaMensual,
              label: 'Factura Optimizada'
            }
          ];

          confEjeY = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min.apply(null, this.costeOptimizadoEnergiaMensual) /
                      2000
                  ) * 1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];

          this.totalPagadoEnergia = this.aplicarDescuentoEnergia(
            this.totalPagadoEnergia
          );
          this.totalOptimizadoEnergia = this.redondear(
            this.totalOptimizadoEnergia
          );
          this.calculoTotalEnergia = [
            {
              data: [this.totalPagadoEnergia],
              label: 'Factura anual actual'
            },
            {
              data: [this.totalOptimizadoEnergia],
              label: 'Factura anual optimizada'
            }
          ];

          confEjeY = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min(
                      this.totalPagadoEnergia,
                      this.totalOptimizadoEnergia
                    ) / 2000
                  ) * 1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];
          this.optGrafTotalEner.scales.yAxes.push(confEjeY);

          this.costeTotalPotencia = [
            { data: this.costePagadoPotencia, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoPotencia,
              label: 'Factura Optimizada'
            }
          ];

          this.costeTotalEnergia = [
            { data: this.costePagadoEnergiaMensual, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoEnergiaMensual,
              label: 'Factura Optimizada'
            }
          ];

          for (let i = 0; i < this.costePagadoPotencia.length; i++) {
            this.costePagadoConjunto.push(
              this.redondear(
                this.costePagadoPotencia[i] + this.costePagadoEnergiaMensual[i]
              )
            );
            this.costeOptimizadoConjunto.push(
              this.redondear(
                this.costeOptimizadoPotencia[i] +
                  this.costeOptimizadoEnergiaMensual[i]
              )
            );
          }

          this.sumaTotalPeriodos = [
            { data: this.costePagadoConjunto, label: 'Factura Pagada' },
            { data: this.costeOptimizadoConjunto, label: 'Factura Calculada' }
          ];

          this.sumaTotalPagado = this.redondear(this.sumaTotalPagado);
          this.sumaTotalOptimizado = this.redondear(this.sumaTotalOptimizado);

          this.sumaTotal = [
            {
              data: [this.sumaTotalPagado],
              label: 'Total Pagado'
            },
            {
              data: [this.sumaTotalOptimizado],
              label: 'Total Optimizado'
            }
          ];

          confEjeY = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min(this.sumaTotalPagado, this.sumaTotalOptimizado) /
                      2000
                  ) * 1000
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' }
            }
          ];
          this.optGrafTotal.scales.yAxes.push(confEjeY);

          Swal.close();
        },
        err => {
          Swal.close();
          // console.log(err);
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
          // console.log('Completado');
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

    const mt = 5;
    const ml = 20;

    // Empresa cliente
    // doc.text(this.formulario.propietario, ml, 30);
    doc.setFont('courier');
    doc.setFontSize(10);
    const hoy = new Date();
    // doc.text(
    //   hoy.getDate() + '/' + (hoy.getMonth() + 1) + '/' + hoy.getFullYear(),
    //   ml,
    //   mt
    // );
    doc.text(this.construirFecha(hoy), ml, mt + 5);

    doc.text('carlos.martinez@sadca.es', ml + 45, mt + 5);
    doc.text('www.sadca.es', ml + 110, mt + 5);

    // Titular
    doc.setFontStyle('bold');
    doc.text('Nombre del titular:', ml, mt + 20);
    doc.setFontStyle('normal');
    doc.text(this.formulario.propietario, ml + 42, mt + 20);

    // CIF
    // doc.setFontStyle('bold');
    // doc.text('CIF:', ml, mt + 30);
    // doc.setFontStyle('normal');
    // doc.text('cif', ml + 10, mt + 30);

    // Tarifa
    doc.setFontStyle('bold');
    doc.text('Tarifa:', ml, mt + 25);
    doc.setFontStyle('normal');
    doc.text(this.formulario.tarifa, ml + 17, mt + 25);

    // CUPS
    doc.setFontStyle('bold');
    doc.text('CUPS:', ml, mt + 30);
    doc.setFontStyle('normal');
    doc.text(
      this.formulario.archivo.nombreArchivo.split('.')[0],
      ml + 12,
      mt + 30
    );

    doc.text('Término de Potencia', ml + 85, mt + 40, null, null, 'center');
    doc.text('___________________', ml + 85, mt + 40, null, null, 'center');

    // Tabla de potencias
    // if (!this.esTarifa6x()) {
    //   if (!this.formulario.comparadorPrecios) {
    //     doc.autoTable({
    //       head: [['', 'P1(kW)', 'P2(kW)', 'P3(kW)']],
    //       body: [
    //         [
    //           'Potencia Actual',
    //           this.datos[1].data[0].potenciaP1,
    //           this.datos[1].data[0].potenciaP2,
    //           this.datos[1].data[0].potenciaP3
    //         ]
    //       ],
    //       startY: mt + 45,
    //       margin: { left: ml, top: mt + 45 },
    //       tableWidth: 170
    //     });
    //   } else {
    //     doc.autoTable({
    //       head: [['', 'P1(kW)', 'P2(kW)', 'P3(kW)']],
    //       body: [
    //         [
    //           'Potencia Actual',
    //           this.formulario.p1,
    //           this.formulario.p2,
    //           this.formulario.p3
    //         ]
    //       ],
    //       startY: mt + 45,
    //       margin: { left: ml, top: mt + 45 },
    //       tableWidth: 170
    //     });
    //   }
    // } else {
    //   if (!this.formulario.comparadorPrecios) {
    //     doc.autoTable({
    //       head: [['', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6']],
    //       body: [
    //         [
    //           'Actual',
    //           this.datos[1].data[0].potenciaP1,
    //           this.datos[1].data[0].potenciaP2,
    //           this.datos[1].data[0].potenciaP3,
    //           this.datos[1].data[0].potenciaP4,
    //           this.datos[1].data[0].potenciaP5,
    //           this.datos[1].data[0].potenciaP6
    //         ]
    //       ],
    //       startY: mt + 45,
    //       margin: { left: ml, top: mt + 45 },
    //       tableWidth: 170
    //     });
    //   } else {
    //     doc.autoTable({
    //       head: [['', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6']],
    //       body: [
    //         [
    //           'Actual',
    //           this.formulario.p1,
    //           this.formulario.p2,
    //           this.formulario.p3,
    //           this.formulario.p4,
    //           this.formulario.p5,
    //           this.formulario.p6
    //         ]
    //       ],
    //       startY: mt + 45,
    //       margin: { left: ml, top: mt + 45 },
    //       tableWidth: 170
    //     });
    //   }
    // }

    if (!this.esTarifa6x()) {
      doc.autoTable({
        head: [['', 'P1(€/kWh)', 'P2(€/kWh)', 'P3(€/kWh)']],
        body: [
          [
            'Actual',
            this.formulario.precioP1,
            this.formulario.precioP2,
            this.formulario.precioP3
          ],
          [
            'Nueva',
            this.formulario.precioP1opt,
            this.formulario.precioP2opt,
            this.formulario.precioP3opt
          ]
        ],
        startY: mt + 45,
        margin: { left: ml, top: mt + 45 },
        tableWidth: 170
      });
    } else {
      doc.autoTable({
        head: [
          [
            '',
            'P1(€/kWh)',
            'P2(€/kWh)',
            'P3(€/kWh)',
            'P4(€/kWh)',
            'P5(€/kWh)',
            'P6(€/kWh)'
          ]
        ],
        body: [
          [
            'Actual',
            this.formulario.precioP1,
            this.formulario.precioP2,
            this.formulario.precioP3,
            this.formulario.precioP4,
            this.formulario.precioP5,
            this.formulario.precioP6
          ],
          [
            'Nueva',
            this.formulario.precioP1opt,
            this.formulario.precioP2opt,
            this.formulario.precioP3opt,
            this.formulario.precioP4opt,
            this.formulario.precioP5opt,
            this.formulario.precioP6opt
          ]
        ],
        startY: mt + 45,
        margin: { left: ml, top: mt + 45 },
        tableWidth: 170
      });
    }

    doc.text('Término de Energía', ml + 85, mt + 80, null, null, 'center');
    doc.text('__________________', ml + 85, mt + 80, null, null, 'center');

    if (!this.esTarifa6x()) {
      if (!this.formulario.comparadorPrecios) {
        doc.autoTable({
          head: [['', 'E1(€/kWh)', 'E2(€/kWh)', 'E3(€/kWh)']],
          body: [
            [
              'Actual',
              this.datos[2].data[0].precioEnergiaActual1,
              this.datos[2].data[0].precioEnergiaActual2,
              this.datos[2].data[0].precioEnergiaActual3
            ],
            [
              'Nueva',
              this.datos[2].data[0].precioEnergiaNuevo1,
              this.datos[2].data[0].precioEnergiaNuevo2,
              this.datos[2].data[0].precioEnergiaNuevo3
            ]
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170
        });
      } else {
        doc.autoTable({
          head: [['', 'E1(€/kWh)', 'E2(€/kWh)', 'E3(€/kWh)']],
          body: [
            [
              'Actual',
              this.formulario.precioE1Actual,
              this.formulario.precioE2Actual,
              this.formulario.precioE3Actual
            ],
            [
              'Nueva',
              this.formulario.precioE1Optimizada,
              this.formulario.precioE2Optimizada,
              this.formulario.precioE3Optimizada
            ]
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170
        });
      }
    } else {
      if (!this.formulario.comparadorPrecios) {
        doc.autoTable({
          head: [
            [
              '',
              'E1(€/kWh)',
              'E2(€/kWh)',
              'E3(€/kWh)',
              'E4(€/kWh)',
              'E5(€/kWh)',
              'E6(€/kWh)'
            ]
          ],
          body: [
            [
              'Actual',
              this.datos[2].data[0].precioEnergiaActual1,
              this.datos[2].data[0].precioEnergiaActual2,
              this.datos[2].data[0].precioEnergiaActual3,
              this.datos[2].data[0].precioEnergiaActual4,
              this.datos[2].data[0].precioEnergiaActual5,
              this.datos[2].data[0].precioEnergiaActual6
            ],
            [
              'Nueva',
              this.datos[2].data[0].precioEnergiaNuevo1,
              this.datos[2].data[0].precioEnergiaNuevo2,
              this.datos[2].data[0].precioEnergiaNuevo3,
              this.datos[2].data[0].precioEnergiaNuevo4,
              this.datos[2].data[0].precioEnergiaNuevo5,
              this.datos[2].data[0].precioEnergiaNuevo6
            ]
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170
        });
      } else {
        doc.autoTable({
          head: [
            [
              '',
              'E1(€/kWh)',
              'E2(€/kWh)',
              'E3(€/kWh)',
              'E4(€/kWh)',
              'E5(€/kWh)',
              'E6(€/kWh)'
            ]
          ],
          body: [
            [
              'Actual',
              this.formulario.precioE1Actual,
              this.formulario.precioE2Actual,
              this.formulario.precioE3Actual,
              this.formulario.precioE4Actual,
              this.formulario.precioE5Actual,
              this.formulario.precioE6Actual
            ],
            [
              'Nueva',
              this.formulario.precioE1Optimizada,
              this.formulario.precioE2Optimizada,
              this.formulario.precioE3Optimizada,
              this.formulario.precioE4Optimizada,
              this.formulario.precioE5Optimizada,
              this.formulario.precioE6Optimizada
            ]
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170
        });
      }
    }

    const anchor = event.target;
    const element = document.getElementsByTagName('canvas')[4];
    anchor.href = element.toDataURL();
    doc.addImage(anchor.href, 'PNG', ml - 15, mt + 115, 190, 100);

    doc.text('Factura Anual', ml + 85, mt + 225, null, null, 'center');
    doc.text('_____________', ml + 85, mt + 225, null, null, 'center');

    const impuestoElectrico =
      (this.constIE * this.formulario.impuestoElectrico) / 100;
    const sumaTotalPagadoIE = this.sumaTotalPagado * impuestoElectrico;
    const sumaTotalAhorradoIE = this.sumaTotalOptimizado * impuestoElectrico;
    const sumaTotalPagadoIVA = sumaTotalPagadoIE * this.iva;
    const sumaTotalAhorradoIVA = sumaTotalAhorradoIE * this.iva;

    doc.autoTable({
      head: [
        [
          '',
          'Factura Total',
          'Factura Total\n(IE incluido)',
          'Factura Total\n(IVA incluido)'
        ]
      ],
      body: [
        [
          'Actual',
          this.sumaTotalPagado.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          sumaTotalPagadoIE.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          sumaTotalPagadoIVA.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })
        ],
        [
          'Optimizado',
          this.sumaTotalOptimizado.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          sumaTotalAhorradoIE.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          sumaTotalAhorradoIVA.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })
        ],
        [
          'Ahorro',
          (this.sumaTotalPagado - this.sumaTotalOptimizado).toLocaleString(
            'es-ES',
            {
              style: 'currency',
              currency: 'EUR'
            }
          ),
          (sumaTotalPagadoIE - sumaTotalAhorradoIE).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }),
          (sumaTotalPagadoIVA - sumaTotalAhorradoIVA).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 2
          })
        ]
      ],
      startY: mt + 230,
      margin: { left: ml, top: mt + 230 },
      tableWidth: 170
    });

    // doc.text(
    //   'Coste del término de potencia por factura',
    //   ml + 85,
    //   mt + 90,
    //   null,
    //   null,
    //   'center'
    // );
    // doc.text(
    //   '_________________________________________',
    //   ml + 85,
    //   mt + 90,
    //   null,
    //   null,
    //   'center'
    // );
    // // Primera gráfica
    // const anchor = event.target;
    // const element = document.getElementsByTagName('canvas')[0];
    // anchor.href = element.toDataURL();
    // doc.addImage(anchor.href, 'PNG', ml - 10, mt + 120, 180, 100);

    doc.setFontSize(7);
    const textoPrimerGrafico =
      // tslint:disable-next-line: max-line-length
      'El presente informe se ha realizado utilizando los datos de potencia y energía del ultimo año móvil, SADCA Energy no se hace responsable de que se alcance el ahorro estimado si hay cambios en el consumo, la potencia o el marco regulatorio. El contenido de este estudio es meramente informativo.';
    const textoCortado = doc.splitTextToSize(textoPrimerGrafico, 150);
    doc.text(textoCortado, ml, mt + 275, { maxWidth: 170, align: 'justify' });

    // logo de la empresa en la esquina superior derecha
    await html2canvas(this.imagen.nativeElement).then(canvas => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 180, 5, 20, 8);
    });

    // const textoPrimerGrafico =
    // tslint:disable-next-line: max-line-length
    // 'En la tabla superior, están recogidas las potencias contratadas por el cliente. SADCA recomienda modificar estas potencias para conseguir un ahorro en la factura de la luz.\nEl gráfico anterior representa el coste de la potencia de cada una de las facturas del último año móvil. En color azul se representan los costes a los que ha tenido que hacer frente el cliente por el término de potencia. En color amarillo se representan los costes que se hubiesen pagado con las potencias recomendadas.';
    // const textoCortado = doc.splitTextToSize(textoPrimerGrafico, 150);
    // doc.text(textoCortado, ml, mt + 220, { maxWidth: 170, align: 'justify' });

    // // Añadimos una segunda página
    // doc.addPage('a4');

    // // logo de la empresa en la esquina superior derecha
    // await html2canvas(this.imagen.nativeElement).then(canvas => {
    //   doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    // });

    // doc.text(this.construirFecha(hoy), ml, mt);

    // doc.text(
    //   'Coste del término de potencia anual',
    //   ml + 85,
    //   mt + 20,
    //   null,
    //   null,
    //   'center'
    // );
    // doc.text(
    //   '___________________________________',
    //   ml + 85,
    //   mt + 20,
    //   null,
    //   null,
    //   'center'
    // );
    // // Segunda gráfica
    // const anchor2 = event.target;
    // const element2 = document.getElementsByTagName('canvas')[1];
    // anchor2.href = element2.toDataURL();
    // doc.addImage(anchor2.href, 'PNG', ml - 10, mt + 30, 180, 100);

    // const totalPagadoIE = this.totalPagadoPotencia * impuestoElectrico;
    // const totalAhorradoIE = this.totalOptimizadoPotencia * impuestoElectrico;
    // const totalPagadoIVA = totalPagadoIE * this.iva;
    // const totalAhorradoIVA = totalAhorradoIE * this.iva;

    // doc.autoTable({
    //   head: [
    //     [
    //       '',
    //       'Precio Potencia',
    //       'Precio Potencia\n(IE incluido)',
    //       'Precio Potencia\n(IVA incluido)'
    //     ]
    //   ],
    //   body: [
    //     [
    //       'Actual',
    //       this.totalPagadoPotencia.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalPagadoIE.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalPagadoIVA.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       })
    //     ],
    //     [
    //       'Optimizado',
    //       this.totalOptimizadoPotencia.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalAhorradoIE.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalAhorradoIVA.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       })
    //     ],
    //     [
    //       'Diferencia',
    //       (
    //         this.totalPagadoPotencia - this.totalOptimizadoPotencia
    //       ).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       (totalPagadoIE - totalAhorradoIE).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       (totalPagadoIVA - totalAhorradoIVA).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR',
    //         maximumFractionDigits: 2
    //       })
    //     ]
    //   ],
    //   margin: { left: ml, top: mt + 140 },
    //   tableWidth: 170
    // });

    // const textoModoPago =
    // tslint:disable-next-line: max-line-length
    //   'Los cálculos realizados en este informe, han tomado como base el consumo del cliente en el último año. Si el cliente cambiara su forma de consumo, SADCA no se compromete a que se alcance el ahorro estimado.';
    // const textoCortado2 = doc.splitTextToSize(textoModoPago, 150);
    // doc.text(textoCortado2, ml, mt + 190, { maxWidth: 170, align: 'justify' });

    // // Añadimos una tercera página
    // doc.addPage('a4');
    // // logo de la empresa en la esquina superior derecha
    // await html2canvas(this.imagen.nativeElement).then(canvas => {
    //   doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    // });

    // doc.text(this.construirFecha(hoy), ml, mt);

    // doc.text('Término de Energía', ml + 85, mt + 20, null, null, 'center');
    // doc.text('__________________', ml + 85, mt + 20, null, null, 'center');

    // if (!this.esTarifa6x()) {
    //   if (!this.formulario.comparadorPrecios) {
    //     doc.autoTable({
    //       head: [['', 'E1(€/kWh)', 'E2(€/kWh)', 'E3(€/kWh)']],
    //       body: [
    //         [
    //           'Actual',
    //           this.datos[2].data[0].precioEnergiaActual1,
    //           this.datos[2].data[0].precioEnergiaActual2,
    //           this.datos[2].data[0].precioEnergiaActual3
    //         ],
    //         [
    //           'Nueva',
    //           this.datos[2].data[0].precioEnergiaNuevo1,
    //           this.datos[2].data[0].precioEnergiaNuevo2,
    //           this.datos[2].data[0].precioEnergiaNuevo3
    //         ]
    //       ],
    //       margin: { left: ml, top: mt + 30 },
    //       tableWidth: 170
    //     });
    //   } else {
    //     doc.autoTable({
    //       head: [['', 'E1(€/kWh)', 'E2(€/kWh)', 'E3(€/kWh)']],
    //       body: [
    //         [
    //           'Actual',
    //           this.formulario.precioE1Actual,
    //           this.formulario.precioE2Actual,
    //           this.formulario.precioE3Actual
    //         ],
    //         [
    //           'Nueva',
    //           this.formulario.precioE1Optimizada,
    //           this.formulario.precioE2Optimizada,
    //           this.formulario.precioE3Optimizada
    //         ]
    //       ],
    //       margin: { left: ml, top: mt + 30 },
    //       tableWidth: 170
    //     });
    //   }
    // } else {
    //   if (!this.formulario.comparadorPrecios) {
    //     doc.autoTable({
    //       head: [
    //         [
    //           '',
    //           'E1(€/kWh)',
    //           'E2(€/kWh)',
    //           'E3(€/kWh)',
    //           'E4(€/kWh)',
    //           'E5(€/kWh)',
    //           'E6(€/kWh)'
    //         ]
    //       ],
    //       body: [
    //         [
    //           'Actual',
    //           this.datos[2].data[0].precioEnergiaActual1,
    //           this.datos[2].data[0].precioEnergiaActual2,
    //           this.datos[2].data[0].precioEnergiaActual3,
    //           this.datos[2].data[0].precioEnergiaActual4,
    //           this.datos[2].data[0].precioEnergiaActual5,
    //           this.datos[2].data[0].precioEnergiaActual6
    //         ],
    //         [
    //           'Nueva',
    //           this.datos[2].data[0].precioEnergiaNuevo1,
    //           this.datos[2].data[0].precioEnergiaNuevo2,
    //           this.datos[2].data[0].precioEnergiaNuevo3,
    //           this.datos[2].data[0].precioEnergiaNuevo4,
    //           this.datos[2].data[0].precioEnergiaNuevo5,
    //           this.datos[2].data[0].precioEnergiaNuevo6
    //         ]
    //       ],
    //       margin: { left: ml, top: mt + 30 },
    //       tableWidth: 170
    //     });
    //   } else {
    //     doc.autoTable({
    //       head: [
    //         [
    //           '',
    //           'E1(€/kWh)',
    //           'E2(€/kWh)',
    //           'E3(€/kWh)',
    //           'E4(€/kWh)',
    //           'E5(€/kWh)',
    //           'E6(€/kWh)'
    //         ]
    //       ],
    //       body: [
    //         [
    //           'Actual',
    //           this.formulario.precioE1Actual,
    //           this.formulario.precioE2Actual,
    //           this.formulario.precioE3Actual,
    //           this.formulario.precioE4Actual,
    //           this.formulario.precioE5Actual,
    //           this.formulario.precioE6Actual
    //         ],
    //         [
    //           'Nueva',
    //           this.formulario.precioE1Optimizada,
    //           this.formulario.precioE2Optimizada,
    //           this.formulario.precioE3Optimizada,
    //           this.formulario.precioE4Optimizada,
    //           this.formulario.precioE5Optimizada,
    //           this.formulario.precioE6Optimizada
    //         ]
    //       ],
    //       margin: { left: ml, top: mt + 30 },
    //       tableWidth: 170
    //     });
    //   }
    // }
    // // Tercera gráfica
    // doc.text(
    //   'Coste del término de energía por factura',
    //   ml + 85,
    //   mt + 70,
    //   null,
    //   null,
    //   'center'
    // );
    // doc.text(
    //   '________________________________________',
    //   ml + 85,
    //   mt + 70,
    //   null,
    //   null,
    //   'center'
    // );
    // const anchor3 = event.target;
    // const element3 = document.getElementsByTagName('canvas')[2];
    // anchor3.href = element3.toDataURL();
    // doc.addImage(anchor3.href, 'PNG', ml - 10, mt + 80, 180, 90);

    // // Añadimos una cuarta página
    // doc.addPage('a4');
    // // logo de la empresa en la esquina superior derecha
    // await html2canvas(this.imagen.nativeElement).then(canvas => {
    //   doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    // });

    // doc.text(this.construirFecha(hoy), ml, mt);

    // // Cuarta gráfica
    // doc.text(
    //   'Coste del término de energía anual',
    //   ml + 85,
    //   mt + 20,
    //   null,
    //   null,
    //   'center'
    // );
    // doc.text(
    //   '__________________________________',
    //   ml + 85,
    //   mt + 20,
    //   null,
    //   null,
    //   'center'
    // );
    // const anchor4 = event.target;
    // const element4 = document.getElementsByTagName('canvas')[3];
    // anchor4.href = element4.toDataURL();
    // doc.addImage(anchor4.href, 'PNG', ml - 10, mt + 25, 180, 90);

    // const totalEPagadoIE = this.totalPagadoEnergia * impuestoElectrico;
    // const totalEAhorradoIE = this.totalOptimizadoEnergia * impuestoElectrico;
    // const totalEPagadoIVA = totalEPagadoIE * this.iva;
    // const totalEAhorradoIVA = totalEAhorradoIE * this.iva;

    // doc.autoTable({
    //   head: [
    //     [
    //       '',
    //       'Precio Energía',
    //       'Precio Energía\n(IE incluido)',
    //       'Precio Energía\n(IVA incluido)'
    //     ]
    //   ],
    //   body: [
    //     [
    //       'Actual',
    //       this.totalPagadoEnergia.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalEPagadoIE.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalEPagadoIVA.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       })
    //     ],
    //     [
    //       'Optimizado',
    //       this.totalOptimizadoEnergia.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalEAhorradoIE.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       totalEAhorradoIVA.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       })
    //     ],
    //     [
    //       'Diferencia',
    //       (
    //         this.totalPagadoEnergia - this.totalOptimizadoEnergia
    //       ).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       (totalEPagadoIE - totalEAhorradoIE).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       (totalEPagadoIVA - totalEAhorradoIVA).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR',
    //         maximumFractionDigits: 2
    //       })
    //     ]
    //   ],
    //   margin: { left: ml, top: mt + 125 },
    //   tableWidth: 170
    // });

    // Añadimos una cuarta página
    // doc.addPage('a4');
    // // logo de la empresa en la esquina superior derecha
    // await html2canvas(this.imagen.nativeElement).then(canvas => {
    //   doc.addImage(canvas.toDataURL(), 'JPEG', 170, 10, 20, 6);
    // });

    // doc.text(this.construirFecha(hoy), ml, mt);

    // // Quinta gráfica
    // doc.text('Factura Anual', ml + 85, mt + 20, null, null, 'center');
    // doc.text('_____________', ml + 85, mt + 20, null, null, 'center');
    // const anchor5 = event.target;
    // const element5 = document.getElementsByTagName('canvas')[5];
    // anchor5.href = element5.toDataURL();
    // doc.addImage(anchor5.href, 'PNG', ml - 10, mt + 25, 180, 90);

    // // const sumaTotalPagadoIE = this.sumaTotalPagado * impuestoElectrico;
    // // const sumaTotalAhorradoIE = this.sumaTotalOptimizado * impuestoElectrico;
    // // const sumaTotalPagadoIVA = sumaTotalPagadoIE * this.iva;
    // // const sumaTotalAhorradoIVA = sumaTotalAhorradoIE * this.iva;

    // doc.autoTable({
    //   head: [
    //     [
    //       '',
    //       'Factura Total',
    //       'Factura Total\n(IE incluido)',
    //       'Factura Total\n(IVA incluido)'
    //     ]
    //   ],
    //   body: [
    //     [
    //       'Actual',
    //       this.sumaTotalPagado.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       sumaTotalPagadoIE.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       sumaTotalPagadoIVA.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       })
    //     ],
    //     [
    //       'Optimizado',
    //       this.sumaTotalOptimizado.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       sumaTotalAhorradoIE.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       sumaTotalAhorradoIVA.toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       })
    //     ],
    //     [
    //       'Ahorro',
    //       (this.sumaTotalPagado - this.sumaTotalOptimizado).toLocaleString(
    //         'es-ES',
    //         {
    //           style: 'currency',
    //           currency: 'EUR'
    //         }
    //       ),
    //       (sumaTotalPagadoIE - sumaTotalAhorradoIE).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR'
    //       }),
    //       (sumaTotalPagadoIVA - sumaTotalAhorradoIVA).toLocaleString('es-ES', {
    //         style: 'currency',
    //         currency: 'EUR',
    //         maximumFractionDigits: 2
    //       })
    //     ]
    //   ],
    //   margin: { left: ml, top: mt + 125 },
    //   tableWidth: 170
    // });

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

  aplicarDescuentoPotencia(valor: number) {
    valor = valor - (valor * this.formulario.descuentoPotencia) / 100;
    valor = this.redondear(valor);
    return valor;
  }

  aplicarDescuentoEnergia(valor: number) {
    valor = valor - (valor * this.formulario.descuentoEnergia) / 100;
    valor = this.redondear(valor);
    return valor;
  }

  redondear(valor: number) {
    valor = Math.round(valor * 100);
    return valor / 100;
  }

  construirFecha(fecha: Date) {
    let cadena: string = '';
    if (fecha.getDate() < 10) {
      cadena += '0' + fecha.getDate() + '/';
    } else {
      cadena += fecha.getDate() + '/';
    }
    if (fecha.getMonth() + 1 < 10) {
      cadena += '0' + (fecha.getMonth() + 1) + '/';
    } else {
      cadena += fecha.getMonth() + 1 + '/';
    }
    cadena += fecha.getFullYear();

    return cadena;
  }
}
