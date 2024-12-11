import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733948656040 implements MigrationInterface {
  name = 'Migration1733948656040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auctionLot" ADD "isAutoExtendAfterTimerEnds" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auctionLot" DROP COLUMN "isAutoExtendAfterTimerEnds"`,
    );
  }
}
