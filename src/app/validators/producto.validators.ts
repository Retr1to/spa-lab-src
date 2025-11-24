import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ProductoValidators {
  
  // Validador para precio: debe estar entre 10 y 100
  static precioRango(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      
      const precio = parseFloat(value);
      if (precio < 10 || precio > 100) {
        return { precioFueraRango: 'El precio está fuera de rango.' };
      }
      
      return null;
    };
  }

  // Validador para código: debe iniciar con letra seguida de números (ej: A001)
  static codigoFormato(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      
      const pattern = /^[A-Za-z][0-9]+$/;
      if (!pattern.test(value)) {
        return { codigoInvalido: 'El código debe iniciar con una letra seguida de números (ej: A001).' };
      }
      
      return null;
    };
  }

  // Validador para nombre: mínimo 5 caracteres
  static nombreMinimo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      
      if (value.trim().length < 5) {
        return { nombreCorto: 'El nombre del producto debe tener mínimo 5 caracteres.' };
      }
      
      return null;
    };
  }

  // Validador para costo: debe ser mayor a cero
  static costoMayorCero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      
      const costo = parseFloat(value);
      if (costo <= 0) {
        return { costoInvalido: 'Ingrese un costo válido.' };
      }
      
      return null;
    };
  }
}
