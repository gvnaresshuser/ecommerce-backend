import { Inject, Injectable } from '@nestjs/common';
import { DATABASE } from './database.provider';

@Injectable()
export class DatabaseService {
    constructor(
        @Inject(DATABASE) public db: any, // expose db
    ) { }
}
//---------------------------------------------
/* import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {}
 */