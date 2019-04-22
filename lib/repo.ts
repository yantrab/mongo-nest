import { Entity } from "./entity";
import { Collection, Condition, FilterQuery as _FilterQuery } from 'mongodb';
import { EntityWithoutGetters } from "./EntityWithoutGetters";
export type FilterQuery<T> = _FilterQuery<T> | Condition2<T>;
export type Condition2<T> = {
    $and?: Array<FilterQuery<T> | T>;
    $or?: Array<FilterQuery<T> | T>;
    $not?: Array<FilterQuery<T> | T> | T;
};

export class Repository<T extends Entity> {
    constructor(public collection: Collection<Partial<EntityWithoutGetters<T>>>) { }

    saveOrUpdateOne(entity: Partial<EntityWithoutGetters<T>>) {
        return this.collection.updateOne({ _id: (entity as T)._id }, { $set: entity }, { upsert: true });
    }

    saveOrUpdateMany(entities: Partial<EntityWithoutGetters<T>>[]) {
        if (entities.length < 1000) {
            const bulkOperation = this.collection.initializeUnorderedBulkOp();
            for (const item of entities) {
                bulkOperation.find({ _id: (item as T)._id }).upsert().update(item);
            }
            return bulkOperation.execute();
        }

        return Promise.all(entities.map(item => this.saveOrUpdateOne(item)));
    }

    findMany(query?: FilterQuery<T>): Promise<T[]> {
        return this.collection.find<T>(query || {}).toArray();
    }

    findOne(query?: FilterQuery<T>): Promise<T> {
        return this.collection.findOne<T>(query || {});
    }
}