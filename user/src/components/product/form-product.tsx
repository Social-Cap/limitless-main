import { PureComponent, createRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Progress,
  Row,
  Col
} from 'antd';
import { IProduct, IProductCreate } from 'src/interfaces';
import { FileOutlined, CameraOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';

interface IProps {
  product?: IProduct;
  submit?: Function;
  beforeUpload?: Function;
  uploading?: boolean;
  uploadPercentage?: number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export class FormProduct extends PureComponent<IProps> {
  state = {
    previewImageProduct: null,
    isDigitalProduct: false
  };

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    const { product } = this.props;
    if (product) {
      this.setState({
        isDigitalProduct: product.type === 'digital',
        previewImageProduct: product?.image || '/static/no-image.jpg'
      });
    }
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
    if (field === 'type') {
      this.setState({ isDigitalProduct: val === 'digital' });
    }
  }

  beforeUpload(field, file) {
    const { beforeUpload } = this.props;
    if (field === 'image') {
      const isLt2M = file.size / 1024 / 1024 < (process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
      if (!isLt2M) {
        message.error(`Image is too large please provide an image ${process.env.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB or below`);
        return false;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => this.setState({ previewImageProduct: reader.result }));
      reader.readAsDataURL(file);
    }
    const isValid = file.size / 1024 / 1024 < (process.env.NEXT_PUBLIC_MAX_SIZE_FILE || 100);
    if (!isValid) {
      message.error(`File is too large please provide an image ${process.env.NEXT_PUBLIC_MAX_SIZE_FILE || 100}MB or below`);
      return false;
    }
    beforeUpload && beforeUpload(file, field);
    return isValid;
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      product, submit, uploading, uploadPercentage
    } = this.props;
    const {
      previewImageProduct,
      isDigitalProduct
    } = this.state;
    const haveProduct = !!product;
    return (
      <Form
        {...layout}
        onFinish={submit.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields')}
        name="form-upload"
        ref={this.formRef}
        validateMessages={validateMessages}
        initialValues={
          product || ({
            name: '',
            price: 1,
            description: '',
            status: 'active',
            performerId: '',
            stock: 1,
            type: 'physical'
          } as IProductCreate)
        }
        className="account-form"
      >
        <Row>
          <Col md={12} xs={24}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input name of product!' }]}
              label="Name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select type!' }]}
            >
              <Select onChange={(val) => this.setFormVal('type', val)}>
                <Select.Option key="physical" value="physical">
                  Physical
                </Select.Option>
                <Select.Option key="digital" value="digital">
                  Digital
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item
              name="price"
              label="Amount of tokens"
              rules={[{ required: true, message: 'Amount of tokens is required!' }]}
            >
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          {!isDigitalProduct && (
          <Col md={12} xs={12}>
            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Stock is required!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} />
            </Form.Item>
          </Col>
          )}
          <Col md={!isDigitalProduct ? 24 : 12} xs={!isDigitalProduct ? 24 : 12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select>
                <Select.Option key="active" value="active">
                  Active
                </Select.Option>
                <Select.Option key="inactive" value="inactive">
                  Inactive
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Col>
          <Col md={12} xs={12}>
            <Form.Item label="Image">
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                multiple={false}
                showUploadList={false}
                disabled={uploading}
                beforeUpload={this.beforeUpload.bind(this, 'image')}
              >
                {previewImageProduct && (
                  <img
                    src={previewImageProduct}
                    alt="file"
                    style={{ width: '100px' }}
                  />
                )}
                <CameraOutlined />
              </Upload>
            </Form.Item>
          </Col>
          {isDigitalProduct && (
          <Col md={12} xs={12}>
            <Form.Item label="Digital file" help={product?.digitalFileId ? 'File was existed' : null}>
              <div>
                <Upload
                  listType="picture-card"
                  className="avatar-uploader"
                  multiple={false}
                  showUploadList
                  disabled={uploading || !!product?.digitalFileId}
                  beforeUpload={this.beforeUpload.bind(this, 'digitalFile')}
                >
                  <FileOutlined />
                </Upload>
                {uploadPercentage ? (
                  <Progress percent={Math.round(uploadPercentage)} />
                ) : null}
              </div>
            </Form.Item>
          </Col>
          )}
        </Row>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button
            className="primary"
            type="primary"
            htmlType="submit"
            loading={uploading}
            disabled={uploading}
          >
            {haveProduct ? 'Update' : 'Upload'}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
