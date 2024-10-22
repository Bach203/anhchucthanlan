import React, { Component } from "react";
import { Layout, Menu } from "antd";

export default class Header extends Component {
  render() {
    return (
      <Layout.Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={new Array(15).fill(null).map((_, index) => {
            const key = index + 1;
            return {
              key,
              label: `nav ${key}`,
            };
          })}
        />
      </Layout.Header>
    );
  }
}
