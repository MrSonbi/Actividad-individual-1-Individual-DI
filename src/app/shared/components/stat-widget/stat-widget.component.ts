import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { statsChartOutline, peopleOutline, bagOutline, trendingUpOutline } from 'ionicons/icons';

@Component({
  selector: 'app-stat-widget',
  standalone: true,
  imports: [CommonModule, IonCard, IonCardContent, IonIcon],
  templateUrl: './stat-widget.component.html',
  styleUrls: ['./stat-widget.component.scss']
})
export class StatWidgetComponent {
  title = input.required<string>();
  value = input.required<number | string>();
  icon = input<string>('stats-chart-outline');
  color = input<string>('primary');
  trend = input<number | undefined>(undefined);

  constructor() {
    addIcons({ statsChartOutline, peopleOutline, bagOutline, trendingUpOutline });
  }
}
