'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const jwt = app.middleware.jwt({app})
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/captcha', controller.util.captcha);
  router.get('/sendcode',controller.util.sendcode)
  router.post('/uploadfile',controller.util.uploadfile)

  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user;

    router.post('/register', register);
    router.post('/login', login);
    router.get('/info', jwt,info);
    router.get('/verify', verify);
  });
};
