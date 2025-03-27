'use strict';

/**
 * user-detail router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/user-detail/login',
      handler: 'user-detail.login',
      config: {
        auth: false,
        policies: [],
      },
    },
    // Keep the default CRUD routes
    {
      method: 'GET',
      path: '/user-detail',
      handler: 'user-detail.find',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/user-detail/:id',
      handler: 'user-detail.findOne',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/user-detail',
      handler: 'user-detail.create',
      config: {
        policies: [],
      },
    },
    {
      method: 'PUT',
      path: '/user-detail/:id',
      handler: 'user-detail.update',
      config: {
        policies: [],
      },
    },
    {
      method: 'DELETE',
      path: '/user-detail/:id',
      handler: 'user-detail.delete',
      config: {
        policies: [],
      },
    },
  ],
};
