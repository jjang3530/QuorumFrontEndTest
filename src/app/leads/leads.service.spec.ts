import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { LeadsService } from './leads.service';

describe('LeadsService', () => {
  let service: LeadsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [LeadsService]
    });
    service = TestBed.inject(LeadsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch leads list', () => {
    const expectedLeads = [{ lead_id: '1', name: 'John' }, { lead_id: '2', name: 'Jane' }];

    service.fetchLeadsList().subscribe(leads => {
      expect(leads).toEqual(expectedLeads);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/leads');
    expect(req.request.method).toBe('GET');
    req.flush(expectedLeads);
  });

  it('should fetch potential duplicates', () => {
    const leadId = '1';
    const expectedDuplicates = ['2', '3'];

    service.fetchPotentialDuplicates(leadId).subscribe(duplicates => {
      expect(duplicates).toEqual(expectedDuplicates);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/leads/${leadId}/potential-duplicates`);
    expect(req.request.method).toBe('GET');
    req.flush(expectedDuplicates);
  });

  it('should mark lead as duplicate', () => {
    const lead = { lead_id: '1', first_name: 'John', last_name: 'Doe', duplicate_of: null, source: '', email: '', cell_phone: '', home_phone: '' };
    const duplicateOfLeadId = '2';
    const expectedUpdatedLead = { lead_id: '1', name: 'John', duplicate_of: '2' };

    service.markLeadAsDuplicate(lead, duplicateOfLeadId).subscribe(updatedLead => {
      expect(updatedLead).toEqual(expectedUpdatedLead);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/leads/${lead.lead_id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expectedUpdatedLead);
    req.flush(expectedUpdatedLead);
  });

  it('should handle HTTP 500 errors', () => {
    const errorMessage = 'An error occurred on the server. Please try again later.';

    service.fetchLeadsList().subscribe(
      () => {},
      error => {
        expect(error).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('http://localhost:3000/api/leads');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle other errors', () => {
    const errorMessage = 'An error occurred. Please try again later.';

    service.fetchLeadsList().subscribe(
      () => {},
      error => {
        expect(error).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('http://localhost:3000/api/leads');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });
});
