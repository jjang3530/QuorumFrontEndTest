import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { Lead } from './leads.model';

@Injectable()
export class LeadsService {
  // STUB: Replace this with your own method that calls the API running on localhost:3000
  fetchLeadsList() {
    return observableOf([]) as Observable<Lead[]>;
  }

  // STUB: Replace this with your own method that calls the API running on localhost:3000
  fetchPotentialDuplicates(lead_id: string) {
    return observableOf([]) as Observable<string[]>;
  }

  // STUB: Replace this with your own method that calls the API running on localhost:3000
  markLeadAsDuplicate(lead: Lead, duplicate_of_lead_id: string) {
    return observableOf({}) as Observable<Lead>;
  }
}