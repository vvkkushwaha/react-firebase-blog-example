import React from "react";
import {Link} from "react-router-dom";
 
const Header = ({screenName}) =>(<nav className="navbar navbar-expand-lg fixed-top navbar-dark bg-info">
<a className="navbar-brand" href="/">Vivek's Blogs</a>
<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" 
aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
</button>

<div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
        <li className={ !screenName ? "nav-item active": "nav-item"}>
            <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
        </li>
        <li className={`nav-item ${screenName && screenName ==="login" && "active"}`}>
            <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
        </li>
    </ul>
</div>
</nav>);

export default Header;