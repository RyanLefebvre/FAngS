import { FormControlPair } from '../../classes/form-control-pair';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    service = setup().build();
  });

  it('should return an array of all the visbility form controls when getProfileVisibilityFormControls is called', () => {
    const formControls: FormControlPair[] =
      service.getProfileVisibilityFormControls();
    expect(formControls.includes(service.FORM_CONTROL_PROF_VIS_PUBLIC)).toBe(
      true
    );
    expect(formControls.includes(service.FORM_CONTROL_PROF_VIS_PRIVATE)).toBe(
      true
    );
  });
});

function setup() {
  const builder = {
    default() {
      return builder;
    },
    build() {
      return new ProfileService();
    },
  };
  return builder;
}
