/**
 * QuickMark 0.1.0
 *
 * @summary QMUtilクラスを保持するjsファイル。
 *
 * @description
 * QMUtilはQuickMarkの汎用的なクラスを扱う。
 *
 * @export QuickMark,QMUtil
 * @author R-Az <raztechtech@gmail.com>
 * @copyright 2019 R-Az
 * @license  http://www.opensource.org/licenses/mit-license.html MIT License
 */

/**
 * QuickMarkに関する共通の処理をまとめたクラス。インターフェースを用意して、継承させる方が良い気もするが、取り敢えず完成を優先する。
 * @export
 * @class QMUtil
 */
class QMUtil {
  /**
   * cssクラスを付け替えすることでボタンが選択されていることを明らかにする。
   * @static
   * @param {String} selectedKey
   * @memberof QMUtil
   */
  static changeButtonColor(selectedKey) {
    const selectedButton = document.getElementById(selectedKey);
    if (selectedButton == null) return;
    const sideList = document.querySelectorAll(".selected_button");
    sideList.forEach(button => button.classList.toggle("selected_button"));
    selectedButton.classList.toggle("selected_button");
  }

  /**
   * .checkListのcheckedを全てtrueにする。ただし、全てtrueの時はfalseにする。
   * @static
   * @memberof QMUtil
   */
  static allcheckAddListener() {
    document.getElementById("allcheck").addEventListener("click", () => {
      const list = document.querySelectorAll(".checkList");
      let checkedNum = 0;
      for (const checkbox of list) {
        if (checkbox.checked) checkedNum++;
      }
      const checkedBool = !(checkedNum === list.length);
      for (const checkbox of list) {
        checkbox.checked = checkedBool;
        document.getElementById("allcheck").checked = checkedBool;
      }
    });
  }
}
