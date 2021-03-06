import { Injectable, Inject } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { IEntity } from "./entity";
import { Repository } from "./repo";
import { EntityWithoutGetters } from "./EntityWithoutGetters";

@Injectable()
export class RepositoryFactory {
  constructor(@Inject("MONGO_CONNECTION") private connection: MongoClient) {}

  getRepository<T extends IEntity>(
    entity: Function & { prototype: T },
    db: string
  ): Repository<T> {
    return new Repository(
      this.connection
        .db(db)
        .collection<Partial<EntityWithoutGetters<T>>>(entity.name)
    );
  }
}
