/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetcherComponent } from './fetcher.component';
import { HttpService } from 'src/app/services/constants/http-service';

describe('FetcherComponent', () => {
  let component: FetcherComponent;

  beforeEach(() => {
    const { build } = setup().default();
    component = build();
  });

  it('should call fetchDataFromContext() when ngOnInit() is called', () => {
    component.fetchDataFromContext = jasmine.createSpy();
    component.ngOnInit();
    expect(component.fetchDataFromContext).toHaveBeenCalled();
  });

  it('should not call fetchDataFromContext when initialFetchCompleted or refetchOnChanges are false ', () => {
    component.refetchOnChanges = false;
    component.initialFetchCompleted = false;
    component.fetchDataFromContext = jasmine.createSpy();
    component.ngOnChanges();
    expect(component.fetchDataFromContext).not.toHaveBeenCalled();
  });

  it('should call fetchDataFromContext when initialFetchCompleted and refetchOnChanges are both true ', () => {
    component.refetchOnChanges = true;
    component.initialFetchCompleted = true;
    component.fetchDataFromContext = jasmine.createSpy();
    component.ngOnChanges();
    expect(component.fetchDataFromContext).toHaveBeenCalled();
  });

  it('should return the loading variable when showLoader is called', () => {
    component.loading = 'someValue' as any;
    expect(component.showLoader()).toBe(component.loading);
  });

  it('should show the success component when not loading and the data is not null when showSuccessComponent is called', () => {
    component.loading = false;
    component.response = { data: {}, code: 200 };
    expect(component.showSuccessComponent()).toBe(true);
  });

  it('should show the failure component when not loading and the error is not null when showFailureComponent is called', () => {
    component.loading = false;
    component.response = { error: { message: 'some message' }, code: 500 };
    expect(component.showFailureComponent()).toBe(true);
  });

  it('should call fetch, format the error and then set it to the state error variable when fetchDataFromContext returns an error', async () => {
    component.fetch = async () => {
      return {
        code: 500,
        error: { message: 'my bad error message :(' },
      };
    };
    await component.fetchDataFromContext();
    expect(component.error.code).toBe(500);
  });

  it('should call fetch, format the error and then set it to the state error variable when fetchDataFromContext throws an error', async () => {
    component.fetch = null; // this will cause error
    await component.fetchDataFromContext();
    expect(component.error.code).toBe(500);
  });

  it('should call fetch, format the response and emit it when fetchDataFromContext is called', async () => {
    const expectedData = { dataProperty: 'someData' };
    component.fetch = async () => {
      return {
        code: 200,
        data: expectedData,
      };
    };
    component.onFetchResponse = { emit: jasmine.createSpy() } as any;
    await component.fetchDataFromContext();
    expect(component.onFetchResponse.emit).toHaveBeenCalledWith(expectedData);
  });
});

function setup() {
  const http = new HttpService();
  const builder = {
    http,
    default() {
      return builder;
    },
    build() {
      return new FetcherComponent(http);
    },
  };
  return builder;
}
