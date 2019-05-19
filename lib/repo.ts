import { Entity } from "./entity";
import { Collection, Condition, FilterQuery as _FilterQuery } from "mongodb";
import { EntityWithoutGetters } from "./EntityWithoutGetters";

export class Repository<T extends Entity> {
  constructor(
    public collection: Collection<Partial<EntityWithoutGetters<T>>>
  ) {}

  saveOrUpdateOne(entity: Partial<EntityWithoutGetters<T>>, query?) {
    return this.collection.updateOne(
      query || { _id: (entity as T)._id },
      { $set: entity },
      { upsert: true }
    );
  }

  saveOrUpdateMany(entities: Partial<EntityWithoutGetters<T>>[]) {
    if (entities.length < 1000) {
      const bulkOperation = this.collection.initializeUnorderedBulkOp();
      for (const item of entities) {
        bulkOperation
          .find({ _id: (item as T)._id })
          .upsert()
          .update({ $set: item });
      }
      return bulkOperation.execute();
    }

    return Promise.all(entities.map(item => this.saveOrUpdateOne(item)));
  }

  findMany(query?: Partial<T>): Promise<T[]> {
    return this.collection.find<T>(query || {}).toArray();
  }

  findOne(query?: Partial<T>): Promise<T> {
    return this.collection.findOne<T>(query || {});
  }
}
