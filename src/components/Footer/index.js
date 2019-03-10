import React from "react";

const Footer = () => (<footer className="container">
<div style={{borderTop:"1px solid #ccc", padding:10, marginTop:20}}></div>
<p>&copy; Vivek's Blogs {new Date().getFullYear()}</p>
</footer>);

export default Footer;