import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733262642606 implements MigrationInterface {
  name = 'Migration1733262642606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "creatorId" uuid NOT NULL, "thumbnailUrl" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_fc245286dcd14ac823c2b92347d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_fc245286dcd14ac823c2b92347d"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`DROP TABLE "auction"`);
  }
}
