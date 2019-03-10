import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { EditorState, convertToRaw, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import BlogEditor from '../components/BlogEditor';

import { currentUser, addBlog, getAllUserBlogs, getUserBlog, updateBlog, removeBlog } from '../lib/firebaseHelper';

class BlogListScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            newBlog: true,
            title: "",
            desc: "",
            blogKey: "",
            isAuthenticated: true,
            showCaseImage: "",
            isPublished: false,
            blogs: []
        };
    }

    clearEditor = () => {
        this.setState({
            editorState: EditorState.createEmpty(),
            newBlog: true,
            title: "",
            desc: "",
            blogKey: "",
            showCaseImage: "",
            isPublished: false
        });
    }

    async componentDidMount() {
        currentUser.onAuthStateChanged((user) => {
            if (!user) {
                this.setState({ isAuthenticated: false });
            }
        });
        this.getBlogs();
    }

    getBlogs = async () => {
        if (currentUser.currentUser) {
            const blogs = await getAllUserBlogs(currentUser.currentUser.uid);
            this.setState({ blogs })
        }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    saveBlog = async () => {
        const { editorState,
            newBlog,
            title,
            desc,
            blogKey,
            showCaseImage,
            isPublished } = this.state;

        const blog = {
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            title,
            desc,
            isPublished,
            showCaseImage,
            lastUpdateDate: new Date().getTime()
        }
        if (newBlog)
            await addBlog(blog);
        else {
            await updateBlog(blogKey, blog);
        }
        this.clearEditor();
        this.getBlogs();
    }

    deleteBlog = async (key) => {
        await removeBlog(key);
        this.getBlogs();
    }

    editBlog = async (key) => {
        const blogToEdit = await getUserBlog(key);
        const blog = blogToEdit[key];
        let editorState = EditorState.createEmpty();
        const contentBlock = convertFromHTML(blog.content);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock);
            editorState = EditorState.createWithContent(contentState);
        }
        this.setState({
            editorState,
            newBlog: false,
            title: blog.title,
            desc: blog.desc,
            blogKey: key,
            showCaseImage: blog.showCaseImage,
            isPublished: blog.isPublished
        });
    }

    render() {
        const { isAuthenticated, title, editorState, isPublished, desc, blogs, showCaseImage } = this.state;
        const { from } = this.props.location.state || { from: { pathname: "/" } };
        if (!isAuthenticated) {
            return <Redirect to={from} />;
        }
        return (

            <div>
                <nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-info" style={{justifyContent:"space-between"}}>
                    <a className="navbar-brand" href="/">Vivek's Blogs</a>
                    <a className="nav-link float-right" href="javascript:void(0);"  style={{ color: "#fff" }} onClick={async () => { await currentUser.signOut(); }}>Logout</a>
                </nav>
                <div className="container-fluid" style={{ backgroundColor: "#ffffff", padding: 2, marginTop: 80 }}>
                    <div className="row flex-xl-nowrap">
                        <main className="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content" style={{ borderRight: "1px dashed #777", paddingLeft: 25 }}>
                            <div className="page-header">
                                <h1>Blogs {title && <small>{title}</small>}</h1>
                            </div>
                            <div className="card card-info">
                                <div className="card-body">
                                    <form className="form-horizontal">
                                        <div className="form-group">
                                            <label htmlFor="inputTitle" className="col-sm-2 control-label">Title</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control"
                                                    value={title}
                                                    onChange={(event) => this.setState({ title: event.target.value })}
                                                    id="inputTitle" placeholder="Blog Title" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputurl" className="col-sm-2 control-label">Image Url</label>
                                            <div className="col-sm-10">
                                                <input type="text" className="form-control"
                                                    value={showCaseImage}
                                                    onChange={(event) => this.setState({ showCaseImage: event.target.value })}
                                                    id="inputurl" placeholder="Show case Image Url" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="inputdesc" className="col-sm-2 control-label">Description</label>
                                            <div className="col-sm-10">
                                                <textarea className="form-control" placeholder="Description"
                                                    value={desc}
                                                    onChange={(event) => this.setState({ desc: event.target.value })}
                                                    id="inputdesc" rows="3"></textarea>
                                            </div>
                                        </div>
                                        <div className="col-sm-offset-2 col-sm-10">
                                            <BlogEditor editorState={editorState}
                                                onEditorStateChange={this.onEditorStateChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-offset-2 col-sm-10">
                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" checked={isPublished ? "checked" : ""}
                                                            onChange={() => this.setState((prevState) => ({ isPublished: !prevState.isPublished }))}
                                                        /> Publish
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="col-sm-offset-2 col-sm-10">
                                                <button type="button" className="btn btn-outline-dark">Clear</button>
                                                &nbsp;&nbsp;
                                                <button type="button" className="btn btn-outline-dark" onClick={this.saveBlog}>Save</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                {/* <div className="panel-footer">Panel footer</div> */}
                            </div>
                        </main>
                        <div className="d-none d-xl-block col-xl-3 bd-toc">
                            <h3>
                                Previous Blogs</h3>
                            <ul className="list-group" style={{ width: "95%" }}>
                                {blogs.map((blog, index) => {
                                    return (<li key={"bl" + index} className="list-group-item">
                                        <a style={{
                                            display: "block",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap"
                                        }} >
                                            <b>{blog.title}</b>
                                        </a>
                                        <small>{new Date(blog.lastUpdateDate).toString()}</small>
                                        <div style={{ margin: 5 }}
                                            className="btn-toolbar float-right" role="toolbar" aria-label="...">
                                            <div className="btn-group mr-2" role="group">
                                                <button className="btn btn-sm btn-outline-dark"
                                                    onClick={() => this.editBlog(blog.key)}
                                                >
                                                    <i className="fas fa-pencil-alt"></i>
                                                </button>
                                            </div>
                                            <div className="btn-group" role="group">
                                                <button className="btn btn-sm btn-outline-dark"
                                                    onClick={() => this.deleteBlog(blog.key)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>);
                                })}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        );
    }

}

export default BlogListScreen;