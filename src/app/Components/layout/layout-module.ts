import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing-module';

import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario';
import { ProductoComponent } from './Pages/producto/producto';
import { VentaComponent } from './Pages/venta/venta';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta';
import { ReporteComponent } from './Pages/reporte/reporte';
import { SharedModule } from '../../Reutilizable/shared/shared-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent,

    SharedModule
  ],
  exports: [
    DashBoardComponent,
    UsuarioComponent,
    ProductoComponent,
    VentaComponent,
    HistorialVentaComponent,
    ReporteComponent
  ]
})
export class LayoutModule { }
