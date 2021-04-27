import { PureComponent } from 'react';
import {
  Input, Row, Col, Button, Select, DatePicker
} from 'antd';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { SelectGalleryDropdown } from '@components/gallery/common/select-gallery-dropdown';

const { RangePicker } = DatePicker;
interface IProps {
  keyword?: boolean;
  onSubmit?: Function;
  keyFilter?: string;
  statuses?: {
    key: string;
    text?: string;
  }[];
  sourceType?: {
    key: string;
    text?: string;
  }[];
  type?: {
    key: string;
    text?: string;
  }[];
  defaultType?: string;
  searchWithPerformer?: boolean;
  performerId?: string;
  searchWithGallery?: boolean;
  galleryId?: string;
  dateRange?: boolean;
}

export class SearchFilter extends PureComponent<IProps> {
  performerRef: any;

  state = {
    q: '',
    performerId: '',
    galleryId: ''
  };

  componentDidMount() {
    const { performerId } = this.props;
    if (performerId) {
      this.setState({ performerId });
    }
  }

  render() {
    const { onSubmit } = this.props;
    const {
      statuses = [],
      searchWithPerformer,
      performerId,
      galleryId,
      searchWithGallery,
      keyFilter,
      dateRange,
      sourceType,
      keyword,
      type,
      defaultType
    } = this.props;
    return (
      <Row gutter={24}>
        {keyword ? (
          <Col xl={{ span: 4 }} md={{ span: 8 }}>
            <Input
              placeholder="Enter keyword"
              onChange={(evt) => this.setState({ q: evt.target.value })}
              onPressEnter={() => onSubmit(this.state)}
            />
          </Col>
        ) : null}
        {statuses && statuses.length > 0 ? (
          <Col xl={{ span: 4 }} md={{ span: 8 }}>
            <Select
              onChange={(val) => {
                const objectFilter = keyFilter ? { [keyFilter]: val } : { status: val };
                this.setState(objectFilter);
              }}
              style={{ width: '100%' }}
              placeholder="Select status"
              defaultValue=""
            >
              {statuses.map((s) => (
                <Select.Option key={s.key} value={s.key}>
                  {s.text || s.key}
                </Select.Option>
              ))}
            </Select>
          </Col>
        ) : null}
        {type && type.length > 0 ? (
          <Col xl={{ span: 4 }} md={{ span: 8 }}>
            <Select
              onChange={(val) => {
                const objectFilter = keyFilter ? { [keyFilter]: val } : { type: val };
                this.setState(objectFilter);
              }}
              style={{ width: '100%' }}
              placeholder="Select type"
              defaultValue={defaultType || ''}
            >
              {type.map((s) => (
                <Select.Option key={s.key} value={s.key}>
                  {s.text || s.key}
                </Select.Option>
              ))}
            </Select>
          </Col>
        ) : null}
        {sourceType && sourceType.length > 0 ? (
          <Col xl={{ span: 4 }} md={{ span: 8 }}>
            <Select
              onChange={(val) => {
                const objectFilter = keyFilter ? { [keyFilter]: val } : { sourceType: val };
                this.setState(objectFilter);
              }}
              style={{ width: '100%' }}
              placeholder="Select type"
              defaultValue=""
            >
              {sourceType.map((s) => (
                <Select.Option key={s.key} value={s.key}>
                  {s.text || s.key}
                </Select.Option>
              ))}
            </Select>
          </Col>
        ) : null}
        {searchWithPerformer && (
          <Col xl={{ span: 6 }} md={{ span: 8 }}>
            <SelectPerformerDropdown
              placeholder="Search performer"
              style={{ width: '100%' }}
              onSelect={(val) => this.setState({ performerId: val || '' })}
              defaultValue={performerId || ''}
            />
          </Col>
        )}
        {searchWithGallery && (
          <Col xl={{ span: 6 }} md={{ span: 8 }}>
            <SelectGalleryDropdown
              placeholder="Type to search gallery here"
              style={{ width: '100%' }}
              onSelect={(val) => this.setState({ galleryId: val || '' })}
              defaultValue={galleryId || ''}
            />
          </Col>
        )}
        {dateRange && (
          <Col xl={{ span: 6 }} md={{ span: 8 }}>
            <RangePicker
              onChange={(dates: [any, any], dateStrings: [string, string]) => this.setState({ fromDate: dateStrings[0], toDate: dateStrings[1] })}
            />
          </Col>
        )}
        <Col xl={{ span: 4 }} md={{ span: 8 }}>
          <Button type="primary" onClick={() => onSubmit(this.state)}>
            Search
          </Button>
        </Col>
      </Row>
    );
  }
}
