import { Component, OnInit, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styles: []
})
export class GraficoComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: { fontColor: 'black' }
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [
        {
          ticks: { fontColor: 'black' },
          gridLines: { color: 'rgba(0,0,0,0.1)' }
        }
      ],
      yAxes: [
        {
          ticks: { fontColor: 'black' },
          gridLines: { color: 'rgba(0,0,0,0.1)' }
        }
      ]
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
  @Input() barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  @Input() barChartData: ChartDataSets[] = [];
  public lineChartColors: Array<any> = [
    // {
    //   // grey
    //   backgroundColor: 'blue',
    //   borderColor: 'white',
    //   pointBackgroundColor: 'green',
    //   pointBorderColor: 'yellow',
    //   pointHoverBackgroundColor: 'purple',
    //   pointHoverBorderColor: 'brown'
    // },
    // {
    //   // dark grey
    //   backgroundColor: 'red',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    // {
    //   // grey
    //   backgroundColor: 'green',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // }
  ];

  constructor() {}

  ngOnInit() {}

  // events
  public chartClicked({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
