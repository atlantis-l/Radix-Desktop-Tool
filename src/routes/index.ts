//@ts-nocheck
import { createRouter, createWebHashHistory } from "vue-router";
import * as View from "../view";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "StartToUse",
      path: "/StartToUse",
      icon: "HomeTwoTone",
      component: View.StartToUse,
    },
    {
      name: "TokenTransfer",
      path: "/TokenTransfer",
      icon: "InteractionTwoTone",
      children: [
        {
          name: "multipleToMultiple",
          path: "multipleToMultiple",
          icon: "NumberOutlined",
          icons: [
            "UsergroupAddOutlined",
            "ArrowRightOutlined",
            "UsergroupAddOutlined",
          ],
          component: View.TokenTransfer.MultipleToMultiple,
        },
        {
          name: "singleToMultiple",
          path: "singleToMultiple",
          icon: "NumberOutlined",
          icons: ["UserOutlined", "ArrowRightOutlined", "UsergroupAddOutlined"],
          component: View.TokenTransfer.SingleToMultiple,
        },
        {
          name: "multipleToSingle",
          path: "multipleToSingle",
          icon: "NumberOutlined",
          icons: ["UsergroupAddOutlined", "ArrowRightOutlined", "UserOutlined"],
          component: View.TokenTransfer.MultipleToSingle,
        },
      ],
    },
    {
      name: "BalanceCheck",
      path: "/BalanceCheck",
      icon: "DollarCircleTwoTone",
      children: [
        {
          name: "singleWallet",
          path: "singleWallet",
          icon: "WalletOutlined",
          component: View.BalanceCheck.SingleWallet,
        },
        {
          name: "multipleWallets",
          path: "multipleWallets",
          icon: "WalletOutlined",
          component: View.BalanceCheck.MultipleWallets,
        },
      ],
    },
    {
      name: "WalletCreate",
      path: "/WalletCreate",
      icon: "WalletTwoTone",
      component: View.WalletCreate,
    },
    {
      name: "TokenCreate",
      path: "/TokenCreate",
      icon: "FireTwoTone",
      component: View.TokenCreate,
    },
    {
      name: "ManifestExecute",
      path: "/ManifestExecute",
      icon: "FileTextTwoTone",
      component: View.ManifestExecute,
    },
    {
      name: "PackageDeploy",
      path: "/PackageDeploy",
      icon: "CodeTwoTone",
      component: View.PackageDeploy,
    },
    {
      name: "XRDFaucet",
      path: "/XRDFaucet",
      icon: "ExperimentTwoTone",
      component: View.XRDFaucet,
    },
  ],
});

const RadixTool: RadixTool = window.RadixTool;

const CURRENT_PATH = await RadixTool.data.get("currentPath");

router.replace(CURRENT_PATH);

export default router;
