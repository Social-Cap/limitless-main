/* eslint-disable no-param-reassign */
import { PureComponent } from 'react';
import {
  Layout, message, Spin
} from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import Head from 'next/head';
import FormGallery from '@components/gallery/form-gallery';
import PageHeading from '@components/common/page-heading';
import {
  IGallery, IGalleryCreate, IUIConfig
} from 'src/interfaces';
import Page from '@components/common/layout/page';
import { galleryService } from 'src/services';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';
import { connect } from 'react-redux';
import { photoService } from '@services/index';

interface IProps {
  id: string;
  ui: IUIConfig;
}

interface IStates {
  submiting: boolean;
  gallery: IGallery;
  loading: boolean;
  filesList: any[];
  uploading: boolean;
}

class GalleryUpdatePage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      submiting: false,
      gallery: null,
      loading: false,
      filesList: [],
      uploading: false
    };
  }

  componentDidMount() {
    this.getGallery();
  }

  handleBeforeUpload(_, files) {
    const { filesList } = this.state;
    this.setState({ filesList: [...filesList, ...files] });
  }

  async handleUploadPhotos() {
    const { id } = this.props;
    const data = {
      galleryId: id,
      status: 'active'
    };
    const { filesList } = this.state;
    const uploadFiles = filesList.filter(
      (f) => !f._id && !['uploading', 'done'].includes(f.status)
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const file of uploadFiles) {
      try {
        if (['uploading', 'done'].includes(file.status)) return;
        file.status = 'uploading';
        // eslint-disable-next-line no-await-in-loop
        await photoService.uploadImages(
          file as any,
          data,
          this.onUploading.bind(this, file)
        );
      } catch (e) {
        file.status = 'error';
        message.error(`File ${file?.name} error!`);
      }
    }
  }

  onUploading(file, resp: any) {
    file.percent = resp.percentage;
    file.status = 'uploading';
    if (file.percent === 100) file.status = 'done';
    this.forceUpdate();
  }

  async onFinish(data: IGalleryCreate) {
    try {
      const { id } = this.props;
      await this.setState({ submiting: true });
      if (!data.isSale) {
        // eslint-disable-next-line no-param-reassign
        data.price = 0;
      }
      await galleryService.update(id, data);
      await this.handleUploadPhotos();
      message.success('Changes saved.');
    } catch (e) {
      message.error(getResponseError(e));
    } finally {
      this.setState({ submiting: false });
      Router.push('/model/my-gallery');
    }
  }

  async getGallery() {
    try {
      const { id } = this.props;
      await this.setState({ loading: true });
      const gallery = await (await galleryService.findById(id)).data;
      this.getPhotosInGallery();
      this.setState({ gallery });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
      Router.back();
    } finally {
      this.setState({ loading: false });
    }
  }

  async getPhotosInGallery() {
    try {
      const { id } = this.props;
      const photos = await (await photoService.searchPhotosInGallery({ galleryId: id, limit: 200 })).data;
      this.setState({
        filesList: photos ? photos.data : []
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
      Router.back();
    }
  }

  async setCover(file) {
    const { filesList } = this.state;
    if (!file._id) {
      this.setState({
        filesList: filesList.filter((f) => f.uid !== file.uid)
      });
      return;
    }
    try {
      await this.setState({ submiting: true });
      await photoService.setCoverGallery(file._id);
      message.success('Set new cover image success!');
      this.getPhotosInGallery();
    } catch (error) {
      message.error(getResponseError(error));
    } finally {
      this.setState({ submiting: false });
    }
  }

  async removePhoto(file) {
    const { filesList } = this.state;
    if (!file._id) {
      this.setState({
        filesList: filesList.filter((f) => f?.uid !== file?.uid)
      });
      return;
    }
    if (!window.confirm('Are sure to remove this photo?')) return;
    try {
      await this.setState({ submiting: true });
      await photoService.delete(file._id);
      message.success('Deleted success');
      this.setState({
        filesList: filesList.filter((p) => p._id !== file._id)
      });
    } catch (error) {
      message.error(getResponseError(error));
    } finally {
      this.setState({ submiting: false });
    }
  }

  render() {
    const { ui } = this.props;
    const {
      gallery, submiting, loading, filesList, uploading
    } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {' '}
            {ui && ui.siteName}
            {' '}
            | Edit Gallery
            {' '}
          </title>
        </Head>
        <div className="main-container">
          <Page>
            <PageHeading title="Edit Gallery" icon={<PictureOutlined />} />
            {!loading && gallery && (
              <FormGallery
                gallery={gallery}
                onFinish={this.onFinish.bind(this)}
                submiting={submiting || uploading}
                filesList={filesList}
                handleBeforeUpload={this.handleBeforeUpload.bind(this)}
                removePhoto={this.removePhoto.bind(this)}
                setCover={this.setCover.bind(this)}
              />
            )}
            {loading && <div className="text-center"><Spin /></div>}
          </Page>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(GalleryUpdatePage);
