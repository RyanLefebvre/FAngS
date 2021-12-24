import { NavBarRoute } from 'src/app/classes/route';

/**
 * Base path for the user module.
 */
export const USER_MODULE_BASE_ROUTE = 'user';

/**
 * Base path for the dashboard module.
 */
export const DASHBOARD_MODULE_BASE_ROUTE = 'dashboard';

/**
 * Base path for the authentication module.
 */
export const AUTHENTICATION_MODULE_BASE_ROUTE = 'auth';

/**
 * Base path for the home module.
 */
export const HOME_MODULE_BASE_ROUTE = '';

/**
 * Base path for the info module.
 */
export const INFO_MODULE_BASE_ROUTE = 'info';

/**
 * Base path for the error module.
 */
export const ERROR_MODULE_BASE_ROUTE = 'error';

/**
 * Path to the register page.
 */
export const REGISTER_PATH = 'register';

/**
 * Path to the sign in page.
 */
export const SIGN_IN_PATH = 'login';

/**
 * Path to the verify email page.
 */
export const VERIFY_EMAIL_PATH = 'verify';

/**
 * Path to the privacy policy page.
 */
export const PRIVACY_PATH = 'privacy';

/**
 * Path to the terms of service page.
 */
export const TERMS_PATH = 'terms';

/**
 * Path to the error page in the error module.
 */
export const ERROR_PAGE_PATH = '';

/**
 * Complete path to any of the routes in the application
 */
export const completePaths = {
  homepage: HOME_MODULE_BASE_ROUTE,
  dashboard: '/' + DASHBOARD_MODULE_BASE_ROUTE,
  profile: USER_MODULE_BASE_ROUTE,
  terms: INFO_MODULE_BASE_ROUTE + '/' + TERMS_PATH,
  privacy: INFO_MODULE_BASE_ROUTE + '/' + PRIVACY_PATH,
  register: AUTHENTICATION_MODULE_BASE_ROUTE + '/' + REGISTER_PATH,
  signIn: AUTHENTICATION_MODULE_BASE_ROUTE + '/' + SIGN_IN_PATH,
  verify: AUTHENTICATION_MODULE_BASE_ROUTE + '/' + VERIFY_EMAIL_PATH,
};

/**
 * Route for the home page.
 */
export const HOME_ROUTE: NavBarRoute = new NavBarRoute(
  'Home',
  completePaths.homepage,
  'home',
  false,
  true
);

/**
 * Route for the dashboard.
 */
export const DASHBOARD_ROUTE: NavBarRoute = new NavBarRoute(
  'Dashboard',
  completePaths.dashboard,
  'dashboard',
  true,
  false
);

/**
 * Route for the profile.
 */
export const PROFILE_ROUTE: NavBarRoute = new NavBarRoute(
  'Profile',
  completePaths.profile,
  'perm_identity',
  true,
  false
);

/**
 * Route for the register page.
 */
export const REGISTER_ROUTE: NavBarRoute = new NavBarRoute(
  ' Register',
  completePaths.register,
  'touch_app',
  false,
  true
);

/**
 * Route for the sign in page.
 */
export const SIGN_IN_ROUTE: NavBarRoute = new NavBarRoute(
  'Sign-In',
  completePaths.signIn,
  'perm_identity',
  false,
  true
);

/**
 * List that contains every route in the application.
 */
export const routes: NavBarRoute[] = [
  HOME_ROUTE,
  DASHBOARD_ROUTE,
  PROFILE_ROUTE,
  REGISTER_ROUTE,
  SIGN_IN_ROUTE,
];

export default routes;
