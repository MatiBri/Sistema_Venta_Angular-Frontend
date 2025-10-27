import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Formularios
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

// Material
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

import { ModalDetalleVenta } from '../../Modales/modal-detalle-venta/modal-detalle-venta';

import { Venta } from '../../../../Interfaces/venta';
import { VentaService } from '../../../../Services/venta';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

export const MY_DATA_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMMM YYYY' }
};

@Component({
  selector: 'app-historial-venta',
  standalone: true,
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
  templateUrl: './historial-venta.html',
  styleUrls: ['./historial-venta.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATA_FORMATS }
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda = [
    { value: 'fecha', descripcion: 'Por fechas' },
    { value: 'numero', descripcion: 'Numero venta' }
  ];

  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  datosListaVenta = new MatTableDataSource<Venta>([]);

  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: ['']
    });

    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(() => {
      this.formularioBusqueda.patchValue({ numero: '', fechaInicio: '', fechaFin: '' });
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLowerCase();
  }

  buscarVentas() {
    let _fechaInicio = '';
    let _fechaFin = '';

    if (this.formularioBusqueda.get('buscarPor')?.value === 'fecha') {
      const fi = this.formularioBusqueda.get('fechaInicio')?.value;
      const ff = this.formularioBusqueda.get('fechaFin')?.value;

      if (!fi || !ff) {
        this._utilidadServicio.mostrarAlerta('Debe ingresar ambas fechas', 'Oops!');
        return;
      }

      const mFi = moment(fi);
      const mFf = moment(ff);
      if (!mFi.isValid() || !mFf.isValid()) {
        this._utilidadServicio.mostrarAlerta('Formato de fecha inválido', 'Oops!');
        return;
      }

      _fechaInicio = mFi.format('DD/MM/YYYY');
      _fechaFin = mFf.format('DD/MM/YYYY');
    }

    this._ventaServicio.historial(
      this.formularioBusqueda.get('buscarPor')?.value,
      this.formularioBusqueda.get('numero')?.value,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if (data.status) {
          // actualizar .data (no reasignar todo el objeto)
          this.datosListaVenta.data = data.value as Venta[];
        } else {
          this._utilidadServicio.mostrarAlerta('No se encontraron datos', 'Oops!');
          this.datosListaVenta.data = [];
        }
      },
      error: (e) => { console.error(e); }
    });
  }

  verDetalleVenta(_venta: Venta) {
    this.dialog.open(ModalDetalleVenta, {
      data: _venta,
      disableClose: true,
      width: '700px'
    });
  }
}
