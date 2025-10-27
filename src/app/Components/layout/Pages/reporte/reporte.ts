import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

import moment from 'moment';

import * as XLSX from "xlsx";

import { Reporte } from '../../../../Interfaces/reporte';

import { VentaService } from '../../../../Services/venta';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

export const MY_DATA_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMMM YYYY' }
};

@Component({
  selector: 'app-reporte',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './reporte.html',
  styleUrls: ['./reporte.css'],
  providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class ReporteComponent implements OnInit {

  formularioFiltro: FormGroup;
  listaVentasReporte: Reporte[] = [];
  columnasTabla: string[] = ["fechaRegistro", "numeroVenta", "tipoPago", "total", "producto", "cantidad", "precio", "totalProducto"];
  dataVentaReporte = new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;


  constructor(
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla;
  }

  buscarVentas(){

    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');

    if(_fechaInicio === "invalid date" || _fechaFin === "invalid date"){
      this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops!")
      return;
    }

    this._ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) =>{
        if(data.status){
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        }else{
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        }
      },
      error: (e) => {}
    })
  }

  exportarExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "Reporte Ventas.xlsx");
  }
}
