'use strict';

/**
 * user-activity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-activity.user-activity', ({ strapi }) => ({
  // Keep the default controllers
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { data } = ctx.request.body;
      
      console.log('Updating user activity with ID:', id);
      console.log('Update data:', data);
      
      // Check if the record exists
      const existingRecord = await strapi.db.query('api::user-activity.user-activity').findOne({
        where: { id: id }
      });
      
      if (!existingRecord) {
        console.log('Record not found, trying to find the latest activity');
        // If not found, get the latest activity
        const latestActivity = await strapi.db.query('api::user-activity.user-activity').findMany({
          orderBy: { createdAt: 'desc' },
          limit: 1,
        });
        
        if (latestActivity && latestActivity.length > 0) {
          console.log('Found latest activity:', latestActivity[0].id);
          // Update the latest activity instead
          const updatedActivity = await strapi.entityService.update('api::user-activity.user-activity', latestActivity[0].id, {
            data: data
          });
          
          return { data: updatedActivity };
        }
      }
      
      // If record exists, proceed with normal update
      const updatedActivity = await strapi.entityService.update('api::user-activity.user-activity', id, {
        data: data
      });
      
      return { data: updatedActivity };
    } catch (error) {
      console.error('Error updating activity:', error);
      ctx.throw(500, error);
    }
  }
}));
