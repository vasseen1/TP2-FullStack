import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsDetail } from './artiste-detail';

describe('ArtistsDetail', () => {
  let component: ArtistsDetail;
  let fixture: ComponentFixture<ArtistsDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistsDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
