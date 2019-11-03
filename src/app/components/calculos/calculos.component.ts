import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CalculosService } from '../../services/calculos.service';
import { HttpResponse } from '@angular/common/http';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Router } from '@angular/router';
import { map, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as $ from 'jquery';

@Component({
  selector: 'app-calculos',
  templateUrl: './calculos.component.html',
  styles: []
})
export class CalculosComponent implements OnInit {
  @ViewChild('to-pdf', { static: true }) element: ElementRef;
  @Input() formulario: any = {
    propietario: 'Usureros',
    tarifa: '2HA'
  };
  datos: any;
  costePagado: number[] = [];
  labels: Label[] = [];
  costeAhorrado: number[] = [];

  totalPagado: number = 0;
  totalAhorrado: number = 0;
  labelsTotal: Label[] = ['Total'];
  calculoTotal: ChartDataSets[] = [];

  costeTotal: ChartDataSets[] = [];

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
          return JSON.parse(data.body);
        })
      )
      .subscribe(
        (data: any) => {
          console.log('Datos pasados', this.formulario);
          console.log(data);

          this.datos = data.results;
          // tslint:disable-next-line: prefer-for-of
          for (let i = data.results[0].data.length - 1; i >= 0; i--) {
            // data.results[0].data[i].CUPS
            this.labels.push(
              this.construirLabel(data.results[0].data[i].fechaInicio) +
                ' - ' +
                this.construirLabel(data.results[0].data[i].fechaFin)
            );
            this.costeAhorrado.push(Math.floor(data.results[0].data[i].coste));
            this.totalAhorrado += Math.floor(data.results[0].data[i].coste);
          }
          // tslint:disable-next-line: prefer-for-of
          for (let i = data.results[1].data.length - 1; i >= 0; i--) {
            this.costePagado.push(Math.round(data.results[1].data[i].coste));
            this.totalPagado += Math.round(data.results[1].data[i].coste);
          }

          this.costeTotal = [
            { data: this.costePagado, label: 'Pagado' },
            { data: this.costeAhorrado, label: 'Ahorrado' }
          ];

          this.calculoTotal = [
            { data: [this.totalPagado], label: 'Total Pagado' },
            { data: [this.totalAhorrado], label: 'Total Ahorrado' }
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

  // GeneratePDF() {
  //   html2canvas(this.element.nativeElement, <Html2Canvas.Html2CanvasOptions>{
  //     onrendered: function(canvas: HTMLCanvasElement) {
  //       var pdf = new jsPDF('p', 'pt', 'a4');

  //       pdf.addHTML(canvas, function() {
  //         pdf.save('web.pdf');
  //       });
  //     }
  //   });
  // }

  exportarTablas() {
    // $('table').tableExport({
    //   headers: true, // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
    //   footers: true, // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
    //   formats: ['xlsx', 'csv', 'txt'], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
    //   filename: 'id', // (id, String), filename for the downloaded file, (default: 'id')
    //   bootstrap: true, // (Boolean), style buttons using bootstrap, (default: true)
    //   exportButtons: true, // (Boolean), automatically generate the built-in export
    // buttons for each of the specified formats (default: true)
    //   position: 'bottom', // (top, bottom), position of the caption element relative to table, (default: 'bottom')
    //   ignoreRows: null, // (Number, Number[]), row indices to exclude from the exported file(s) (default: null)
    //   ignoreCols: null, // (Number, Number[]), column indices to exclude from the exported file(s) (default: null)
    //   trimWhitespace: true, // (Boolean), remove all leading/trailing newlines,
    // spaces, and tabs from cell text in the exported file(s) (default: false)
    //   RTL: false // (Boolean), set direction of the worksheet to right-to-left (default: false)
    // });
  }

  exportarGrafico(event: any, index: number) {
    const anchor = event.target;

    const element = document.getElementsByTagName('canvas')[index];

    anchor.href = element.toDataURL();

    anchor.download = 'test.png';
  }

  exportarGraficos(event: any) {
    const anchor = event.target;
    const elementos = document.getElementsByTagName('canvas');

    let element = elementos[0];
    anchor.href = element.toDataURL();
    anchor.download = 'primero.png';

    element = elementos[1];
    const anchor2 = event.target;
    anchor2.href = element.toDataURL();
    anchor2.download = 'segundo.png';
  }

  generarPDF(event: any) {
    // html2canvas(document.querySelector('#todo')).then(canvas => {
    //   document.body.appendChild(canvas);
    // });
    // addHTML()
    // addFont()
    // addPage()
    // addMetaData()
    // const data = document.getElementById('todo');
    // console.log(data);
    // html2canvas(data).then(canvas => {
    //   // Few necessary setting options
    //   const imgWidth = 208;
    //   const pageHeight = 295;
    //   const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //   const heightLeft = imgHeight;
    //   const contentDataURL = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    //   const position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    //   pdf.addHTML(data);
    //   pdf.save('MYPdf.pdf'); // Generated PDF
    // });
    // const doc = new jsPDF();
    // const elementHTML = $('#todo').html();
    // console.log(elementHTML);
    // const specialElementHandlers = {
    //   // tslint:disable-next-line: object-literal-shorthand
    //   '#elementH': (element, renderer) => {
    //     return true;
    //   }
    // };
    // const margin = {
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   bottom: 0
    // };
    // doc.fromHTML(
    //   elementHTML,
    //   15,
    //   15,
    //   {
    //     width: 170,
    //     elementHandlers: specialElementHandlers
    //   },
    //   () => {
    //     doc.save('postres.pdf');
    //   },
    //   margin
    // );
  }
}
