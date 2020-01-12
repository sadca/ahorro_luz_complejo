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
  labelsPotencia: Label[] = [];
  labelsTotalPotencia: Label[] = ['Total'];

  costePagadoPotencia: number[] = [];
  costeOptimizadoPotencia: number[] = [];

  totalPagadoPotencia: number = 0;
  totalOptimizadoPotencia: number = 0;

  calculoTotalPotencia: ChartDataSets[] = [];
  costeTotalPotencia: ChartDataSets[] = [];

  labelsEnergia: Label[] = [];
  labelsTotalEnergia: Label[] = ['Total'];

  costePagadoEnergiaMensual: number[] = [];
  costePagadoEnergiaE1: number[] = [];
  costePagadoEnergiaE2: number[] = [];
  costePagadoEnergiaE3: number[] = [];
  costePagadoEnergiaE4: number[] = [];
  costePagadoEnergiaE5: number[] = [];
  costePagadoEnergiaE6: number[] = [];
  costeOptimizadoEnergiaMensual: number[] = [];
  costeOptimizadoEnergiaE1: number[] = [];
  costeOptimizadoEnergiaE2: number[] = [];
  costeOptimizadoEnergiaE3: number[] = [];
  costeOptimizadoEnergiaE4: number[] = [];
  costeOptimizadoEnergiaE5: number[] = [];
  costeOptimizadoEnergiaE6: number[] = [];

  totalPagadoEnergia: number = 0;
  totalOptimizadoEnergia: number = 0;

  calculoTotalEnergia: ChartDataSets[] = [];
  costeTotalEnergia: ChartDataSets[] = [];
  costeTotalEnergiaE1: ChartDataSets[] = [];
  costeTotalEnergiaE2: ChartDataSets[] = [];
  costeTotalEnergiaE3: ChartDataSets[] = [];

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
                  this.aplicarDescuento(data.results[1].data[i].coste)
                );
                this.totalPagadoPotencia += data.results[1].data[i].coste;
              } else {
                this.costePagadoPotencia.push(
                  this.aplicarDescuento(
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

          this.costeTotalPotencia = [
            { data: this.costePagadoPotencia, label: 'Pagado' },
            { data: this.costeOptimizadoPotencia, label: 'Optimizado' }
          ];

          const confEjeYPeriodos: any = [
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
          this.optionsGraficoPeriodos.scales.yAxes.push(confEjeYPeriodos);

          this.totalPagadoPotencia = this.aplicarDescuento(
            this.totalPagadoPotencia
          );
          this.totalOptimizadoPotencia = this.redondear(
            this.totalOptimizadoPotencia
          );

          this.calculoTotalPotencia = [
            {
              data: [this.totalPagadoPotencia],
              label: 'Total Pagado'
            },
            {
              data: [this.totalOptimizadoPotencia],
              label: 'Total Optimizado'
            }
          ];

          const confEjeY: any = [
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
          this.optionsGraficoTotal.scales.yAxes.push(confEjeY);

          if (data.results.length >= 3) {
            console.log(data.results[2]);
            for (let i = data.results[2].data.length - 1; i >= 0; i--) {
              this.labelsEnergia.push(
                this.construirLabel(data.results[2].data[i].fechaInicio) +
                  ' - ' +
                  this.construirLabel(data.results[2].data[i].fechaFin)
              );

              if (!this.esTarifa6x()) {
                this.costeOptimizadoEnergiaE1.push(
                  this.redondear(data.results[2].data[i].costeNuevo1)
                );
                this.costeOptimizadoEnergiaE2.push(
                  this.redondear(data.results[2].data[i].costeNuevo2)
                );
                this.costeOptimizadoEnergiaE3.push(
                  this.redondear(data.results[2].data[i].costeNuevo3)
                );
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

                this.costePagadoEnergiaE1.push(
                  this.redondear(data.results[2].data[i].costeActual1)
                );
                this.costePagadoEnergiaE2.push(
                  this.redondear(data.results[2].data[i].costeActual2)
                );
                this.costePagadoEnergiaE3.push(
                  this.redondear(data.results[2].data[i].costeActual3)
                );
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
              }
            }
          }

          this.costeTotalEnergia = [
            { data: this.costePagadoEnergiaMensual, label: 'Pagado' },
            { data: this.costeOptimizadoEnergiaMensual, label: 'Optimizado' }
          ];

          this.costeTotalEnergiaE1 = [
            { data: this.costePagadoEnergiaE1, label: 'Pagado' },
            { data: this.costeOptimizadoEnergiaE1, label: 'Optimizado' }
          ];

          this.costeTotalEnergiaE2 = [
            { data: this.costePagadoEnergiaE2, label: 'Pagado' },
            { data: this.costeOptimizadoEnergiaE2, label: 'Optimizado' }
          ];

          this.costeTotalEnergiaE3 = [
            { data: this.costePagadoEnergiaE3, label: 'Pagado' },
            { data: this.costeOptimizadoEnergiaE3, label: 'Optimizado' }
          ];

          this.totalPagadoEnergia = this.redondear(this.totalPagadoEnergia);
          this.totalOptimizadoEnergia = this.redondear(
            this.totalOptimizadoEnergia
          );
          this.calculoTotalEnergia = [
            {
              data: [this.totalPagadoEnergia],
              label: 'Total Pagado'
            },
            {
              data: [this.totalOptimizadoEnergia],
              label: 'Total Optimizado'
            }
          ];

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

    const totalPagadoIE = this.totalPagadoPotencia * impuestoElectrico;
    const totalAhorradoIE = this.totalOptimizadoPotencia * impuestoElectrico;
    const totalPagadoIVA = totalPagadoIE * this.iva;
    const totalAhorradoIVA = totalAhorradoIE * this.iva;

    doc.autoTable({
      head: [['', 'Precio', 'Precio IE', 'Precio IVA']],
      body: [
        [
          'Actual',
          this.totalPagadoPotencia.toLocaleString('es-ES', {
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
          this.totalOptimizadoPotencia.toLocaleString('es-ES', {
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
          (
            this.totalPagadoPotencia - this.totalOptimizadoPotencia
          ).toLocaleString('es-ES', {
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

    // Añadimos una tercera página
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

    doc.text('E1', ml + 85, mt + 20, null, null, 'center');
    // Tercera gráfica
    const anchor3 = event.target;
    const element3 = document.getElementsByTagName('canvas')[2];
    anchor3.href = element3.toDataURL();
    doc.addImage(anchor3.href, 'PNG', ml - 10, mt + 25, 180, 100);

    // Cuarta gráfica
    doc.text('E2', ml + 85, mt + 135, null, null, 'center');
    const anchor4 = event.target;
    const element4 = document.getElementsByTagName('canvas')[3];
    anchor4.href = element4.toDataURL();
    doc.addImage(anchor4.href, 'PNG', ml - 10, mt + 140, 180, 100);

    // Añadimos una cuarta página
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

    // Quinta gráfica
    doc.text('E3', ml + 85, mt + 20, null, null, 'center');
    const anchor5 = event.target;
    const element5 = document.getElementsByTagName('canvas')[4];
    anchor5.href = element5.toDataURL();
    doc.addImage(anchor5.href, 'PNG', ml - 10, mt + 25, 180, 100);

    // Añadimos una quinta página
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
    // Sexta gráfica
    doc.text('E Total', ml + 85, mt + 20, null, null, 'center');
    const anchor6 = event.target;
    const element6 = document.getElementsByTagName('canvas')[5];
    anchor6.href = element6.toDataURL();
    doc.addImage(anchor6.href, 'PNG', ml - 10, mt + 25, 180, 90);

    // Septima gráfica
    doc.text('E Total Anual', ml + 85, mt + 125, null, null, 'center');
    const anchor7 = event.target;
    const element7 = document.getElementsByTagName('canvas')[6];
    anchor7.href = element7.toDataURL();
    doc.addImage(anchor7.href, 'PNG', ml - 10, mt + 130, 180, 90);

    doc.autoTable({
      head: [['', 'Precio', 'Precio IE', 'Precio IVA']],
      body: [
        [
          'Actual',
          this.totalPagadoPotencia.toLocaleString('es-ES', {
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
          this.totalOptimizadoPotencia.toLocaleString('es-ES', {
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
          (
            this.totalPagadoPotencia - this.totalOptimizadoPotencia
          ).toLocaleString('es-ES', {
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
      margin: { left: ml, top: mt + 230 },
      tableWidth: 170
    });

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
