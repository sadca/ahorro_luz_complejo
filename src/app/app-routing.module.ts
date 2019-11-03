import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalculosComponent } from './components/calculos/calculos.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'calculos', component: CalculosComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
