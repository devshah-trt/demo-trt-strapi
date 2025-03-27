'use strict';

/**
 * user-detail controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-detail.user-detail', ({ strapi }) => ({
  async login(ctx) {
    try {
      const { identifier, password } = ctx.request.body;
      console.log('Login attempt with identifier:', identifier);
      console.log('Request body:', ctx.request.body);

      if (!identifier || !password) {
        return ctx.badRequest('Please provide both identifier and password');
      }

      // First, let's check if the user exists in the default users collection
      console.log('Looking for user in users-permissions collection');
      const defaultUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: {
          email: identifier.toLowerCase()
        }
      });
      console.log('Default user found:', defaultUser ? 'Yes' : 'No');

      // Then check if the user exists in the custom user-detail collection
      console.log('Looking for user in user-detail collection');
      const customUser = await strapi.db.query('api::user-detail.user-detail').findOne({
        where: {
          email: identifier.toLowerCase()
        }
      });
      console.log('Custom user found:', customUser ? 'Yes' : 'No');
      if (customUser) {
        console.log('Custom user fields:', Object.keys(customUser));
      }

      // Decide which user to authenticate
      const user = defaultUser || customUser;

      if (!user) {
        console.log('No user found with identifier:', identifier);
        return ctx.badRequest('Invalid identifier or password');
      }

      // Validate password based on which user we found
      let validPassword = false;
      if (defaultUser) {
        // Use Strapi's password validation for default users
        validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
          password,
          defaultUser.password
        );
      } else if (customUser) {
        // For custom users, check if password field exists and matches
        console.log('Custom user password field exists:', customUser.hasOwnProperty('password'));
        validPassword = customUser.password === password;
      }

      console.log('Password valid:', validPassword ? 'Yes' : 'No');

      if (!validPassword) {
        return ctx.badRequest('Invalid identifier or password');
      }

      // Generate JWT token
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      console.log('Login successful for user:', user.email);

      // Return user info and token
      ctx.body = {
        jwt,
        user: {
          id: user.id,
          email: user.email,
          username: user.username || '',
          name: user.name || ''
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return ctx.badRequest(`An error occurred during login: ${error.message}`);
    }
  }
}));
