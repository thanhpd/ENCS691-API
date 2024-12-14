import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734212693591 implements MigrationInterface {
  name = 'Migration1734212693591';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "personalizeSave" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid, "auctionLotId" uuid, CONSTRAINT "PK_c50682532e9e23ffa807298e4fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "personalizeSave" ADD CONSTRAINT "FK_b272ca574f5374ed746dfc92b57" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "personalizeSave" ADD CONSTRAINT "FK_f37cfda49fe0805fe9c49203429" FOREIGN KEY ("auctionLotId") REFERENCES "auctionLot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "personalizeSave" DROP CONSTRAINT "FK_f37cfda49fe0805fe9c49203429"`,
    );
    await queryRunner.query(
      `ALTER TABLE "personalizeSave" DROP CONSTRAINT "FK_b272ca574f5374ed746dfc92b57"`,
    );
    await queryRunner.query(`DROP TABLE "personalizeSave"`);
  }
}
