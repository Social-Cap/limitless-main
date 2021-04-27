import Head from 'next/head';
import { PureComponent, Fragment } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { galleryService } from '@services/gallery.service';
import { IGalleryUpdate } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';
import { FormGallery } from '@components/gallery/form-gallery';

interface IProps {
  id: string;
}
class GalleryUpdate extends PureComponent<IProps> {
  state = {
    submitting: false,
    fetching: true,
    gallery: {} as IGalleryUpdate
  };

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  async componentDidMount() {
    const { id } = this.props;
    try {
      const resp = await galleryService.findById(id);
      this.setState({ gallery: resp.data });
    } catch (e) {
      message.error('Gallery not found!');
    } finally {
      this.setState({ fetching: false });
    }
  }

  async submit(data: any) {
    const { id } = this.props;
    try {
      this.setState({ submitting: true });

      const submitData = {
        ...data
      };
      await galleryService.update(id, submitData);
      message.success('Updated successfully');
      this.setState({ submitting: false });
    } catch (e) {
      // TODO - check and show error here
      message.error('Something went wrong, please try again!');
      this.setState({ submitting: false });
    }
  }

  render() {
    const { gallery, submitting, fetching } = this.state;
    return (
      <>
        <Head>
          <title>Update Gallery</title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Gallery', href: '/gallery' },
            { title: gallery.name ? gallery.name : 'Detail gallery' }
          ]}
        />
        <Page>
          {fetching ? (
            <Loader />
          ) : (
            <FormGallery
              gallery={gallery}
              onFinish={this.submit.bind(this)}
              submitting={submitting}
            />
          )}
        </Page>
      </>
    );
  }
}

export default GalleryUpdate;
