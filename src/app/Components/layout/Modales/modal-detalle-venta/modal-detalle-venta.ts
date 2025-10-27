import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';


@Component({
  selector: 'app-modal-detalle-venta',
  imports: [
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './modal-detalle-venta.html',
  styleUrls: ['./modal-detalle-venta.css']
})
export class ModalDetalleVenta implements OnInit {

  fechaRegistro: string = "";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string = "";
  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public _venta: Venta
  )
  {
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
  }

  ngOnInit(): void {
    
  }
}
