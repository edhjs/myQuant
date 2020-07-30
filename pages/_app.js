import React, { Fragment } from "react";
import App from "next/app";
import { GlobalStyle } from "../static/global_style.js";

class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      user: props.pageProps.user,
      os: ""
    };
  }
  componentDidMount() {
    if (this.props.error) {
      switch (this.props.error) {
        case "already user":
          this.setToast("danger", "이미 일반회원으로 가입한 계정입니다");
          break;
        case "already coach":
          this.setToast("danger", "이미 코치회원으로 가입한 계정입니다");
          break;
        case "permission denied":
          this.setToast("danger", "접근 권한이 없습니다. 로그인해주세요");
          break;
      }
    }
    window.onpageshow = function(event) {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.onpageshow = function(event) {
      if (event.persisted) {
        console.log("BFCahe로부터 복원됨");
      } else {
        console.log("새로 열린 페이지");
      }
    };
  }
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    if (ctx.req && ctx.req.session && ctx.req.session.passport) {
      pageProps.user = ctx.req.session.passport.user;
    }
    return { pageProps, error: ctx.query.error ? ctx.query.error : undefined };
  }
  render() {
    const { Component, pageProps } = this.props;
    const props = {
      ...pageProps,
      user: this.state.user
    };
    return (
      <Fragment>
        <GlobalStyle blackColor />
        <Component {...props} {...this.state} />
      </Fragment>
    );
  }
}
export default MyApp;
