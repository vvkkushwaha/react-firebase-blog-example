import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';

import { uploadImageCallBack } from '../../lib/firebaseHelper';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class BlogEditor extends Component {
    render() {
        const { editorState, onEditorStateChange } = this.props;
        return (
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    image: {
                        uploadCallback: uploadImageCallBack,
                        alt: { present: true, mandatory: false },
                    },
                }}
            />
        );
    }
}

export default BlogEditor;