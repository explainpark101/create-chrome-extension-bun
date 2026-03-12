// manifest v3
// this file will be automatically built into `manifest.json`
import { flatIterdir } from "../scripts/utils/manifest";
import path from "node:path";

export const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Test Extension",
  version: "0.0.0.1",
  description: "Test Extension",
  icons: {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },
  action: {
    default_icon: {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png",
    },
    default_popup: "popup/index.html",
    default_title: "Test Extension",
  },
  permissions: [],
  host_permissions: ["<all_urls>"],
  background: {
    service_worker: "background.ts",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["content.ts"],
      run_at: "document_idle",
    },
  ],
  web_accessible_resources: [
    {
      // popup 폴더 내의 모든 파일을 웹 액세스 가능하게 설정
      resources: (
        await flatIterdir(path.join(__dirname, "popup"))
      ),
      matches: ["<all_urls>"],
      use_dynamic_url: true,
    },
  ],
};
