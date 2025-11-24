import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productos: Producto[] = [
    { id: 1, codigo: 'A001', nombre: 'Laptop HP', costo: 500, precio: 75, valor: 750 },
    { id: 2, codigo: 'B002', nombre: 'Mouse Logitech', costo: 8, precio: 15, valor: 25 },
    { id: 3, codigo: 'C003', nombre: 'Teclado Mecánico', costo: 30, precio: 55, valor: 85 }
  ];
  private nextId = 4;

  constructor() {
    // Cargar productos desde localStorage si existen
    const stored = localStorage.getItem('productos');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.productos = parsed.productos;
      this.nextId = parsed.nextId;
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('productos', JSON.stringify({
      productos: this.productos,
      nextId: this.nextId
    }));
  }

  getProductos(): Observable<Producto[]> {
    return of([...this.productos]).pipe(delay(300));
  }

  getProducto(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto ? { ...producto } : undefined).pipe(delay(300));
  }

  addProducto(producto: Producto): Observable<Producto> {
    const newProducto = { ...producto, id: this.nextId++ };
    this.productos.push(newProducto);
    this.saveToStorage();
    return of(newProducto).pipe(delay(300));
  }

  updateProducto(producto: Producto): Observable<Producto> {
    const index = this.productos.findIndex(p => p.id === producto.id);
    if (index !== -1) {
      this.productos[index] = { ...producto };
      this.saveToStorage();
      return of(this.productos[index]).pipe(delay(300));
    }
    throw new Error('Producto no encontrado');
  }

  deleteProducto(id: number): Observable<boolean> {
    const index = this.productos.findIndex(p => p.id === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
      this.saveToStorage();
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }
}
