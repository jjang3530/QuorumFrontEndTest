import { Injectable } from '@angular/core';
import { Observable, of as observableOf, of, throwError } from 'rxjs';
import { Lead } from './leads.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { LeadsActions } from './leads.actions';

@Injectable()
export class LeadsService {

  private baseUrl = 'http://localhost:3000/api/leads';
  constructor(private http: HttpClient, private store: Store) { }

  // STUB: Replace this with your own method that calls the API running on localhost:3000
  fetchLeadsList(): Observable<Lead[]> {
    return this.http.get<Lead[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // STUB: Replace this with your own method that calls the API running on localhost:3000
  fetchPotentialDuplicates(lead_id: string) {
    const url = `${this.baseUrl}/${lead_id}/potential-duplicates`;
    return this.http.get<string[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  // STUB: Replace this with your own method that calls the API running on localhost:3000
  markLeadAsDuplicate(lead: Lead, duplicate_of_lead_id: string): Observable<Lead> {
    const newDuplicateOf = lead.duplicate_of ? `${lead.duplicate_of}/${duplicate_of_lead_id}` : duplicate_of_lead_id;
    const updatedLead = {...lead, duplicate_of: newDuplicateOf};
    const url = `${this.baseUrl}/${lead.lead_id}`;
    return this.http.put<Lead>(url, updatedLead).pipe(
      catchError(this.handleError)
    );

  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 500) {
      // handle HTTP 500 errors
      return throwError('An error occurred on the server. Please try again later.');
    } else {
      // handle other errors
      return throwError('An error occurred. Please try again later.');
    }
  }
  
}