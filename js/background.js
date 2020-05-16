/**
 * QuickMark 0.1.0
 *
 * @summary バックグラウンドで動作するjsファイル
 * 
 * インストール時に初期化したりショートカットキーの動作を行います。
 *
 * @author R-Az <raztechtech@gmail.com>
 * @copyright 2019 R-Az
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */


let QM;

/** 画面読み込み時にQMへQuickMarkクラスを代入する */
window.onload = async () => QM = await QuickMark.init();

/** Ctrl＋BでQuickMarkへ追加 Ctrl＋QでQuickMarkを開く */
chrome.commands.onCommand.addListener(command => {
  switch (command) {
    case "quickmark":
      addQuickMark();
      break;
    case "browseraction":
      openQuickMarkPage();
      break;
    case "directorySetting":
      openFolderPage();
      break;
  }
});

/** フォルダ画面を呼び出したり、ブックマークの保存領域を変更したりする */
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  switch (message.msg) {
    case "openDirectorySetting":
      openFolderPage();
      break;
    case "changeKey":
      QM.keyName = message.keyName;
      break;
  }
});

/** ステータスバーのアイコンをクリックするとQuickMarkの保存済リンクページが開く */
chrome.browserAction.onClicked.addListener(() => openQuickMarkPage());

/** 現在開いているタブのページタイトルとURLを取得してstorageへ保存 */
const addQuickMark = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async tabs => {
    const currentTab = tabs[0];
    if (currentTab == null) return;

    const pageTitle = currentTab.title;
    const url = currentTab.url;
    QM.addLink(pageTitle, url);
    changeIcon(currentTab.id);
  });
};

/** BrowserActionのアイコンをチェック済みに変える */
const changeIcon = currentTabId =>
  chrome.browserAction.setIcon({
    path: { "48": "icon/changedicon48px.png" },
    tabId: currentTabId
  });

/** QuickMarkの保存済リンクページをポップアップで表示 */
const openQuickMarkPage = () => {
  chrome.windows.create({
    url: "html/mainPage.html",
    width: 600,
    height: 400,
    type: "popup"
  });
};
/** QuickMarkのディレクトリ管理画面を表示 */
const openFolderPage = () => {
  chrome.windows.create({
    url: "html/folder.html",
    width: 300,
    height: 400,
    type: "popup"
  });
};
