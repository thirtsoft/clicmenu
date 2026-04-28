import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';


export type KpiCardColor = 'rose' | 'vert' | 'or' | 'bleu' | 'violet';
export type TrendDirection = 'up' | 'down' | 'stable';

@Component({
  selector: 'app-kpi-card-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-card-component.html',
  styleUrl: './kpi-card-component.css',
})
export class KpiCardComponent {

  protected readonly Math = Math;

  icon = input.required<string>();
  value = input.required<string>();
  label = input.required<string>();
  subvalue = input<string>();
  trend = input<string>();
  trendDirection = input<TrendDirection>('up');
  color = input<KpiCardColor>('rose');
}
