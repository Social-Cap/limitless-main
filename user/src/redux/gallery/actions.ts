import { createAsyncAction } from '@lib/redux';

export const {
  getGalleries,
  getGalleriesSuccess,
  getGalleriesFail
} = createAsyncAction('getGalleries', 'GET_GALLERIES');

export const {
  moreGalleries,
  moreGalleriesSuccess,
  moreGalleriesFail
} = createAsyncAction('moreGalleries', 'MORE_GALLERIES');
