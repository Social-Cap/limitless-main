import { IPerformer } from './performer';

export interface IVideo {
  _id: string;
  title: string;
  performerId: string;
  isSale?: boolean;
  price?: number;
  status?: string;
  description?: string;
  thumbnail?: string;
  teaser?: string;
  tags?: string[];
  participantIds?: string[];
  participants?: any[];
  video?: { url?: string; thumbnails?: string[]; duration?: number };
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
    bookmarks?: number;
  };
  performer?: {
    username: string;
    name?: string;
    avatarPath?: string;
    _id: string;
    avatar?: string;
  };
  userReaction?: {
    liked?: boolean;
    bookmarked?: boolean;
  };
}

export interface IVideoResponse {
  _id: string;
  title: string;
  performerId: string;
  isSale?: boolean;
  price?: number;
  status?: string;
  processing: boolean;
  description?: string;
  thumbnail?: string;
  teaser?: string;
  tags?: string[];
  participantIds?: string[];
  participants?: any[];
  video?: { url?: string; thumbnails?: string[]; duration?: number };
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
    bookmarks?: number;
  };
  performer?: IPerformer;
  userReaction?: {
    liked?: boolean;
    bookmarked?: boolean;
  };
  isBought: boolean;
  isSubscribed: boolean;
  tagline?: string;
}

export interface IVideoCreate {
  title: string;
  performerId?: string;
  isSale?: boolean;
  isSchedule?: boolean;
  scheduledAt?: any;
  tags?: string[];
  price?: number;
  participantIds?: string[];
  status: string;
  description?: string;
  tagline?: string;
}

export interface IVideoUpdate {
  _id: string;
  performerId?: string;
  title?: string;
  isSale?: boolean;
  price?: number;
  tags?: string[];
  participantIds?: string[];
  isSchedule?: boolean;
  scheduledAt?: any;
  status?: string;
  description?: string;
  thumbnail?: string;
  teaser?: string;
  video?: { url?: string };
  tagline?: string;
}