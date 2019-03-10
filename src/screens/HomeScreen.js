import React, { PureComponent } from "react";
import ReactHtmlParser from 'react-html-parser';

import { getLatest, getAllBlogs, getBlog } from '../lib/firebaseHelper';

import Header from "../components/Header";
import Footer from "../components/Footer";

export default class HomeScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { mainblog: null, allblogs: [] };
    }

    async componentDidMount() {
        const mainBlog = await getLatest();
        this.setState({ mainBlog }, async () => {
            const allblogs = await getAllBlogs();
            this.setState({ allblogs });
        });
    }

    loadBlog = async(key)=>{
        const mainBlog = await getBlog(key);
        this.setState({mainBlog});
    }

    render() {
        const { mainBlog, allblogs } = this.state;
        return (
            <>
                <Header />
                <main role="main" style={{ marginTop: 80 }}>
                    {mainBlog &&
                        <div className="container">
                            <div className="jumbotron">
                                <h1 className="display-4">{mainBlog.title}</h1>
                                <p className="lead">{mainBlog.desc}</p>
                                <hr className="my-4" />
                                <p>{new Date(mainBlog.lastUpdateDate).toString().substr(0, 16)}</p>
                            </div>
                            <div className="card">
                                {mainBlog.showCaseImage &&
                                    <img className="card-img-top" src={mainBlog.showCaseImage} alt="Card cap" />}
                                <div className="card-body">
                                    {/* <h5 className="card-title">Card title</h5> */}
                                    {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                                    {ReactHtmlParser(mainBlog.content)}
                                </div>
                                {/* <ul className="list-group list-group-flush">
                                    <li className="list-group-item">Cras justo odio</li>
                                    <li className="list-group-item">Dapibus ac facilisis in</li>
                                    <li className="list-group-item">Vestibulum at eros</li>
                                </ul> */}
                            </div>
                            {allblogs &&
                                <div className="row mb-2 mt-2">
                                    {allblogs.map((blog, index) => {
                                        if(blog.lastUpdateDate !== mainBlog.lastUpdateDate){
                                        return (<div key={"bl"+index} className="col-md-6">
                                            <div style={{minHeight:250}} className="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                                                <div className="col p-4 d-flex flex-column position-static">
                                                    {/* <strong className="d-inline-block mb-2 text-success">User name</strong> */}
                                                    <h3 className="mb-0">{blog.title}</h3>
                                                    <div className="mb-1 text-muted">{new Date(blog.lastUpdateDate).toString().substr(0, 16)}</div>
                                                    <p className="card-text mb-auto">{blog.desc}</p>
                                                    <a href="javascript:void(0);" onClick={()=>this.loadBlog(blog.key)} className="stretched-link">Continue reading</a>
                                                </div>
                                                <div className="col-auto d-none d-lg-block">
                                                    {blog.showCaseImage &&
                                                        <img className="bd-placeholder-img" width="200" height="250" src={blog.showCaseImage} />
                                                    }
                                                </div>
                                            </div>
                                        </div>);
                                        }
                                        else 
                                        {
                                            return null;
                                        }
                                    })}
                                </div>
                            }
                        </div>
                    }
                </main>
                <Footer />
            </>
        );
    }
}