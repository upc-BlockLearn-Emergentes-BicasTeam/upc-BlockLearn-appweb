import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

// Servicios y Modelos
import { InstitutionService } from '../../services/institution.service';
// CAMBIO: Usamos el nuevo modelo con IDs numéricos
import { Institution } from '../../models/institution.entity';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDividerModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // CAMBIO: institutionId ahora es un número
  institutionId: number = 0;
  // CAMBIO: Inicializamos el objeto con valores por defecto que coincidan con el modelo numérico
  institution: Institution = {
    id: 0, userId: 0, name: '', address: '', email: '',
    phone: '', logoUrl: ''
  };

  isEditing = false;
  private originalInstitution!: Institution;
  isUploadingLogo = false; // Mantenemos este estado para el feedback visual

  constructor(
    private route: ActivatedRoute,
    private institutionService: InstitutionService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    // CAMBIO: Convertimos el ID del localStorage a número
    this.institutionId = Number(localStorage.getItem('institutionId'));

    if (this.institutionId > 0) {
      this.loadInstitution();
    } else {
      console.error('No se encontró un ID de institución válido.');
      this.snack.open('Error: No se pudo identificar la institución.', 'Cerrar');
    }
  }

  private loadInstitution(): void {
    // CAMBIO: El servicio ahora espera un número
    this.institutionService.getInstitutionById(this.institutionId).subscribe({
      next: (inst: Institution) => {
        this.institution = inst;
        this.originalInstitution = JSON.parse(JSON.stringify(inst)); // Clonación profunda
      },
      error: (err: any) => {
        console.error('Error loading institution', err);
        this.snack.open(err.message || 'Error al cargar los datos de la institución.', 'Cerrar');
      }
    });
  }

  onChangeData(): void {
    this.isEditing = true;
  }

  onCancel(): void {
    this.isEditing = false;
    this.institution = JSON.parse(JSON.stringify(this.originalInstitution));
  }

  onSave(): void {
    // CAMBIO: Preparamos los datos para la actualización.
    // Omitimos 'id' y 'userId' ya que no se deben modificar.
    const { name, address, email, phone, logoUrl } = this.institution;
    const updatedData: Partial<Omit<Institution, 'id' | 'userId'>> = { name, address, email, phone, logoUrl };

    // CAMBIO: Llamamos al servicio con el ID numérico
    this.institutionService.updateInstitution(this.institutionId, updatedData).subscribe({
      next: (updatedInstitution) => {
        this.isEditing = false;
        this.institution = updatedInstitution;
        this.originalInstitution = JSON.parse(JSON.stringify(updatedInstitution));
        this.snack.open('Perfil actualizado con éxito', 'OK', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Error updating institution', err);
        this.snack.open(err.message || 'Error al actualizar el perfil.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.snack.open('Error: El archivo debe ser una imagen.', 'Cerrar');
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // Límite de 2MB
      this.snack.open('Error: La imagen no puede superar los 2MB.', 'Cerrar');
      return;
    }

    const reader = new FileReader();
    this.isUploadingLogo = true; // Mostramos el spinner

    reader.onload = () => {
      // Obtenemos la cadena Base64
      this.institution.logoUrl = reader.result as string;

      // CAMBIO: En lugar de llamar a un servicio 'uploadLogo', llamamos directamente a 'onSave'.
      // La API guardará el campo `logoUrl` actualizado junto con el resto de los datos.
      this.onSave();
    };

    reader.onloadend = () => {
      // Ocultamos el spinner cuando todo ha terminado (después de onSave)
      this.isUploadingLogo = false;
      input.value = ''; // Limpiamos el input para permitir seleccionar el mismo archivo de nuevo
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      this.snack.open('Error al procesar la imagen.', 'Cerrar');
      this.isUploadingLogo = false;
    };

    reader.readAsDataURL(file);
  }
}
