import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Header from "../components/Header";

import { currentUser, loginByEmail } from '../lib/firebaseHelper';

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "", password: "", hasError: false,
            errormsg: "", isAuthenticated: false
        };
    }

    componentDidMount() {
        if (currentUser.currentUser) {
            console.log('currentUser: ', currentUser.currentUser);
            this.setState({ isAuthenticated: true });
        }
    }

    login = async () => {
        try {
            const { email, password } = this.state;
            const loginResponse = await loginByEmail(email, password);
            console.log("Response: ", loginResponse);
            this.setState({ isAuthenticated: true });
        } catch (error) {
            if (error.message) {
                this.setState({ hasError: true, errormsg: error.message });
            }
            console.log("Login Error: ", error);
        }
    }

    render() {
        const { hasError, errormsg, email, password, isAuthenticated } = this.state;
        const { from } = this.props.location.state || { from: { pathname: "/dashboard" } };

        if (isAuthenticated) {
            return <Redirect to={from} />;
        }
        return (
            <>
                <Header screenName={"login"} />
                <div className="container">
                    <div style={{
                        display: "flex", justifyContent: "center",
                        alignItems: "center",
                        flexDirection: 'column',
                        minHeight:500,
                    }}>
                        {hasError && <div className="alert alert-danger" role="alert">{errormsg}</div>}
                        <h3 style={{ color: '#ff4800' }}>Login</h3>
                        <div style={{
                            minWidth: 320, margin: 10, padding: 15, border: 1, borderColor: '#ff4800',
                            borderStyle: 'solid',
                            borderRadius: 5, minHeight: 50,
                            backgroundColor: 'whitesmoke',
                            boxShadow: 'rgba(0,0,0,0.25) 2px 2px'
                        }}>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                    <input type="email"
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(event) => this.setState({ email: event.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password</label>
                                    <input type="password"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(event) => this.setState({ password: event.target.value })}
                                    />
                                </div>

                                <button type="button"
                                    className="btn btn-success pull-right"
                                    onClick={this.login}
                                >Submit</button>
                            </form>

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default LoginScreen;