import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistesList } from './artistes-list';

describe('ArtistesList', () => {
  let component: ArtistesList;
  let fixture: ComponentFixture<ArtistesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
