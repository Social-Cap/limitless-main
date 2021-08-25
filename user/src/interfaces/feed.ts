import { IPerformer } from './performer';

export interface IFeed {
  _id?: string;
  type: string;
  fromRef: string;
  refId: string;
  fromSourceId: string;
  performer: IPerformer;
  fromSource: string;
  title: string;
  slug: string;
  text: string;
  fileIds: Array<string>;
  totalLike: number;
  totalComment: number;
  createdAt: Date;
  updatedAt: Date;
  files: any;
  isLiked: boolean;
  isSale: boolean;
  price: number;
  isSubscribed: boolean;
  isBought: boolean;
  polls: any[];
  pollIds: string[];
  pollExpiredAt: Date;
  isBookMarked: boolean;
  thumbnailId: string;
  thumbnailUrl: string;
  teaserId: string;
  teaser: any;
  tagline: string;
  isPinned: boolean;
  pinnedAt: Date;
}
