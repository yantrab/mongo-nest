
import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { RepositoryFactory } from './repo.factory';

@Global()
@Module({})
export class MongoRepoModule {
    static forRoot(url: string) {
        const connectionProvider = {
            provide: 'MONGO_CONNECTION',
            useFactory: async () => await new MongoClient(url, { useNewUrlParser: true }).connect(),
        };
        return {
            module: MongoRepoModule,
            providers: [
                connectionProvider, RepositoryFactory,
            ],
            exports: [connectionProvider, RepositoryFactory],
        };
    }
}