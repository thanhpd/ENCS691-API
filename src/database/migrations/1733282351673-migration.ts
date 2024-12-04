import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1733282351673 implements MigrationInterface {
  name = 'Migration1733282351673';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL, "bidderId" uuid, "auctionLotId" uuid, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auctionLot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" character varying NOT NULL, "itemOverview" character varying NOT NULL, "paymentShippingDetails" character varying NOT NULL, "terms" character varying NOT NULL, "estPriceLine" character varying NOT NULL, "startingPrice" integer NOT NULL, "imageUrls" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "creatorId" uuid, "auctionId" uuid, CONSTRAINT "PK_a22a8beddb365dbad47f9e3b92b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "thumbnailUrl" character varying NOT NULL, "startAt" TIMESTAMP NOT NULL, "details" character varying NOT NULL, "type" character varying NOT NULL, "status" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, "creatorId" uuid, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "avatarUrl" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "FK_1345c9f3ee0789dcff101f6c79b" FOREIGN KEY ("bidderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" ADD CONSTRAINT "FK_adaafec01b9ed5c5f7633e064f4" FOREIGN KEY ("auctionLotId") REFERENCES "auctionLot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctionLot" ADD CONSTRAINT "FK_998545b0cfa61e029ee42c8d57b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctionLot" ADD CONSTRAINT "FK_ae91270d6b819a64e5930b8b16b" FOREIGN KEY ("auctionId") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auction" ADD CONSTRAINT "FK_fc245286dcd14ac823c2b92347d" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auction" DROP CONSTRAINT "FK_fc245286dcd14ac823c2b92347d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctionLot" DROP CONSTRAINT "FK_ae91270d6b819a64e5930b8b16b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auctionLot" DROP CONSTRAINT "FK_998545b0cfa61e029ee42c8d57b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "FK_adaafec01b9ed5c5f7633e064f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid" DROP CONSTRAINT "FK_1345c9f3ee0789dcff101f6c79b"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "auction"`);
    await queryRunner.query(`DROP TABLE "auctionLot"`);
    await queryRunner.query(`DROP TABLE "bid"`);
  }
}
