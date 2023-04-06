import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LeadsActions } from './leads.actions';
import { Lead } from './leads.model';
import { LeadsSelectors } from './leads.selectors';

@Component({
  selector: 'av-leads-list',
  template: `
    <div>
      <div *ngFor="let lead of leads$ | async">
        {{ lead | json }}
      </div>
    </div>
  `,
  styles: [`

  `]
})
export class LeadsListComponent {
  leads$: Observable<Lead[]>;

  constructor(private Store: Store) {
    this.leads$ = this.Store.select(LeadsSelectors.getLeadsList);
  }

  ngOnInit() {
    this.Store.dispatch(LeadsActions.fetch());
  }
}