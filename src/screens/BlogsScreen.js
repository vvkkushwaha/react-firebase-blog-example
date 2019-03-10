import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Link } from 'react-router-dom';

import { getLatest, getAllBlogs, getBlog } from '../lib/firebaseHelper';

class BlogsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { blogs: [], mainblog: null, allblogs: [] };
    }

    async componentDidMount() {
        const blogs = await getLatest();
        const allblogs = await getAllBlogs();
        this.setState({ blogs: blogs, mainBlog: blogs[0], allblogs: allblogs });
    }

    async componentDidUpdate() {
        const { blogKey } = this.props.match.params
        if (blogKey) {
            const mainBlog = await getBlog(blogKey);
            this.setState({ mainBlog: mainBlog[blogKey] });
        }
    }

    render() {
        const { blogs, mainBlog, allblogs } = this.state;
        const { blogKey } = this.props.match.params
        return (
            <div style={{ borderTop: "1px solid #f7f7f7" }}>
                <div className="container" style={{ backgroundColor: "#ffffff", padding: 2 }}>
                    {mainBlog &&
                        <>
                            <div className="page-header">
                                <h2>{mainBlog.title} <br /><small>{mainBlog.desc}</small></h2>
                                <small>{new Date(mainBlog.lastUpdateDate).toString().substr(0, 16)}</small>
                            </div>
                            {ReactHtmlParser(mainBlog.content)}
                        </>
                    }
                    {allblogs &&
                        <div style={{ padding: 20 }}>
                            <h5 className="text-center">More blogs</h5>
                            <ul className="list-inline" style={{ width: "80%", margin: "0 auto" }}>
                                {allblogs.map((blog, index) => {
                                    return (<li key={"bl" + index}>
                                        <Link style={{
                                            display: "block",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            width: 200,
                                            marginRight: 20
                                        }}
                                            to={`/blogs/${blog.key}`}
                                        >
                                            <b>{blog.title}</b>
                                        </Link>
                                        <small>{new Date(blog.lastUpdateDate).toString().substr(0, 16)}</small>
                                    </li>);
                                })}
                            </ul>
                        </div>
                    }
                </div>
            </div>
        );
    }
}


export default BlogsScreen;