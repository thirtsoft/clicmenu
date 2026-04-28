import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Boulangerie, BoulangerieFormData } from '../../../models/boulangerie.model';

@Component({
  selector: 'app-boulangerie-form-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boulangerie-form-component.html',
  styleUrl: './boulangerie-form-component.css',
})
export class BoulangerieFormComponent {

  boulangerie = input<Boulangerie | undefined>();

  onSave = output<BoulangerieFormData>();
  onCancel = output<void>();

  formData = signal<BoulangerieFormData>({
    nom: '',
    adresse: '',
    ville: 'Dakar',
    telephone: '',
    gerantNom: '',
    superficie: 0,
    objectifJour: 0
  });

  readonly villes = ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque', 'Thiès', 'Mbour'];

  constructor() {
    effect(() => {
      const b = this.boulangerie();
      if (b) {
        this.formData.set({
          nom: b.nom,
          adresse: b.adresse,
          ville: b.ville,
          telephone: b.telephone,
          gerantNom: b.gerantNom,
          superficie: b.superficie,
          objectifJour: b.objectifJour
        });
      } else {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.formData.set({
      nom: '',
      adresse: '',
      ville: 'Dakar',
      telephone: '',
      gerantNom: '',
      superficie: 0,
      objectifJour: 0
    });
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.onSave.emit(this.formData());
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  isFormValid(): boolean {
    const data = this.formData();
    return !!(data.nom && data.adresse && data.ville && data.gerantNom);
  }

  updateField<K extends keyof BoulangerieFormData>(field: K, value: BoulangerieFormData[K]): void {
    this.formData.update(data => ({ ...data, [field]: value }));
  }
}
