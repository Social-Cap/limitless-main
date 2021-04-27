/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import { PureComponent } from 'react';
import {
  PictureOutlined,
  DeleteOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { Progress } from 'antd';

interface IProps {
  remove: Function;
  files: any[];
}

export default class UploadList extends PureComponent<IProps> {
  state = {
    previews: {} as Record<string, any>
  };

  renderPreview(file) {
    if (file.status === 'uploading') {
      return <LoadingOutlined />;
    }
    if (this.state.previews[file.uid]) {
      return <img alt="" src={this.state.previews[file.uid]} />;
    }

    const reader = new FileReader();
    reader.addEventListener('load', () => {
      const previews = {
        ...this.state.previews,
        [file.uid]: reader.result
      };
      this.setState({ previews });
    });
    reader.readAsDataURL(file);
    return <PictureOutlined />;
  }

  render() {
    return (
      <div className="ant-upload-list ant-upload-list-picture">
        {this.props.files.map((file) => (
          <div
            className="ant-upload-list-item ant-upload-list-item-uploading ant-upload-list-item-list-type-picture"
            key={file.uid}
            style={{ height: 'auto' }}
          >
            <div className="ant-upload-list-item-info">
              <div>
                <span className="ant-upload-list-item-thumbnail ant-upload-list-item-file">
                  {this.renderPreview(file)}
                </span>
                <span className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                  <span>{file.name}</span>
                </span>
                <span className="ant-upload-list-item-name ant-upload-list-item-name-icon-count-1">
                  <span>
                    <b>{file.name}</b>
                  </span>
                  {' '}
                  |
                  {' '}
                  <span>
                    {(file.size / (1024 * 1024)).toFixed(2)}
                    {' '}
                    MB
                  </span>
                </span>
                {file.percent !== 100 && (
                  <span className="ant-upload-list-item-card-actions picture">
                    <a onClick={this.props.remove.bind(this, file)}>
                      <DeleteOutlined />
                    </a>
                  </span>
                )}

                {file.percent && (
                  <Progress percent={Math.round(file.percent)} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
