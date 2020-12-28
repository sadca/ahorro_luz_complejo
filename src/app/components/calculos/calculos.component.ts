import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CalculosService } from '../../services/calculos.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as jsPdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-calculos',
  templateUrl: './calculos.component.html',
  styles: [],
})
export class CalculosComponent implements OnInit {
  @Input() formulario: any = {
    propietario: 'Usureros',
    tarifa: '2HA',
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
    { default: false, valor: 'scatter', nombre: 'Dispersión' },
  ];

  public optGrafPerPot: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' },
        },
      ],
      yAxes: [],
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    },
  };
  public optGrafTotalPot: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' },
        },
      ],
      yAxes: [],
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    },
  };
  public optGrafPerEner: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' },
        },
      ],
      yAxes: [],
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    },
  };
  public optGrafTotalEner: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' },
        },
      ],
      yAxes: [],
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    },
  };
  public optGrafPerTotal: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' },
        },
      ],
      yAxes: [],
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    },
  };
  public optGrafTotal: ChartOptions = {
    responsive: true,
    showLines: false,
    legend: {
      labels: { fontColor: 'black' },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black', beginAtZero: false },
          gridLines: { color: 'rgba(0,0,0,0.1)' },
        },
      ],
      yAxes: [],
    },
    plugins: {
      datalabels: {
        // Altura
        anchor: 'end',
        align: 'end',
        color: 'black',
      },
    },
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
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.calculoServ
      .getCalculo(this.formulario)
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
                'No hemos podido calcular su factura, repita el proceso de nuevo, por favor',
            });
            return;
          }

          if (this.formulario.comparadorPrecios === true) {
            console.log('Data', data);
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
                data.results[0].data[i].costePotencia
              );

              this.totalPagadoPotencia += data.results[0].data[i].costePotencia;

              this.costePagadoEnergiaMensual.push(
                data.results[0].data[i].costeEnergia
              );

              this.totalPagadoEnergia += data.results[0].data[i].costeEnergia;

              this.sumaTotalPagado += this.redondear(
                data.results[0].data[i].coste
              );
            }

            for (let i = data.results[1].data.length - 1; i >= 0; i--) {
              this.costeOptimizadoPotencia.push(
                data.results[1].data[i].costePotencia
              );

              this.totalOptimizadoPotencia +=
                data.results[1].data[i].costePotencia;

              this.costeOptimizadoEnergiaMensual.push(
                data.results[1].data[i].costeEnergia
              );

              this.totalOptimizadoEnergia +=
                data.results[1].data[i].costeEnergia;

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
                    this.redondear(data.results[1].data[i].coste)
                  );
                  this.totalPagadoPotencia += data.results[1].data[i].coste;
                } else {
                  this.costePagadoPotencia.push(
                    this.redondear(
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
                    this.redondear(
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
                    this.redondear(
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
              label: 'Factura Optimizada',
            },
          ];

          let confEjeY: any = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min.apply(null, this.costeOptimizadoPotencia) / 2000
                  ) * 1000,
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' },
            },
          ];
          this.optGrafPerPot.scales.yAxes.push(confEjeY);

          this.totalPagadoPotencia = this.redondear(this.totalPagadoPotencia);
          this.totalOptimizadoPotencia = this.redondear(
            this.totalOptimizadoPotencia
          );

          this.calculoTotalPotencia = [
            {
              data: [this.totalPagadoPotencia],
              label: 'Factura anual actual',
            },
            {
              data: [this.totalOptimizadoPotencia],
              label: 'Factura anual optimizada',
            },
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
                  ) * 1000,
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' },
            },
          ];
          this.optGrafTotalPot.scales.yAxes.push(confEjeY);

          this.costeTotalEnergia = [
            { data: this.costePagadoEnergiaMensual, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoEnergiaMensual,
              label: 'Factura Optimizada',
            },
          ];

          confEjeY = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min.apply(null, this.costeOptimizadoEnergiaMensual) /
                      2000
                  ) * 1000,
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' },
            },
          ];

          this.totalPagadoEnergia = this.redondear(this.totalPagadoEnergia);
          this.totalOptimizadoEnergia = this.redondear(
            this.totalOptimizadoEnergia
          );
          this.calculoTotalEnergia = [
            {
              data: [this.totalPagadoEnergia],
              label: 'Factura anual actual',
            },
            {
              data: [this.totalOptimizadoEnergia],
              label: 'Factura anual optimizada',
            },
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
                  ) * 1000,
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' },
            },
          ];
          this.optGrafTotalEner.scales.yAxes.push(confEjeY);

          this.costeTotalPotencia = [
            { data: this.costePagadoPotencia, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoPotencia,
              label: 'Factura Optimizada',
            },
          ];

          this.costeTotalEnergia = [
            { data: this.costePagadoEnergiaMensual, label: 'Factura Actual' },
            {
              data: this.costeOptimizadoEnergiaMensual,
              label: 'Factura Optimizada',
            },
          ];

          this.sumaTotalPagado = 0;
          this.sumaTotalOptimizado = 0;
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
            this.sumaTotalPagado += this.redondear(
              this.costePagadoPotencia[i] + this.costePagadoEnergiaMensual[i]
            );
            this.sumaTotalOptimizado += this.redondear(
              this.costeOptimizadoPotencia[i] +
                this.costeOptimizadoEnergiaMensual[i]
            );
          }

          this.sumaTotalPeriodos = [
            { data: this.costePagadoConjunto, label: 'Factura Pagada' },
            { data: this.costeOptimizadoConjunto, label: 'Factura Calculada' },
          ];

          this.sumaTotal = [
            {
              data: [this.sumaTotalPagado],
              label: 'Total Pagado',
            },
            {
              data: [this.sumaTotalOptimizado],
              label: 'Total Optimizado',
            },
          ];

          confEjeY = [
            {
              ticks: {
                fontColor: 'black',
                min:
                  Math.round(
                    Math.min(this.sumaTotalPagado, this.sumaTotalOptimizado) /
                      2000
                  ) * 1000,
              },
              gridLines: { color: 'rgba(0,0,0,0.1)' },
            },
          ];
          this.optGrafTotal.scales.yAxes.push(confEjeY);

          Swal.close();
        },
        (err) => {
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
            footer: mensaje,
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

    doc.setFont('courier');
    doc.setFontSize(10);
    const hoy = new Date();
    doc.text(this.construirFecha(hoy), ml, mt + 5);

    doc.text('carlos.martinez@sadca.es', ml + 45, mt + 5);
    doc.text('www.sadca.es', ml + 110, mt + 5);

    // Titular
    doc.setFontStyle('bold');
    doc.text('Cliente:', ml, mt + 20);
    doc.setFontStyle('normal');
    doc.text(this.formulario.propietario, ml + 19, mt + 20);

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

    if (!this.esTarifa6x()) {
      doc.autoTable({
        head: [['', 'P1(€/kWh)', 'P2(€/kWh)', 'P3(€/kWh)']],
        body: [
          [
            'Actual',
            this.formulario.precioP1,
            this.formulario.precioP2,
            this.formulario.precioP3,
          ],
          [
            'Nueva',
            this.formulario.precioP1opt,
            this.formulario.precioP2opt,
            this.formulario.precioP3opt,
          ],
        ],
        startY: mt + 45,
        margin: { left: ml, top: mt + 45 },
        tableWidth: 170,
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
            'P6(€/kWh)',
          ],
        ],
        body: [
          [
            'Actual',
            this.formulario.precioP1,
            this.formulario.precioP2,
            this.formulario.precioP3,
            this.formulario.precioP4,
            this.formulario.precioP5,
            this.formulario.precioP6,
          ],
          [
            'Nueva',
            this.formulario.precioP1opt,
            this.formulario.precioP2opt,
            this.formulario.precioP3opt,
            this.formulario.precioP4opt,
            this.formulario.precioP5opt,
            this.formulario.precioP6opt,
          ],
        ],
        startY: mt + 45,
        margin: { left: ml, top: mt + 45 },
        tableWidth: 170,
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
              this.datos[2].data[0].precioEnergiaActual3,
            ],
            [
              'Nueva',
              this.datos[2].data[0].precioEnergiaNuevo1,
              this.datos[2].data[0].precioEnergiaNuevo2,
              this.datos[2].data[0].precioEnergiaNuevo3,
            ],
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170,
        });
      } else {
        doc.autoTable({
          head: [['', 'E1(€/kWh)', 'E2(€/kWh)', 'E3(€/kWh)']],
          body: [
            [
              'Actual',
              this.formulario.precioE1Actual,
              this.formulario.precioE2Actual,
              this.formulario.precioE3Actual,
            ],
            [
              'Nueva',
              this.formulario.precioE1Optimizada,
              this.formulario.precioE2Optimizada,
              this.formulario.precioE3Optimizada,
            ],
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170,
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
              'E6(€/kWh)',
            ],
          ],
          body: [
            [
              'Actual',
              this.datos[2].data[0].precioEnergiaActual1,
              this.datos[2].data[0].precioEnergiaActual2,
              this.datos[2].data[0].precioEnergiaActual3,
              this.datos[2].data[0].precioEnergiaActual4,
              this.datos[2].data[0].precioEnergiaActual5,
              this.datos[2].data[0].precioEnergiaActual6,
            ],
            [
              'Nueva',
              this.datos[2].data[0].precioEnergiaNuevo1,
              this.datos[2].data[0].precioEnergiaNuevo2,
              this.datos[2].data[0].precioEnergiaNuevo3,
              this.datos[2].data[0].precioEnergiaNuevo4,
              this.datos[2].data[0].precioEnergiaNuevo5,
              this.datos[2].data[0].precioEnergiaNuevo6,
            ],
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170,
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
              'E6(€/kWh)',
            ],
          ],
          body: [
            [
              'Actual',
              this.formulario.precioE1Actual,
              this.formulario.precioE2Actual,
              this.formulario.precioE3Actual,
              this.formulario.precioE4Actual,
              this.formulario.precioE5Actual,
              this.formulario.precioE6Actual,
            ],
            [
              'Nueva',
              this.formulario.precioE1Optimizada,
              this.formulario.precioE2Optimizada,
              this.formulario.precioE3Optimizada,
              this.formulario.precioE4Optimizada,
              this.formulario.precioE5Optimizada,
              this.formulario.precioE6Optimizada,
            ],
          ],
          startY: mt + 85,
          margin: { left: ml, top: mt + 85 },
          tableWidth: 170,
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
      head: [['', 'Factura Total\n(IE Incluido)', 'Factura Total\n(IVA incluido)']],
      body: [
        [
          'Actual',
          this.sumaTotalPagado.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }),
          sumaTotalPagadoIVA.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }),
        ],
        [
          'Optimizado',
          this.sumaTotalOptimizado.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }),
          sumaTotalAhorradoIVA.toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
          }),
        ],
        [
          'Ahorro',
          (this.sumaTotalPagado - this.sumaTotalOptimizado).toLocaleString(
            'es-ES',
            {
              style: 'currency',
              currency: 'EUR',
            }
          ),
          (sumaTotalPagadoIVA - sumaTotalAhorradoIVA).toLocaleString('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 2,
          }),
        ],
      ],
      startY: mt + 230,
      margin: { left: ml, top: mt + 230 },
      tableWidth: 170,
    });

    doc.setFontSize(7);
    const textoPrimerGrafico =
      // tslint:disable-next-line: max-line-length
      'El presente informe se ha realizado utilizando los datos de potencia y energía del ultimo año móvil, SADCA Energy no se hace responsable de que se alcance el ahorro estimado si hay cambios en el consumo, la potencia o el marco regulatorio. El contenido de este estudio es meramente informativo.';
    const textoCortado = doc.splitTextToSize(textoPrimerGrafico, 150);
    doc.text(textoCortado, ml, mt + 275, { maxWidth: 170, align: 'justify' });

    // logo de la empresa en la esquina superior derecha
    await html2canvas(this.imagen.nativeElement).then((canvas) => {
      doc.addImage(canvas.toDataURL(), 'JPEG', 180, 5, 20, 8);
    });

    // Nombre del archivo
    doc.save(`calculo-luz-${this.formulario.propietario}.pdf`);
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

  // aplicarDescuentoPotencia(valor: number) {
  //   valor = valor - (valor * this.formulario.descuentoPotencia) / 100;
  //   valor = this.redondear(valor);
  //   return valor;
  // }

  // aplicarDescuentoEnergia(valor: number) {
  //   valor = valor - (valor * this.formulario.descuentoEnergia) / 100;
  //   valor = this.redondear(valor);
  //   return valor;
  // }

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
