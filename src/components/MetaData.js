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
    this.state = {
      imageUploadInProgress: false
    };
    autoBind(this);
  }

  onDrop(files) {
    const { uploader } = this.props;
    const { path, name } = files[0];
    // upload to cloudinarys
    this.setState({
      imageUploadInProgress: true
    });
    uploader.upload(path,
      (result) => {
        const { onChange } = this.props;
        this.setState({
          imageUploadInProgress: false
        });
        onChange('image_path', result.url);
      },
      {
        public_id: `site/pictures/${name}`,
        height: 200
      });
  }

  handleChange(key, evt) {
    const { onChange } = this.props;
    if (key.indexOf('url:') === 0) {
      const idx = Number(key.split(':')[1]);
      const urls = this.state.follow_me_urls || [];
      urls[idx] = evt.target.value;
      onChange('follow_me_urls', urls);
    } else {
      onChange(key, evt.target.value);
    }
  }

  render() {
    const {
      about, login, description, first_name: firstName,
      last_name: lastName, follow_me_urls: followMeUrls, image_path: imgPath,
      permalink
    } = this.props.yamlData;
    const { editing } = this.props;
    const imageUploadInProgress = this.state.imageUploadInProgress;
    const imagePath = imgPath || '';
    const imagePrefix = (imagePath.indexOf('//') === 0) ? 'http:' : '';

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
      if (followMeUrls && followMeUrls.length === 0) {
        followMeUrls.push('');
      }
      followMe = (followMeUrls || ['']).map((url, i) => {
        return (
          <div key={i}>
            <input
              className="form-control" value={url || ''}
              onChange={this.handleChange.bind(this, `url:${i}`)}
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
              <div className="col s2">First Name:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" value={firstName || ''}
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
                    className="form-control" value={lastName || ''}
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
                    className="form-control" value={description || ''}
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
                    className="form-control" value={login || ''}
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
                    className="form-control" value={about || ''}
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
            <div className="row">
              <div className="col s2">Permalink:</div>
              <div className="col s10">
                {editing ?
                  <input
                    className="form-control" value={permalink || ''}
                    onChange={this.handleChange.bind(this, 'permalink')}
                  />
                  :
                  <span>{permalink}</span>
                }
              </div>
            </div>
          </div>
          <div className="col s4">
            <div className="row">
              <div className="photo-container">
                <h5>Profile picture</h5>
                {editing ?
                  <div>
                    <div style={{ cursor: 'hand' }}>
                      <Dropzone className="drop-zone card-panel" onDrop={this.onDrop}>
                        <div>Drop or click here to choose a picture</div>
                      </Dropzone>
                    </div>
                  </div> : null
                }
                <div className="photo-wrapper">
                  {
                    imagePath && !imageUploadInProgress ?
                      <img role="presentation" className="photo" src={imagePrefix + imagePath} />
                      :
                      null
                  }
                  {
                    imageUploadInProgress ?
                      <div className="image-preloader">
                        <img src="../css/pictures/preloader.gif" alt="Loading..." />
                      </div>
                      :
                      null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
