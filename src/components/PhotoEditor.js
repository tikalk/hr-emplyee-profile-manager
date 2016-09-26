import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';
import { get } from 'lodash';
import EditToggle from './EditToggle';


export default class PhotoEditor extends Component {
  static propTypes = {
    saveMetaData: PropTypes.func,
    id: PropTypes.number,
    image_path: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      id: props.id,
      image_path: props.image_path,
    };
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.setState(
      {
        editing: false,
        id: props.id,
        image_path: props.image_path
      }
    );
  }

  onUploadPhoto() {
    const { image_path } = this.state;
    this.props.saveMetaData({ image_path });
  }

  onDrop(files) {
    const imagePath = get(files, '[0].preview', null);
    this.setState({
      imagePath
    });
  }

  toggleEditing() {
    this.setState({ editing: !this.state.editing });
  }

  render() {
    const { imagePath, editing } = this.state;
    return (
      <div className="container">
        <div className="photo-container">
          <div className="title"><h2>Profile picture information</h2></div>
          <div>
            <EditToggle onToggleEditing={this.toggleEditing} editing={editing} />
          </div>
          {
            editing && <div>
              <div className="upload">
                <button onClick={this.onUploadPhoto}>Upload</button>
              </div>
              <div><Dropzone onDrop={this.onDrop}>
                <div>Drop or click here to choose a picture</div>
              </Dropzone></div>
            </div>
          }
          {
            imagePath && <div className="photo-wrapper">
              <img role="presentation" className="photo" src={imagePath} />
            </div>
          }
        </div>
      </div>
    );
  }
}
