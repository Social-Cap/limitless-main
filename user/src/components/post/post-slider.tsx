import { PureComponent } from 'react';
import {
  Carousel, Spin, Image
} from 'antd';
import { VideoPlayer } from '@components/common/video-player';
import { AudioPlayer } from '@components/common/audio-player';
import { IFeed } from '@interfaces/feed';
import './index.less';

interface IProps {
  feed: IFeed;
}

export default class FeedSlider extends PureComponent<IProps> {
  render() {
    const { feed } = this.props;
    const images = feed.files && feed.files.filter((f) => f.type === 'feed-photo');
    const videos = feed.files && feed.files.filter((f) => f.type === 'feed-video');
    const audios = feed.files && feed.files.filter((f) => f.type === 'feed-audio');
    let processing = false;
    videos && videos.forEach((f) => {
      if (f.status !== 'finished') {
        processing = true;
      }
    });
    audios && audios.forEach((f) => {
      if (f.status !== 'finished') {
        processing = true;
      }
    });

    return (
      <div className={feed.type === 'audio' ? 'feed-slider custom' : 'feed-slider'}>
        {!processing && feed.files && feed.files.length && (
          <>
            {images && images.length > 0 && (
            <Image.PreviewGroup>
              <Carousel
                adaptiveHeight
                effect="fade"
                draggable
                swipe
                swipeToSlide
                arrows
                dots={false}
                infinite
              >
                {images.map((img) => (
                  <Image
                    preview={{ maskClosable: false }}
                    key={img._id}
                    src={img.url}
                    placeholder
                    fallback="/static/no-image.jpg"
                    title={img.name}
                    width="100%"
                    alt="img"
                  />
                ))}
              </Carousel>
            </Image.PreviewGroup>
            )}
            {videos && videos.length > 0 && videos.map((vid) => {
              const thumbnailUrl = feed?.thumbnailUrl || (vid?.thumbnails && vid?.thumbnails[0]);
              return (
                <VideoPlayer
                  key={vid._id}
                  {...{
                    autoplay: false,
                    controls: true,
                    playsinline: true,
                    poster: thumbnailUrl,
                    sources: [
                      {
                        src: vid.url,
                        type: 'video/mp4'
                      }
                    ]
                  }}
                />
              );
            })}
            {audios && audios.length > 0 && audios.map((audio) => <AudioPlayer key={audio._id} source={audio?.url} />)}
          </>
        )}
        {processing && (
        <div className="proccessing">
          <Spin />
          <p>Your media is currently proccessing</p>
        </div>
        )}
      </div>
    );
  }
}
