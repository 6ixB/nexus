export enum ClientRoute {
  // Auth
  AUTH_SIGNIN = '/auth/signin',
  AUTH_SIGNIN_INTERACTION = '/auth/signin/:interactionUid',
  AUTH_SIGNUP = '/auth/signup',

  // Public
  AUTH_ERROR = '/auth/error/:error',
  AUTH_SIGNOUT_SUCCESS = '/auth/signout/success',
  NOT_FOUND = '/not-found',

  // Protected
  HOME = '/',
  AUTH_SIGNOUT = '/auth/signout/:xsrf',

  // Static
  NEXT_STATIC = '/_next/*',
  NEXT_FAVICON = '/favicon.ico',
}

const clientRoutes = {
  auth: [
    ClientRoute.AUTH_SIGNIN,
    ClientRoute.AUTH_SIGNIN_INTERACTION,
    ClientRoute.AUTH_SIGNUP,
  ],
  protected: [ClientRoute.HOME, ClientRoute.AUTH_SIGNOUT],
  public: [
    ClientRoute.NOT_FOUND,
    ClientRoute.AUTH_ERROR,
    ClientRoute.AUTH_SIGNOUT_SUCCESS,
  ],
  nextStatic: [ClientRoute.NEXT_STATIC, ClientRoute.NEXT_FAVICON],
};

export default clientRoutes;
