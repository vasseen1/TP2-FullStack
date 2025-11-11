import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisteForm } from './artiste-form';

describe('ArtisteForm', () => {
  let component: ArtisteForm;
  let fixture: ComponentFixture<ArtisteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtisteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtisteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
