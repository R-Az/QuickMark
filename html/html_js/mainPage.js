/**
 * QuickMark 0.1.0
 *
 * @summary mainPage.htmlに付随するjsファイル。
 *
 * @description
 * QuickMarkのメイン機能で、リンクを読み込む。
 * リンクの削除・クリップボードへのコピーもする。
 *
 * @author R-Az <raztechtech@gmail.com>
 * @copyright 2019 R-Az
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */

/** QuickMarkのObjectを格納する変数*/
let QM;
/**
 * QuickMarkのオブジェクトをinit()から生成する。
 */
window.onload = async () => {
  QM = await QuickMark.init();
  QMUtil.allcheckAddListener();
  await deleteObject();
  loadMain();
  loadPage();
};

/**
 * background.jsへメッセージを送り、folder.htmlを開く
 */
document.getElementById("folder").addEventListener("click", () =>
  chrome.runtime.sendMessage({ msg: "openDirectorySetting" })
);

/**
 * QMのquickMarkMainを更新してから再読み込み
 */
document.getElementById("reload").addEventListener("click", async () => {
  await QM.reloadMain();
  loadPage();
});

/**
 * 2カラム構成なので、sideBar（フォルダ名）とmain（ページタイトルとリンク）を別々に読み込む。
 */
const loadPage = () => {
  loadSidebar();
  loadMain();
};

/**
 * フォルダ名の読み込みとリスナーの登録を同時に行う。
 */
const loadSidebar = () => {
  const directoryData = QM.main;
  const sideDirectory = document.getElementById("sidebarList");
  sideDirectory.innerHTML = "";
  if (directoryData == null) return;

  for (const key of Object.keys(directoryData)) {
    const buttonHTML = `<li><button type="button" value="${key}" id="${key}">${key}</button><li>`;
    sideDirectory.insertAdjacentHTML("beforeend", buttonHTML);

    /**
     * 選択フォルダ名を更新し、それに合わせてフォルダを読み込む。
     */
    const directoryButton = document.getElementById(key);
    directoryButton.addEventListener("click", async () => {
      QM.keyName = key;
      loadMain();
    });
  }
};

/**
 * ページタイトルの読み込みとそのリスナーの登録を同時に行う。
 */
const loadMain = () => {
  const linkData = QM.main[QM.keyName];
  const linkList = document.getElementById("linklist");
  linkList.innerHTML = "";
  if (linkData == null) return;

  Object.keys(linkData).forEach((key, index) => {
    const mainButton = `<input type="checkbox" value="${key}" class="checkList"/><button type="button" value="${linkData[key]}" id="link${index}">${key}</button><br>`;
    linkList.insertAdjacentHTML("beforeend", mainButton);

    /** ページタイトルのボタンから、直近に開いていたWindowへリンクを開く。*/
    const link = document.getElementById(`link${index}`);
    link.addEventListener("click", () =>
      chrome.tabs.create({ url: link.value })
    );
  });

  QMUtil.changeButtonColor(QM.keyName);
};

/**
 * .checkListの中からcheckboxがtrueな物を削除する。
 */
const deleteObject = async () => {
  document.getElementById("delete").addEventListener("click", async () => {
    const checkList = document.querySelectorAll(".checkList");
    const deleteList = [];
    for (const checkbox of checkList) {
      if (checkbox.checked) {
        deleteList.push(checkbox.value);
      }
    }
    await QM.deleteLink(deleteList);
  });
};
