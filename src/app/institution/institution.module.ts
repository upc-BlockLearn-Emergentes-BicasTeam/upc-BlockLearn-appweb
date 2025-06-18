// ya no es necesario, de hecho está deprecado
import { HttpClientModule } from '@angular/common/http';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InstitutionRoutingModule} from './institution-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,    // ← deprecado
    InstitutionRoutingModule
  ]
})
export class InstitutionModule {}
