export enum ClientRoutes {
  AUTH_SIGNIN = '/auth/signin',
  AUTH_SIGNUP = '/auth/signup',
  AUTH_ERROR = '/auth/error',
  HOME = '',
  NEXT_STATIC = '/_next/*',
  FAVICON = '/favicon.ico',
}

const routes = {
  auth: [
    ClientRoutes.AUTH_SIGNIN,
    ClientRoutes.AUTH_SIGNUP,
    ClientRoutes.AUTH_ERROR,
  ],
  protected: [ClientRoutes.HOME],
  nextStatic: [ClientRoutes.NEXT_STATIC, ClientRoutes.FAVICON],
};

export default routes;
