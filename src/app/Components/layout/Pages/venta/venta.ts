// src/app/Components/layout/Pages/usuario/usuario.ts
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';

// Formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

// Material & CDK
import { MatCardModule, MatCardContent } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

// Servicios / componentes
import { ProductoService } from '../../../../Services/producto';
import { VentaService } from '../../../../Services/venta';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

//Interfaces
import { Producto } from '../../../../Interfaces/producto';
import { Venta } from '../../../../Interfaces/venta';
import { DetalleVenta } from '../../../../Interfaces/detalle-venta';

// Utiles
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from "@angular/forms";
import { MatInputModule, MatInput } from '@angular/material/input';
import { response } from 'express';
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@Component({
  selector: 'app-venta',
  imports: [
    MatCardModule,
    MatCardContent,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatGridList,
    MatGridTile,
    MatInput,
    MatAutocompleteModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    NgForOf
],
  templateUrl: './venta.html',
  styleUrls: ['./venta.css']
})
export class VentaComponent implements OnInit {

  listaProductos:Producto[] = []; //Almacenamos todos los productos registrados en esta variable
  listaProductosFiltro:Producto[] = [];//Esta variable contendrá los filtros para el auto-comlpete

  listaProductosParaVenta:DetalleVenta[] = []; //Lista de productos para la venta
  bloquearBotonRegistrar:boolean = false;

  productoSeleccionado!:Producto; //El producto seleccionado temporalmente en la UI se guarda acá, y luego este pasará a listaProductosParaVenta
  tipoDePagoPorDefecto: string = "Efectivo"; //Tarjeta o efectivo
  totalPagar:number = 0;

  //Ingresar el producto y la cantidad para realizar la venta
  formularioProductoVenta:FormGroup;
  columnasTabla:string[] = ["producto", "cantidad", "precio", "total", "accion"];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  //Método para poder realizar la búsqueda por el nombre del producto
    //Recibimos una búsqueda de tipo any y devuelve un array de Producto
  retornarProductosPorFiltro(busqueda: any):Producto[]{
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();

    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ){

    this.formularioProductoVenta = this.fb.group({
      producto : ["", Validators.required],
      cantidad : ["", Validators.required]
    });

    //Obtener la lista de productos
  this._productoServicio.lista().subscribe({
    next: (data) => {
      if(data.status) {
        const lista = data.value as Producto[];
        this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
      }
    },
    error: (e) => {}
  })

  this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
    this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
  })

  }

  ngOnInit(): void {    
  }

  //Evento para mostrar el producto seleccionado
  mostrarProducto(producto:Producto): string{
    return producto.nombre;
  }

  //Evento para guardar temporalmente el producto seleccionado de la lista
  productoParaVenta(event: any){
    this.productoSeleccionado =  event.option.value;
  }

  //Método para registrar el producto elegido dentro de la tabla para realizar la venta
  agregarProductoParaVenta(){
    const _cantidad:number = this.formularioProductoVenta.value.cantidad; //Cantidad de los productos para la venta
    const _precio:number = parseFloat(this.productoSeleccionado.precio);
    const _total:number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosParaVenta.push({
      idProducto:this.productoSeleccionado.idProducto,
      descripcionProducto : this.productoSeleccionado.nombre,
      cantidad : _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto : String(_total.toFixed(2))
    })

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

    this.formularioProductoVenta.patchValue({
      producto: "",
      cantidad: ""
    })

  }

  //Método para eliminar un producto del listado
  eliminarProducto(detalle: DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto);
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(p => p.idProducto != detalle.idProducto);

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  //Método para poder registrar una venta
  registrarVenta(){

    if(this.listaProductosParaVenta.length > 0){
      this.bloquearBotonRegistrar = true; //Si pulsa el botón de bloquear, inmediatamente se deshabilitará al presionar 1 vez
      const request: Venta = {
        tipoPago : this.tipoDePagoPorDefecto,
        totalTexto : String(this.totalPagar.toFixed(2)),
        detalleVenta : this.listaProductosParaVenta
      }

      this._ventaServicio.registrar(request).subscribe({
        next : (response) =>{
          if(response.status){
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta: ${response.value.numeroDocumento}`
            })
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta", "Oops");
          }
        },
        complete:()=>{
          this.bloquearBotonRegistrar = false; //Ya no va a estar bloqueado
        },
        error:(e)=>{
          // console.log(e);
        }
      });

    }

  }

}
