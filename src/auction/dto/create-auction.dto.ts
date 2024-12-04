export class CreateAuctionDto {
  name: string;
  thumbnailUrl?: string;
  startAt: Date;
  endAt: Date;
  intervalInMinutes: number;
}
