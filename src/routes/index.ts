//@ts-nocheck
import { createRouter, createWebHashHistory } from "vue-router";
import * as View from "../views";

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
      name: "TokenCreate",
      path: "/TokenCreate",
      icon: "FireTwoTone",
      component: View.TokenCreate,
    },
    {
      name: "WalletGenerate",
      path: "/WalletGenerate",
      icon: "WalletTwoTone",
      component: View.WalletGenerate,
    },
    {
      name: "EntityCheck",
      path: "/EntityCheck",
      icon: "BuildTwoTone",
      component: View.EntityCheck,
    },
    {
      name: "HistoryCheck",
      path: "/HistoryCheck",
      icon: "ClockCircleTwoTone",
      component: View.HistoryCheck,
    },
    {
      name: "AddressQRCode",
      path: "/AddressQRCode",
      icon: "AppstoreTwoTone",
      component: View.AddressQRCode,
    },
    {
      name: "XRDFaucet",
      path: "/XRDFaucet",
      icon: "ExperimentTwoTone",
      component: View.XRDFaucet,
    },
    {
      name: "LocalSettings",
      path: "/LocalSettings",
      icon: "SettingTwoTone",
      component: View.LocalSettings,
    },
  ],
});

const RadixTool: RadixTool = window.RadixTool;

const CURRENT_PATH = await RadixTool.data.get("currentPath");

router.replace(CURRENT_PATH);

export default router;
