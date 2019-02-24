import { Entity } from "./entity";
import { Collection } from 'mongodb';
import { EntityWithoutGetters } from "./EntityWithoutGetters";

export class Repository<T extends Entity> {
    constructor(public collection: Collection<Partial<EntityWithoutGetters<T>>>) { }
    saveOrUpdate(entity: Partial<EntityWithoutGetters<T>>) {
        this.collection.updateOne({ _id: (entity as T)._id}, { $set: entity }, { upsert: true });
    }
}