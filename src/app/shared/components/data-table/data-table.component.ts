import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSearchbar, IonButton, IonIcon, IonSelect, IonSelectOption, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { downloadOutline, documentTextOutline } from 'ionicons/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonLabel
  ],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  title = input<string>('Tabla de Datos');
  enableExport = input<boolean>(true);
  pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {
    addIcons({ downloadOutline, documentTextOutline });
  }

  filteredData = computed(() => {
    let result = [...this.data()];
    const term = this.searchTerm().toLowerCase();
    
    if (term) {
      result = result.filter(item => 
        this.columns().some(col => 
          String(item[col.key]).toLowerCase().includes(term)
        )
      );
    }

    if (this.sortColumn()) {
      result.sort((a, b) => {
        const aVal = a[this.sortColumn()];
        const bVal = b[this.sortColumn()];
        if (aVal < bVal) return this.sortDirection() === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredData().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredData().length / this.pageSize());
  });

  onSearchChange(event: any) {
    this.searchTerm.set(event.detail.value || '');
    this.currentPage.set(1);
  }

  onSort(columnKey: string) {
    if (this.sortColumn() === columnKey) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(columnKey);
      this.sortDirection.set('asc');
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize.set(+event.detail.value);
    this.currentPage.set(1);
  }

  exportCSV() {
    const headers = this.columns().map(c => c.label).join(',');
    const rows = this.filteredData().map(item => 
      this.columns().map(c => {
        const val = item[c.key];
        return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
      }).join(',')
    ).join('\n');
    
    const csv = headers + '\n' + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.title().replace(/\s+/g, '_')}_${Date.now()}.csv`;
    link.click();
  }

  exportPDF() {
    const doc = new jsPDF();
    doc.text(this.title(), 14, 15);
    
    const headers = [this.columns().map(c => c.label)];
    const rows = this.filteredData().map(item => 
      this.columns().map(c => String(item[c.key] || ''))
    );

    autoTable(doc, {
      head: headers,
      body: rows,
      startY: 25,
      styles: { fontSize: 8 }
    });

    doc.save(`${this.title().replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  }
}
