import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../services/producto.service';
import { Producto } from '../models/producto.model';
import { ProductoValidators } from '../validators/producto.validators';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productoForm: FormGroup;
  productos: Producto[] = [];
  displayedColumns: string[] = ['codigo', 'nombre', 'costo', 'precio', 'valor', 'acciones'];
  editingProducto: Producto | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', [Validators.required, ProductoValidators.codigoFormato()]],
      nombre: ['', [Validators.required, ProductoValidators.nombreMinimo()]],
      costo: ['', [Validators.required, ProductoValidators.costoMayorCero()]],
      precio: ['', [Validators.required, ProductoValidators.precioRango()]],
      valor: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.isLoading = true;
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const productoData = this.productoForm.value;
    this.isLoading = true;

    if (this.editingProducto) {
      // Actualizar producto existente
      const updatedProducto = { ...productoData, id: this.editingProducto.id };
      this.productoService.updateProducto(updatedProducto).subscribe({
        next: () => {
          this.loadProductos();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al actualizar producto:', err);
          this.isLoading = false;
        }
      });
    } else {
      // Crear nuevo producto
      this.productoService.addProducto(productoData).subscribe({
        next: () => {
          this.loadProductos();
          this.resetForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al agregar producto:', err);
          this.isLoading = false;
        }
      });
    }
  }

  editProducto(producto: Producto): void {
    this.editingProducto = producto;
    this.productoForm.patchValue({
      codigo: producto.codigo,
      nombre: producto.nombre,
      costo: producto.costo,
      precio: producto.precio,
      valor: producto.valor
    });
  }

  deleteProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.isLoading = true;
      this.productoService.deleteProducto(id).subscribe({
        next: () => {
          this.loadProductos();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.productoForm.reset();
    this.editingProducto = null;
  }

  getErrorMessage(field: string): string {
    const control = this.productoForm.get(field);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `El campo ${field} es requerido.`;
    }
    if (control.errors['precioFueraRango']) {
      return control.errors['precioFueraRango'];
    }
    if (control.errors['codigoInvalido']) {
      return control.errors['codigoInvalido'];
    }
    if (control.errors['nombreCorto']) {
      return control.errors['nombreCorto'];
    }
    if (control.errors['costoInvalido']) {
      return control.errors['costoInvalido'];
    }
    if (control.errors['min']) {
      return `El valor debe ser mayor o igual a ${control.errors['min'].min}.`;
    }

    return '';
  }

  hasError(field: string): boolean {
    const control = this.productoForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
