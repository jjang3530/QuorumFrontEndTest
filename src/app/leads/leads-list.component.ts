import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable, of } from 'rxjs';
import { LeadsActions } from './leads.actions';
import { Lead } from './leads.model';
import { LeadsSelectors } from './leads.selectors';
import { LeadsService } from './leads.service';
import { filter, map, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'av-leads-list',
  templateUrl: './leads-list.component.html',
  styleUrls: [`./leads-list.component.scss`],
  providers: [LeadsService]
})

export class LeadsListComponent {
  leads$: Observable<Lead[]>;
  displayedColumns = ['no', 'duplicate_of', 'potential_duplicates', 'first_name', 'last_name', 'email', 'source', 'home_phone', 'cell_phone'];
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
    const index = this.potentialDuplicates.findIndex(item => item.id === lead_id);
    if (index !== -1) {
      // If there is existing data, update the potentialDuplicates array using that data.
      const pdData = this.potentialDuplicates[index].data;
      if (!pdData) {
        this.potentialDuplicates.splice(index, 1);
      }
    } else {
      // If there is no existing data, fetch it from the database and update the potentialDuplicates array.
      this.leadsService.fetchPotentialDuplicates(lead_id).subscribe(pdData => {
        if (pdData) {
          this.potentialDuplicates.push({ id: lead_id, data: pdData });
        }
      });
    }
  }

  setDuplicateOf(id: string, data: string) {
    const index = this.potentialDuplicates.findIndex(item => item.id === id);
    if (index !== -1) {
      const potentialDuplicate = this.potentialDuplicates[index];
      if (potentialDuplicate.data) {
        const dataIndex = potentialDuplicate.data.indexOf(data);
        if (dataIndex !== -1) {
          potentialDuplicate.data.splice(dataIndex, 1);
          this.updateLeadsState(id, data);
          const message = `${id} has been moved to actual duplicate`;
          window.alert(message);
        }
      }
    }
  }

  updateLeadsState(id: string, data: string) {
    this.leads$.pipe(
      take(1), 
      map(leads => {
        const index = leads.findIndex(lead => lead.lead_id === id);
        if (index !== -1) {
          const updatedLead = { ...leads[index], duplicate_of: data };
          const updatedLeads = [...leads];
          updatedLeads[index] = updatedLead;
          return updatedLead;
        }
        return null;
      }),
      filter(updatedLead => !!updatedLead),
      switchMap(updatedLead => {
        if (updatedLead) {
          this.store.dispatch(LeadsActions.updateLead({ lead: updatedLead }));
          return of(updatedLead);
        } else {
          return EMPTY;
        }
      })
    ).subscribe();
  }
  
}


