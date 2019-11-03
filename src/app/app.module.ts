import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { CalculosService } from './services/calculos.service';
import { CalculosComponent } from './components/calculos/calculos.component';
import { GraficoDonutComponent } from './components/grafico-donut/grafico-donut.component';
import { GraficoComponent } from './components/grafico/grafico.component';
import { HomeComponent } from './components/home/home.component';
import { FormCalculoComponent } from './components/form-calculo/form-calculo.component';
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';

// Para poner sistema local de ESPAÑA
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    CalculosComponent,
    GraficoDonutComponent,
    GraficoComponent,
    HomeComponent,
    FormCalculoComponent,
    NgDropFilesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule
  ],
  providers: [CalculosService, { provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
