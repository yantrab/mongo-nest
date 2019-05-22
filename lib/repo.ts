import { IEntity } from "./entity";
import { Collection, ObjectId } from "mongodb";
import { EntityWithoutGetters } from "./EntityWithoutGetters";

export class Repository<T extends IEntity> {
  constructor(
    public collection: Collection<Partial<EntityWithoutGetters<T>>>
  ) {}

  saveOrUpdateOne(entity: Partial<EntityWithoutGetters<T>>) {
    const id: string = (entity as any)._id;
    if (id) {
      delete (entity as IEntity)._id;
      return this.collection.updateOne({ _id: new ObjectId(id) } as any, {
        $set: entity
      });
    } else {
      return this.collection.insertOne(entity);
    }
  }

  saveOrUpdateMany(entities) {
    if (entities.length < 1000) {
      const bulkOperation = this.collection.initializeUnorderedBulkOp();
      for (const item of entities) {
        const id = item._id;
        delete item._id;
        if (id) {
          bulkOperation
            .find({ _id: new ObjectId(id.toString()) })
            .update({ $set: item });
        } else {
          bulkOperation.insert(item);
        }
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
