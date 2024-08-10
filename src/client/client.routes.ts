export enum ClientRoute {
  // Auth
  AUTH_SIGNIN = '/auth/signin',
  AUTH_SIGNUP = '/auth/signup',
  AUTH_ERROR = '/auth/error',

  // Protected
  HOME = '/',

  // Static
  NEXT_STATIC = '/_next/*',
  NEXT_FAVICON = '/favicon.ico',
}

const clientRoutes = {
  auth: [
    ClientRoute.AUTH_SIGNIN,
    ClientRoute.AUTH_SIGNUP,
    ClientRoute.AUTH_ERROR,
  ],
  protected: [ClientRoute.HOME],
  nextStatic: [ClientRoute.NEXT_STATIC, ClientRoute.NEXT_FAVICON],
};

export default clientRoutes;
