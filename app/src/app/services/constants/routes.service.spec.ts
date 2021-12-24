/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RoutesService } from './routes.service';
import { autoSpy } from 'autoSpy';

describe('RoutesService', () => {
  let service: RoutesService;

  beforeEach(() => {
    const { build } = setup().default();
    service = build();
  });

  it('should navigate to the passed in route with commands and extras when navigate is called', () => {
    const commands = ['someCommand'] as any;
    const extras = { someExtra: 'extra' } as any;
    service.navigate(commands, extras);
    expect(service.router.navigate).toHaveBeenCalledWith(commands, extras);
  });

  it('should get the query param with the key passed in when getQueryParam is called', () => {
    let whatWasGotten;
    service.activatedRoute = {
      snapshot: {
        queryParamMap: {
          get: (key) => (whatWasGotten = key),
        },
      },
    } as any;
    const key = 'someKey';
    service.getQueryParam(key);
    expect(whatWasGotten).toBe(key);
  });
});

function setup() {
  const router = autoSpy(Router);
  const activatedRoute = autoSpy(ActivatedRoute);
  const builder = {
    router,
    activatedRoute,
    default() {
      return builder;
    },
    build() {
      return new RoutesService(router, activatedRoute);
    },
  };

  return builder;
}
