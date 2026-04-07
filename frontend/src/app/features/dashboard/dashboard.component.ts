import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AppContextService } from '../../core/services/context.service';

interface KpiCard {
  title: string;
  value: string;
  delta: string;
  detail: string;
}

interface TargetRow {
  module: string;
  target: number;
  achieved: number;
  pending: number;
  owner: string;
  trend: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AgGridAngular, NgApexchartsModule],
  template: `
    <section class="dashboard-page">
      <div class="page-intro">
        <div>
          <p class="eyebrow">Executive snapshot</p>
          <h1>{{ institute().name }} · {{ year() }}</h1>
          <p>
            IQAC/NAAC-aligned view of admissions, scholarship, staff attendance,
            receipts, and document readiness for the selected institute.
          </p>
        </div>

        <div class="hero-card">
          <span>Admission conversion</span>
          <strong>74%</strong>
          <small>21 website enquiries verified this week</small>
        </div>
      </div>

      <div class="kpi-grid">
        @for (card of kpis; track card.title) {
          <article class="kpi-card">
            <span>{{ card.title }}</span>
            <strong>{{ card.value }}</strong>
            <small>{{ card.delta }}</small>
            <p>{{ card.detail }}</p>
          </article>
        }
      </div>

      <div class="panel-grid">
        <article class="panel chart-panel">
          <div class="panel__header">
            <div>
              <h2>Performance trend</h2>
              <p>Admissions and receipts movement for the current academic year.</p>
            </div>
            <span class="tag">Live-ready</span>
          </div>

          <apx-chart
            [series]="chartOptions.series"
            [chart]="chartOptions.chart"
            [xaxis]="chartOptions.xaxis"
            [stroke]="chartOptions.stroke"
            [fill]="chartOptions.fill"
            [dataLabels]="chartOptions.dataLabels"
            [colors]="chartOptions.colors"
            [grid]="chartOptions.grid"
            [legend]="chartOptions.legend"
          ></apx-chart>
        </article>

        <article class="panel spotlight-panel">
          <div class="panel__header">
            <div>
              <h2>Target spotlight</h2>
              <p>Quick follow-up items for clerk and accountant teams.</p>
            </div>
          </div>

          <div class="spotlight-list">
            @for (item of spotlightRows; track item.module) {
              <button type="button" class="spotlight-item" (click)="showDetails(item)">
                <div>
                  <strong>{{ item.module }}</strong>
                  <small>{{ item.owner }}</small>
                </div>
                <span>{{ item.pending }} pending</span>
              </button>
            }
          </div>

          <div class="iqac-box">
            <h3>IQAC evidence readiness</h3>
            <ul>
              <li>Meeting minutes uploaded: <strong>9 / 12</strong></li>
              <li>Scholarship support evidence: <strong>82%</strong></li>
              <li>Student support registers: <strong>Current</strong></li>
            </ul>
          </div>
        </article>
      </div>

      <article class="panel">
        <div class="panel__header">
          <div>
            <h2>Target vs outcome workboard</h2>
            <p>AG Grid foundation for advanced filtering, export, and institute-wise reporting.</p>
          </div>
          <span class="tag tag--accent">AG Grid</span>
        </div>

        <ag-grid-angular
          class="ag-theme-quartz app-grid"
          [rowData]="rowData"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [pagination]="true"
          [paginationPageSize]="5"
          [animateRows]="true"
        ></ag-grid-angular>
      </article>

      <div class="metrics-strip">
        <article>
          <span>Super Admin Needs</span>
          <strong>18 approvals</strong>
          <small>including discounts, duplicate TC, and website publishes</small>
        </article>
        <article>
          <span>Scholarship Funnel</span>
          <strong>312 eligible</strong>
          <small>241 submitted · 71 yet to fill</small>
        </article>
        <article>
          <span>Account Progress</span>
          <strong>₹18.4L collected</strong>
          <small>student ledgers and dues statements ready for issue</small>
        </article>
      </div>

      @if (selectedRow(); as row) {
        <div class="detail-modal" (click)="closeDetails()">
          <div class="detail-modal__card" (click)="$event.stopPropagation()">
            <div class="panel__header">
              <div>
                <h2>{{ row.module }}</h2>
                <p>{{ row.owner }} · trend {{ row.trend }}</p>
              </div>
              <button type="button" class="ghost-btn" (click)="closeDetails()">Close</button>
            </div>

            <div class="detail-stats">
              <div>
                <span>Target</span>
                <strong>{{ row.target }}</strong>
              </div>
              <div>
                <span>Achieved</span>
                <strong>{{ row.achieved }}</strong>
              </div>
              <div>
                <span>Pending</span>
                <strong>{{ row.pending }}</strong>
              </div>
            </div>

            <ul class="detail-points">
              <li>Send WhatsApp reminder to remaining students/parents.</li>
              <li>Keep document checklist and certificate evidence export-ready.</li>
              <li>Review institute-specific header and QR validation before publishing.</li>
            </ul>
          </div>
        </div>
      }
    </section>
  `,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly context = inject(AppContextService);

  protected readonly institute = this.context.activeInstitute;
  protected readonly year = this.context.activeAcademicYear;

  protected readonly kpis: KpiCard[] = [
    {
      title: 'Admissions in pipeline',
      value: '186',
      delta: '+12% this month',
      detail: 'Website enquiries, walk-ins, and references combined.',
    },
    {
      title: 'Scholarship submissions',
      value: '241',
      delta: '71 pending',
      detail: 'Tracks caste-category wise scholarship and freeship progress.',
    },
    {
      title: 'Receipts issued',
      value: '1,482',
      delta: '₹18.4L collected',
      detail: 'A5 receipt print, QR verification, and student ledger ready.',
    },
    {
      title: 'Staff attendance',
      value: '93%',
      delta: '8 leave requests open',
      detail: 'Used for salary day calculations and monthly review.',
    },
  ];

  protected readonly columnDefs: ColDef<TargetRow>[] = [
    { field: 'module', headerName: 'Module' },
    { field: 'owner', headerName: 'Owner' },
    { field: 'target', headerName: 'Target' },
    { field: 'achieved', headerName: 'Achieved' },
    { field: 'pending', headerName: 'Pending' },
    { field: 'trend', headerName: 'Trend' },
  ];

  protected readonly defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    floatingFilter: true,
    resizable: true,
    flex: 1,
    minWidth: 120,
  };

  protected readonly rowData: TargetRow[] = [
    { module: 'Scholarship follow-up', target: 312, achieved: 241, pending: 71, owner: 'Clerk Desk', trend: 'Up' },
    { module: 'Admission conversion', target: 220, achieved: 163, pending: 57, owner: 'Admissions Team', trend: 'Up' },
    { module: 'Fee collection drive', target: 500, achieved: 428, pending: 72, owner: 'Account Office', trend: 'Stable' },
    { module: 'IQAC evidence filing', target: 90, achieved: 74, pending: 16, owner: 'Quality Cell', trend: 'Up' },
    { module: 'Staff attendance review', target: 120, achieved: 112, pending: 8, owner: 'Clerk HR Desk', trend: 'Stable' },
  ];

  protected readonly spotlightRows = this.rowData.slice(0, 3);

  protected readonly chartOptions: any = {
    series: [
      { name: 'Admissions', data: [32, 45, 51, 49, 58, 66] },
      { name: 'Collections', data: [24, 39, 44, 48, 56, 63] },
    ],
    chart: {
      type: 'area',
      height: 300,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    xaxis: { categories: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
    colors: ['#4f46e5', '#14b8a6'],
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.32, opacityTo: 0.06 },
    },
    grid: { strokeDashArray: 4 },
    legend: { position: 'top' },
  };

  protected readonly selectedRow = signal<TargetRow | null>(null);

  protected showDetails(row: TargetRow): void {
    this.selectedRow.set(row);
  }

  protected closeDetails(): void {
    this.selectedRow.set(null);
  }
}
