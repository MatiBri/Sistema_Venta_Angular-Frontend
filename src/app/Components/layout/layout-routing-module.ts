import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario';
import { ProductoComponent } from './Pages/producto/producto';
import { VentaComponent } from './Pages/venta/venta';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta';
import { ReporteComponent } from './Pages/reporte/reporte';

//Configuración de las rutas de las páginas, su redireccionamiento
const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [
    {path: 'dashboard', component: DashBoardComponent},
    {path: 'usuarios', component: UsuarioComponent},
    {path: 'productos', component: ProductoComponent},
    {path: 'venta', component: VentaComponent},
    {path: 'historial_venta', component: HistorialVentaComponent},
    {path: 'reportes', component: ReporteComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
