import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Dropzone from 'react-dropzone';
import {get} from 'lodash'


export default class PhotoEditor extends Component{

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

    toggleEditing() {
        const { editing, id, about, login, follow_me_urls } = this.state;
        this.setState({ editing: !this.state.editing})
    }
    onUploadPhoto(){
        let {image_path}  = this.state;
        this.props.saveMetaData({ image_path });
    }
    onDrop(files) {
        let image_path  = get(files,'[0].preview',null);
        this.setState({
            image_path : image_path
        });
    }

    onOpenClick () {
        this.refs.dropzone.open();
    }

    render() {
        let { id, image_path,  editing } = this.state;
        return (
            <div className="container">
                <div className="photo-container">
                    <div className="title"><h2>Profile picture information</h2></div>
                    {editing ?
                        <div><i onClick={this.toggleEditing} className="glyphicon glyphicon-floppy-save" /></div>
                        :
                        <div><i onClick={this.toggleEditing} className="glyphicon glyphicon-edit" /></div>
                    }
                    {
                        editing ?
                            <div>
                                <div className="upload"><button onClick={this.onUploadPhoto}>Upload</button></div>
                                <div><Dropzone ref="dropzone" onDrop={this.onDrop}>
                                    <div>Drop or click here to choose a picture</div>
                                </Dropzone></div>
                            </div> : null
                    }
                    {
                        image_path  ? <div className="photo-wrapper"><img className="photo" src={image_path} /></div> : null
                    }
                </div>
            </div>
        );
    }
}