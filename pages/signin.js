import React from "react";
import Head from "../components/head/head";
import Nav from "../components/navbar/nav";

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Head title="로그인" />
        <Nav user={this.props.user} />
        <div className="myContainer">
          이건 로그인
          <a href={"/auth/kakao"} className="reg_sns_link">
            <button className="login_sns kakao">
              <img src="/static/images/svg/l_kakaotalk.svg" alt="" />
              <strong>카카오</strong>로 로그인
            </button>
          </a>
        </div>
      </div>
    );
  }
}
