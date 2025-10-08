import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstitutionService } from '../../services/institution.service';
import { Institution } from '../../models/institution.entity';
import { finalize } from 'rxjs/operators'; // NUEVO: Import para el operador finalize

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // NUEVO: Import para el spinner

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule // NUEVO: Añadido a los imports
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  institutionId: string = '';
  institution: Institution = {
    id: '', name: '', address: '', email: '',
    phone: '', logoUrl: '', createdAt: '', updatedAt: ''
  };

  isEditing = false;
  // MEJORA: Guardamos una copia del objeto original para la función "Cancelar".
  private originalInstitution!: Institution;

  // NUEVO: Estado para gestionar la carga del logo.
  isUploadingLogo = false;

  constructor(
    private route: ActivatedRoute,
    private institutionService: InstitutionService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.institutionId = localStorage.getItem('institutionId') ?? '';
    if (this.institutionId) {
      this.loadInstitution();
    } else {
      console.error('No se encontró el ID de la institución.');
      this.snack.open('Error: No se pudo identificar la institución.', 'Cerrar');
    }
  }

  private loadInstitution(): void {
    this.institutionService.getInstitutionById(this.institutionId).subscribe({
      next: (inst: Institution) => {
        this.institution = inst;
        this.originalInstitution = JSON.parse(JSON.stringify(inst));
      },
      error: (err: any) => console.error('Error loading institution', err)
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
    const { name, address, email, phone, logoUrl } = this.institution;
    const updatedData: Partial<Institution> = { name, address, email, phone, logoUrl };

    this.institutionService.updateInstitution(this.institutionId, updatedData).subscribe({
      next: (updatedInstitution) => {
        this.isEditing = false;
        this.institution = updatedInstitution;
        this.originalInstitution = JSON.parse(JSON.stringify(updatedInstitution));
        this.snack.open('Perfil actualizado con éxito', 'OK', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Error updating institution', err);
        this.snack.open('Error al actualizar el perfil.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // --- Validación básica del archivo (se mantiene) ---
    if (!file.type.startsWith('image/')) {
      this.snack.open('Error: El archivo debe ser una imagen.', 'Cerrar', { duration: 4000 });
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // Límite de 2MB
      this.snack.open('Error: La imagen no puede superar los 2MB.', 'Cerrar', { duration: 4000 });
      input.value = '';
      return;
    }

    // El FileReader es ahora la pieza central de nuestra simulación.
    const reader = new FileReader();

    // Cuando el reader termine de cargar el archivo...
    reader.onload = () => {
      // Obtenemos el resultado como una cadena Base64.
      const base64Image = reader.result as string;

      // Activamos el estado de carga
      this.isUploadingLogo = true;

      // Llamamos a nuestro servicio SIMULADO, pasándole la cadena Base64.
      this.institutionService.uploadLogo(this.institutionId, base64Image).pipe(
        finalize(() => {
          this.isUploadingLogo = false;
          input.value = '';
        })
      ).subscribe({
        next: (response) => {
          // El 'response.url' ahora contiene nuestra cadena Base64.
          this.institution.logoUrl = response.url;

          // Llamamos a onSave() para que esta cadena Base64 se guarde en el db.json.
          this.onSave();

          this.snack.open('Logo simulado y perfil guardado.', 'OK', { duration: 3000 });
        },
        error: (err) => {
          // Aunque es una simulación, mantenemos el manejo de errores por si algo fallara.
          console.error('Error en la simulación de subida', err);
          this.snack.open('Ocurrió un error en la simulación.', 'Cerrar', { duration: 5000 });
          this.institution.logoUrl = this.originalInstitution.logoUrl;
        }
      });
    };

    // Le decimos al reader que empiece a leer el archivo.
    reader.readAsDataURL(file);
  }
}
