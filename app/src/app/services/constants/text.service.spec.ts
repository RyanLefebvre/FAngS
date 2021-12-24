import { TestBed } from '@angular/core/testing';

import { TextService } from './text.service';

describe('TextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextService = TestBed.get(TextService);
    expect(service).toBeTruthy();
  });
});
