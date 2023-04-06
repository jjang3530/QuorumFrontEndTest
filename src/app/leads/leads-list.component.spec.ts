import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { LeadsActions } from './leads.actions';
import { LeadsListComponent } from './leads-list.component';
import { LeadsService } from './leads.service';

describe('LeadsListComponent', () => {
    let component: LeadsListComponent;
    let fixture: ComponentFixture<LeadsListComponent>;
    let store: Store;
    let leadsService: LeadsService;

    beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [LeadsListComponent],
    imports: [
        StoreModule.forRoot({})
    ],
    providers: [
        { provide: LeadsService, useValue: {} }
    ]
    }).compileComponents();
});

    beforeEach(() => {
        fixture = TestBed.createComponent(LeadsListComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch fetch action on init', () => {
        spyOn(store, 'select').and.returnValue(of([]));
        fixture.detectChanges();
        expect(store.dispatch).toHaveBeenCalledWith(LeadsActions.fetch());
    });

    it('should fetch and store potential duplicates for each lead', () => {
    const leads = [
        { lead_id: '1', first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
        { lead_id: '2', first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com' }
    ];
    spyOn(store, 'select').and.returnValue(of(leads));
    spyOn(component, 'fetchAndStorePotentialDuplicates');
    fixture.detectChanges();
    expect(component.fetchAndStorePotentialDuplicates).toHaveBeenCalledTimes(2);
    expect(component.fetchAndStorePotentialDuplicates).toHaveBeenCalledWith('1');
    expect(component.fetchAndStorePotentialDuplicates).toHaveBeenCalledWith('2');
    });

  it('should set potential duplicates', () => {
    const pdData = ['john.smith@example.com', 'john.smith2@example.com'];
    spyOn(leadsService, 'fetchPotentialDuplicates').and.returnValue(of(pdData));
    component.fetchAndStorePotentialDuplicates('1');
    expect(component.potentialDuplicates).toEqual([{ id: '1', data: pdData }]);
  });

  it('should remove potential duplicates if no data returned', () => {
    const pdData = undefined;
    component.potentialDuplicates.push({ id: '1', data: ['john.smith@example.com'] });
    spyOn(leadsService, 'fetchPotentialDuplicates').and.returnValue(of(pdData));
    component.fetchAndStorePotentialDuplicates('1');
    expect(component.potentialDuplicates).toEqual([]);
  });

  it('should update existing potential duplicates', () => {
    const pdData = ['john.smith2@example.com'];
    component.potentialDuplicates.push({ id: '1', data: ['john.smith@example.com'] });
    spyOn(leadsService, 'fetchPotentialDuplicates').and.returnValue(of(pdData));
    component.fetchAndStorePotentialDuplicates('1');
    expect(component.potentialDuplicates).toEqual([{ id: '1', data: pdData }]);
  });
}
);
