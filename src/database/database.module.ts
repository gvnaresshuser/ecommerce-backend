import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
  providers: [databaseProvider, DatabaseService],
  exports: [databaseProvider, DatabaseService], // ✅ export both
})
export class DatabaseModule { }
//----------------------------------------------
/* import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseService]
})
export class DatabaseModule {}
 */