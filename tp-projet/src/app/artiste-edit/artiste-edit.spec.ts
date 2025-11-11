import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtisteEdit } from './artiste-edit';

describe('ArtisteEdit', () => {
  let component: ArtisteEdit;
  let fixture: ComponentFixture<ArtisteEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtisteEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtisteEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
