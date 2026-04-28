import { CommonModule } from '@angular/common';
import { Component, model, output } from '@angular/core';

export type Periode = 'jour' | 'semaine' | 'mois' | 'annee';

@Component({
  selector: 'app-periode-selector-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './periode-selector-component.html',
  styleUrl: './periode-selector-component.css',
})
export class PeriodeSelectorComponent {




  periode = model.required<Periode>();
  onChange = output<Periode>();

  readonly periodes: { id: Periode; label: string }[] = [
    { id: 'jour', label: "Aujourd'hui" },
    { id: 'semaine', label: 'Cette semaine' },
    { id: 'mois', label: 'Ce mois' },
    { id: 'annee', label: 'Cette année' }
  ];

  selectPeriode(periode: Periode): void {
    this.periode.set(periode);
    this.onChange.emit(periode);
  }
}
