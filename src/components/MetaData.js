import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';

export default class MetaData extends Component {

  static propTypes = {
    yamlData: PropTypes.object,
    onChange: PropTypes.func,
    editing: PropTypes.bool,
    uploader: PropTypes.object
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  onDrop(files) {
    const { uploader } = this.props;
    const { path, name } = files[0].path;
    // upload to cloudinary
    uploader.upload(path,
      (result) => {
        this.handleChange('image_path', result.url);
      },
      {
        public_id: `site/pictures/${name}`,
        height: 200
      });
  }

  handleChange(key, evt) {
    const { onChange } = this.props;
    if (key.indexOf('url:') === 0) {
      const idx = key.split(':')[1];
      const urls = this.state.follow_me_urls;
      urls[idx] = evt.target.value;
      onChange('follow_me_urls', urls);
    } else {
      onChange(key, evt.target.value);
    }
  }

  render() {
    const { id, about, login, description, first_name: firstName,
      last_name: lastName, follow_me_urls: followMeUrls, image_path: imagePath } = this.props.yamlData;
    const { editing } = this.props;
    let followMe;
    if (!editing) {
      followMe = (followMeUrls || []).map((url, i) => {
        return (
          <div key={i}>
            <a rel="noopener noreferrer" target="_blank" href={url}>{url}</a>
          </div>
        );
      });
    } else {
      followMe = (followMeUrls || []).map((url, i) => {
        return (
          <div key={i}>
            <input
              className="form-control" defaultValue={url}
              onChange={this.handleChange.bind(this, `url: ${i}`)}
            />
          </div>
        );
      });
    }

    return (
      <div className="section card-panel">
        <div className="row">
          <div className="col s8 card-panel">
            <div className="row">
              <div className="col s2">ID:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" defaultValue={id}
                    onChange={this.handleChange.bind(this, 'id')}
                  />
                  :
                  <span>{id}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col s2">First Name:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" defaultValue={firstName}
                    onChange={this.handleChange.bind(this, 'first_name')}
                  />
                  :
                  <span>{firstName}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col s2">Last Name:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" defaultValue={lastName}
                    onChange={this.handleChange.bind(this, 'last_name')}
                  />
                  :
                  <span>{lastName}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col s2">Description:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" defaultValue={description}
                    onChange={this.handleChange.bind(this, 'description')}
                  />
                  :
                  <span>{description}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col s2">Login:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" defaultValue={login}
                    onChange={this.handleChange.bind(this, 'login')}
                  />
                  :
                  <span>{login}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col s2">About:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" defaultValue={about}
                    onChange={this.handleChange.bind(this, 'about')}
                  />
                  :
                  <span>{about}</span>
                }
              </div>
            </div>
            <div className="row">
              <div className="col s2">Follow Me:</div>
              <div className="col s10" style={{ overflow: 'hidden' }}>{followMe}</div>
            </div>
          </div>
          <div className="col s4">
            <div className="row">
              <div className="photo-container">
                <h5>Profile picture</h5>
                {editing ?
                  <div>
                    <div>
                      <Dropzone className="drop-zone card-panel" onDrop={this.onDrop}>
                        <div>Drop or click here to choose a picture</div>
                      </Dropzone>
                    </div>
                  </div> : null
                }
                {imagePath ?
                  <div className="photo-wrapper">
                    <img role="presentation" className="photo" src={imagePath} />
                  </div>
                  :
                  null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
