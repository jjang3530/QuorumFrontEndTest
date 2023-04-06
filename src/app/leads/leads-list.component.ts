import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LeadsActions } from './leads.actions';
import { Lead } from './leads.model';
import { LeadsSelectors } from './leads.selectors';
import { LeadsService } from './leads.service';

@Component({
  selector: 'av-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: [`./leads-list.component.scss`],
  providers: [LeadsService]
})

export class LeadsListComponent {
  leads$: Observable<Lead[]>;
  displayedColumns = ['lead_id', 'duplicate_of', 'potential_duplicates', 'first_name', 'last_name', 'email', 'source', 'home_phone', 'cell_phone'];
  potentialDuplicates: { id: string, data?: string[] | undefined }[] = [];

  constructor(private store: Store, private leadsService: LeadsService) {
    this.leads$ = this.store.select(LeadsSelectors.getLeadsList);
  }

  ngOnInit() {
    this.store.dispatch(LeadsActions.fetch());
    this.leads$.subscribe(leads => {
      for (const lead of leads) {
        this.fetchAndStorePotentialDuplicates(lead.lead_id);
      }
    });
  }

  fetchAndStorePotentialDuplicates(lead_id: string) {
    this.leadsService.fetchPotentialDuplicates(lead_id).subscribe(pdData => {
      const index = this.potentialDuplicates.findIndex(item => item.id === lead_id);
      if (pdData) {
        if (index === -1) {
          this.potentialDuplicates.push({ id: lead_id, data: pdData });
        } else {
          this.potentialDuplicates[index].data = pdData;
        }
      } else if (index !== -1) {
        this.potentialDuplicates.splice(index, 1);
      }
    });
  }

  setDuplicateOf(lead: Lead, duplicateId: string) {
    this.leadsService.markLeadAsDuplicate(lead, duplicateId);
  }
  
}


