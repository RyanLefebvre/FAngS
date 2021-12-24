import { CallableContext } from 'firebase-functions/v1/https';
import {
  FORBIDDEN_CODE,
  GENERAL_ERROR_CODE,
  READ,
  SUCCESS_CODE_MAPPING,
  UNAUTHENTICATED_CODE,
} from '../../../../shared/constants/http';
import {
  authenticatedCloudFunction,
  authorizedCloudFunction,
  cloudFunction,
} from '../services/cloudfunction';

describe('CloudFunctions', () => {
  it('should return a success response if cloudFunction is called and no error happens', async () => {
    const response = await cloudFunction(() => null, READ)({}, null);
    expect(response.code).toBe(SUCCESS_CODE_MAPPING[READ]);
  });

  it('should return an error response if cloudFunction is called and an error happens', async () => {
    const response = await cloudFunction(null, READ)({}, null);
    expect(response.code).toBe(GENERAL_ERROR_CODE);
  });

  it('should return an error response if the authenticatedCloud function is called when not authenticated', async () => {
    const response = await authenticatedCloudFunction(async () => null, READ)(
      null,
      null
    );
    expect(response.code).toBe(UNAUTHENTICATED_CODE);
  });

  it('should return a success response if the authenticated cloudFunction is called when authenticated', async () => {
    const response = await cloudFunction(async () => null, READ)({}, {
      auth: { uid: 'someUid' },
    } as CallableContext);
    expect(response.code).toBe(SUCCESS_CODE_MAPPING[READ]);
  });

  it('should return an error response if the authorizedCloud function is called when not authorized', async () => {
    const response = await authorizedCloudFunction(
      async () => false,
      () => null,
      READ
    )({}, null);
    expect(response.code).toBe(FORBIDDEN_CODE);
  });

  it('should return a success response if the authenticated cloudFunction is called when authenticated', async () => {
    const response = await cloudFunction(async () => true, READ)({}, {
      auth: { uid: 'someUid' },
    } as CallableContext);
    expect(response.code).toBe(SUCCESS_CODE_MAPPING[READ]);
  });
});
