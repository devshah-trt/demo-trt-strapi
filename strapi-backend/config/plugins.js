module.exports = () => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      jwtSecret: 'your-jwt-secret',
    },
  },
});
