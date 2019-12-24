/**
 * QuickMark 0.1.0
 *
 * @summary QuickMarkクラスを保持するjsファイル。
 *
 * @description
 * QuickMarkクラスはデータを一時的に保持し、this.storageを通してデータの管理をします。
 *
 * @export QuickMark,QMUtil
 * @author R-Az <raztechtech@gmail.com>
 * @copyright 2019 R-Az
 * @license  http://www.opensource.org/licenses/mit-license.html MIT License
 */

/**
 * chrome.storageからデータを取得し、そのデータを加工したり保持するクラス。
 *
 * @description
 * データは下記の二種類
 * Main→ファイル名・URL・ページタイトルを保存する。
 * {[quickMarkMain]:{フォルダ名:{ページタイトル:URL}}}の形式で保存する。
 * Config→設定（選択しているフォルダ名等）を保存する。
 * {[quickMarkConfig]:{selectedkey:{ページタイトル:URL}}}の形式で保存する。
 * 
 * @property {String} storage syncかlocalどちらへ保存するかを保持する。
 * @property {String} selectedKey 現在選択中のフォルダ名を保持する。
 * @property {Object} quickMarkMain ファイル名とブックマークデータを保持する。
 * @class QuickMark
 */

class QuickMark {
  /**
   * プロパティを定義はするがasyncを使う必要があるため、init()に実際の処理は任せる。
   * 
   * @memberof QuickMark
   */
  constructor() {
    this.storage;
    this.selectedKey;
    this.quickMarkMain;
  }

  /**
   * 実際のコンストラクタ。オブジェクトを生成したい時はこちらを使う。
   * 
   * @static
   * @returns　{Object} クラスQuickMarkのObject
   * @constructor
   * @memberof QuickMark
   */
  static async init() {
    const quickMark = new QuickMark();
    quickMark.storage = await QMStorage.init();
    quickMark.selectedKey = await quickMark.storage.loadSelectedKey();
    quickMark.quickMarkMain = await quickMark.storage.loadMain();
    return quickMark;
  }

  /** 
   * ブックマークデータのゲッタ。
   * 
   * @readonly
   * @memberof QuickMark
   */
  get main() { return this.quickMarkMain; }

  /** 
   * 選択中のフォルダ（保存用Key）のゲッタ。
   * @memberof QuickMark
   */
  get keyName() { return this.selectedKey; }

  /** 
   * 選択中のフォルダ（保存用Key）のセッタ。
   * 
   * @memberof QuickMark
   */
  set keyName(key) { this.selectedKey = key; }

  /** 
   * 選択中のフォルダ（保存用Key）を変更する。
   * 
   * @memberof QuickMark
   */
  async setSelectedKey(key) {
    await this.reloadMain();
    this.selectedKey = key;
    await this.storage.saveSelectedKey(key);
  }

  /**
   *  ブックマークデータを更新する。
   */
  async reloadMain() {
    this.quickMarkMain = await this.storage.loadMain();
  }

  /**
   * ブックマークを追加する。
   * 
   * @param  {String} pageTitle ページ名
   * @param  {String} url URL
   * @memberof QuickMark
   */
  async addLink(pageTitle, url) {
    await this.reloadMain();
    this.quickMarkMain[this.selectedKey][pageTitle] = url;
    await this.storage.saveMain(this.quickMarkMain);
  }

  /**
   * 保存領域（フォルダ）を追加する。
   * 
   * @param  {String} folderName フォルダ名
   * @memberof QuickMark
   */
  async addFolder(folderName) {
    await this.reloadMain();
    this.quickMarkMain[folderName] = {};
    this.key = folderName;
    await this.storage.saveMain(this.quickMarkMain);
  }

  /**
   * ブックマークを削除する。
   * 
   * @param  {Array} deleteList 削除するブックマークのリスト
   * @memberof QuickMark
   */
  async deleteLink(deleteList) {
    for (const key of deleteList) {
      delete this.quickMarkMain[this.selectedKey][key];
    }
    await this.storage.saveMain(this.quickMarkMain);
  }

  /**
  * 削保存領域（フォルダ）を削除する。
  * 
  * @param  {Array} deleteList 削除するブックマークのリスト
  * @memberof QuickMark
  */
  async deleteFolder(deleteList) {
    for (const key of deleteList) {
      delete this.quickMarkMain[key];
    }
    await this.storage.saveMain(this.quickMarkMain);
  }
}
