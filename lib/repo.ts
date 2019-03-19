import { Entity } from "./entity";
import { Collection } from 'mongodb';
import { EntityWithoutGetters } from "./EntityWithoutGetters";

export class Repository<T extends Entity> {
    constructor(public collection: Collection<Partial<EntityWithoutGetters<T>>>) { }
    saveOrUpdateOne(entity: Partial<EntityWithoutGetters<T>>) {
        this.collection.updateOne({ _id: (entity as T)._id }, { $set: entity }, { upsert: true });
    }

    saveOrUpdateMany(entities: Partial<EntityWithoutGetters<T>>[]) {
        this.collection.updateMany({}, { $set: entities }, { upsert: true });
    }

    findMany(query?: Partial<T>): Promise<T[]> {
        return this.collection.find<T>(query || {}).toArray();
    }
    
    findOne(query?: Partial<T>): Promise<T> {
        return this.collection.findOne<T>(query || {});
    }
}