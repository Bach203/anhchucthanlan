import React from "react";
import { Layout } from "antd";

export const CustomFooter: React.FC = () => {
  return (
    <Layout.Footer
      style={{
        left: 0,
        right: 0,
        textAlign: "center",
        bottom: 0,
        height: "15%",
        width: "100%",
        background: "#f0f0f0",
        zIndex: 1,
      }}
    >
      BeeSport ©2024 Created by SD-73
    </Layout.Footer>
  );
};
