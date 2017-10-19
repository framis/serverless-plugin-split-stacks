'use-strict';

const _ = require('lodash');

module.exports = function migrateResources() {
  _.each(this.resourcesById, (resource, logicalId) => {
		const migration = this.constructor.stacksMap[resource.Type] || this.constructor.stacksMap['*'];
    if (migration) {

			const destination = (typeof migration.destination === 'function')
				? migration.destination(logicalId, resource, this.serverless)
				: migration.destination;
      if (!destination) return;

      const stackName = this.getStackName(destination, migration.allowSuffix);

      if (logicalId in this.resourceMigrations) {
        return;
      }

      this.migrate(logicalId, stackName);
    }
  });
};
