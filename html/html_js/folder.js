/**
 * QuickMark 0.1.0
 *
 * @summary folder.htmlに付随するjsファイル。
 *
 * @description
 * フォルダを管理する。
 * フォルダの生成・削除・選択（リンクの保存先）ができる。
 *
 * @author R-Az <raztechtech@gmail.com>
 * @copyright 2019 R-Az
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 */

/** QuickMarkのObjectを格納する変数。*/
let QM;

/**
 * QuickMarkのオブジェクトをinit()から生成する。
 */
window.onload = async () => {
  QM = await QuickMark.init();
  QMUtil.allcheckAddListener();
  await deleteObject();
  toggleHiddenConfig();
  loadPage();
  loadPage();
};

/**
 * フォルダ作成用の領域を表示/非表示する
 */
document.getElementById("create").addEventListener("click", () => document.getElementById("folder_create").classList.toggle("hidden"));

/**
 * 設定用の要素を表示/非表示する
 */
document.getElementById("config").addEventListener("click", () => toggleHiddenConfig());

// フォルダを作成して、ページの再読み込みをする
document.getElementById("folder_make").addEventListener("click", async () => {
  const folderName = document.getElementById("folder_name").value;
  if (!(folderName == null || folderName === "")) {
    await QM.addFolder(folderName);
    toggleHiddenConfig();
    loadPage();
  }
});

/**
 * フォルダ名の読み込みとリスナーの登録を同時に行う。
 */
const loadPage = async () => {
  const directoryData = QM.quickMarkMain;
  const mainList = document.getElementById("mainlist");
  mainList.innerHTML = "";
  if (directoryData == null) return;

  for (const key of Object.keys(directoryData)) {
    const mainButton = `<input type="checkbox" value="${key}" class="checkList setting hidden"/><button type="button" value="${key}" id="${key}">${key}</button><br>`;
    mainList.insertAdjacentHTML("beforeend", mainButton);

    /** フォルダ名をクリックすると、保存用のフォルダを指定する。*/
    const link = document.getElementById(key);
    link.addEventListener("click", async () => {
      await QM.setSelectedKey(key);
      window.close();
    });
  }
  QMUtil.changeButtonColor(QM.keyName);
};

/**
 * cssのhiddenclassを付け替えすることで表示/非表示を切り替える。
 */
const toggleHiddenConfig = () => {
  const hiddenList = document.querySelectorAll(".setting");
  for (const selecter of hiddenList) {
    selecter.classList.toggle("hidden");
  }
  document.getElementById("folder_create").classList.add("hidden");
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
    await QM.deleteFolder(deleteList);
  });
};