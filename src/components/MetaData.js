import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';

export default class MetaData extends Component{

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      id: props.id,
      about: props.about,
      login: props.login,
      follow_me_urls: props.follow_me_urls
    };
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.setState(
      {
        id: props.id,
        about: props.about,
        login: props.login,
        follow_me_urls: props.follow_me_urls
      }
    );
  }

  handleChange(key, evt) {
    if (key.indexOf('url:') === 0) {
      const idx = key.split(':')[1];
      const urls = this.state.follow_me_urls;
      urls[idx] = evt.target.value;
      this.setState({ 'follow_me_urls': urls });
    } else {
      this.setState({ [key]: evt.target.value });
    }
  }

  toggleEditing() {
    const { editing, id, about, login, follow_me_urls } = this.state;
    if (editing) {
      this.props.saveMetaData({ id, about, login, follow_me_urls });
    }
    this.setState({ editing: !this.state.editing})
  }

  onDrop(files){
      console.log('Received files: ', files);
  }

  render() {
    const { id, about, login, follow_me_urls, editing } = this.state;
    let followMe;
    let inputFileStyle = {
      display : 'none'
    }

    if (!editing) {
      followMe = follow_me_urls.map((url, i) => {
        return (
          <div key={i}>
            <a href={url}>{url}</a>
          </div>
        );
      });
    } else {
      followMe = follow_me_urls.map((url, i) => {
        return (
          <div key={i}>
            <input className="form-control" defaultValue={url} onChange={this.handleChange.bind(this, 'url:' + i)}/>
          </div>
        );
      });
    }

    return (
      <div className="container">
        {editing ?
          <div className="row"><i onClick={this.toggleEditing} className="glyphicon glyphicon-floppy-save" /></div>
          :
          <div className="row"><i onClick={this.toggleEditing} className="glyphicon glyphicon-edit" /></div>
        }
        <div className="row">
          <div className="col-md-2">ID:</div>
          <div className="col-md-10">
            {editing ?
              <input className="form-control" defaultValue={id} onChange={this.handleChange.bind(this, 'id')}/>
              :
              <span>{id}</span>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">About:</div>
          <div className="col-md-10">
            {editing ?
              <input className="form-control" defaultValue={about} onChange={this.handleChange.bind(this, 'about')}/>
              :
              <span>{about}</span>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">Login:</div>
          <div className="col-md-10">
            {editing ?
              <input className="form-control" defaultValue={login} onChange={this.handleChange.bind(this, 'login')}/>
              :
              <span>{login}</span>
            }
          </div>
        </div>
        <div className="row">
          <div className="col-md-2">Follow Me:</div>
          <div className="col-md-10">{followMe}</div>
        </div>

       <div>
              <Dropzone onDrop={this.onDrop}>
                  <div>Click or drop picture here</div>
              </Dropzone>
          </div>

      </div>
    );
  }
}