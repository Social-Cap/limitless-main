/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import Head from 'next/head';
import { PureComponent, Fragment, createRef } from 'react';
import {
  message, Form, Upload, Button
} from 'antd';
import Page from '@components/common/layout/page';
import { videoService } from '@services/video.service';
import Router from 'next/router';
import { BreadcrumbComponent } from '@components/common';
import { FormInstance } from 'antd/lib/form';
import { UploadOutlined } from '@ant-design/icons';
import VideoUploadList from '@components/file/video-upload-list';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';

const { Dragger } = Upload;
// interface IFiles {
//   fieldname: string;
//   file: File;
// }
// interface IResponse {
//   data: { _id: string };
// }
const validateMessages = {
  required: 'This field is required!'
};
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};
interface IProps {
  performerId: string;
}
class BulkUploadVideo extends PureComponent<IProps> {
  state = {
    uploading: false,
    // uploadPercentage: 0,
    fileList: []
  };

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
  }

  onUploading(file, resp: any) {
    // this.setState({ uploadPercentage: resp.percentage });
    const a = file;
    a.percent = resp.percentage;
    if (file.percent === 100) a.status = 'done';
    this.forceUpdate();
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  beforeUpload(file, fileList) {
    this.setState({ fileList });
    return false;
  }

  remove(file) {
    const { fileList } = this.state;
    fileList.splice(
      fileList.findIndex((f) => f.uid === file.uid),
      1
    );
    this.setState({ fileList });
    this.forceUpdate();
  }

  async submit(formValues: any) {
    const { fileList } = this.state;
    if (!fileList.length) {
      return message.error('Please select video!');
    }

    const uploadFiles = fileList.filter((f) => !['uploading', 'done'].includes(f.status));
    if (!uploadFiles.length) return message.error('Please select new video!');

    await this.setState({ uploading: true });
    for (const file of uploadFiles) {
      try {
        if (['uploading', 'done'].includes(file.status)) continue;
        file.status = 'uploading';
        await videoService.uploadVideo(
          [
            {
              fieldname: 'video',
              file
            }
          ],
          {
            title: file.name,
            price: 0,
            description: '',
            tags: [],
            isSaleVideo: false,
            isSchedule: false,
            status: 'inactive',
            performerId: formValues.performerId
          },
          this.onUploading.bind(this, file)
        );
      } catch (e) {
        message.error(`File ${file.name} error!`);
      }
    }
    message.success('Files has been uploaded!');
    Router.push('/video');
    return undefined;
  }

  render() {
    const { uploading, fileList } = this.state;
    const { performerId } = this.props;
    if (!this.formRef) this.formRef = createRef();
    return (
      <>
        <Head>
          <title>Bulk upload video</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Video', href: '/video' }, { title: 'Bulk Upload Video' }]} />
        <Page>
          <Form
            layout="vertical"
            onFinish={this.submit.bind(this)}
            validateMessages={validateMessages}
            ref={this.formRef}
            initialValues={{
              status: 'inactive',
              performerId: performerId || ''
            }}
          >
            {/* <Row className="ant-form-item"> */}
            <Form.Item name="performerId" label="Performer" rules={[{ required: true }]}>
              <SelectPerformerDropdown
                onSelect={(val) => this.setFormVal('performerId', val)}
                disabled={uploading}
                defaultValue={performerId || ''}
              />
            </Form.Item>
            {/* <Col span={24}>
                <div>

                </div>
              </Col> */}
            <Form.Item wrapperCol={{ span: 24 }}>
              <Dragger
                accept="video/*"
                beforeUpload={this.beforeUpload.bind(this)}
                multiple
                showUploadList={false}
                disabled={uploading}
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag-drop files to this area to upload</p>
                <p className="ant-upload-hint">Support video format only</p>
              </Dragger>

              <VideoUploadList files={fileList} remove={this.remove.bind(this)} />
            </Form.Item>
            {/* </Row> */}

            <Form.Item wrapperCol={{ ...layout.wrapperCol }}>
              <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading || !fileList.length}>
                Upload
              </Button>
            </Form.Item>
          </Form>
        </Page>
      </>
    );
  }
}

export default BulkUploadVideo;
