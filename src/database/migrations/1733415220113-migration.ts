import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733415220113 implements MigrationInterface {
  name = 'Migration1733415220113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid" ADD "isHighestBid" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "bid" DROP COLUMN "isHighestBid"`);
  }
}
