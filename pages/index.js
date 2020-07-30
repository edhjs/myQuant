import React from "react";
import Link from "next/link";
import Head from "../components/head/head";
import Nav from "../components/navbar/nav";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Head title="마이퀀트" />
        <Nav user={this.props.user} />
        <div className="myContainer">이건 홈페이지</div>
      </div>
    );
  }
}
