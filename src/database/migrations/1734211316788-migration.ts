import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734211316788 implements MigrationInterface {
  name = 'Migration1734211316788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "isDeregistered" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDeregistered"`);
  }
}
