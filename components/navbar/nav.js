import React from "react";
import Link from "next/link";
import styled from "styled-components";
const links = [
  { href: "/mypage", label: "내 공식" },
  { href: "/signin", label: "로그인" },
  { href: "/signup", label: "회원가입" }
].map(link => {
  link.key = `nav-link-${link.href}-${link.label}`;
  return link;
});

const Nav = props => (
  <NavBar>
    <ul className="navBlock">
      <li>
        <Link prefetch href="/">
          <a>Home</a>
        </Link>
      </li>
      <ul>
        {links.map(({ key, href, label }) => {
          if (props.user && label === "로그인") {
            return (
              <li key={key}>
                <Link href={"/logout"}>
                  <a>{"로그아웃"}</a>
                </Link>
              </li>
            );
          } else
            return (
              <li key={key}>
                <Link href={href}>
                  <a>{label}</a>
                </Link>
              </li>
            );
        })}
      </ul>
    </ul>
  </NavBar>
);

export default Nav;

const NavBar = styled.nav`
  text-align: center;
  background-color: black;
  .navBlock {
    padding: 16px;
  }
  ul {
    display: flex;
    justify-content: space-between;
    padding: 0px 16px;
  }
  li {
    display: flex;
    padding: 6px 8px;
  }
  a {
    color: white;
    text-decoration: none;
    font-size: 13px;
  }
`;
