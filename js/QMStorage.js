/**
 * QuickMark 0.1.0
 *
 * @summary QuickMarkクラスとQMUtilクラスを保持するjsファイル。
 *
 * @description
 * QMStorageクラスはデータの読み込み・保存を行う。
 *
 * @author R-Az <raztechtech@gmail.com>
 * @copyright 2019 R-Az
 * @license  http://www.opensource.org/licenses/mit-license.html MIT License
 */


/**
 * chrome.storageからデータを取得するクラス
 *
 * @description
 * データは下記の二種類
 * Main→ファイル名・URL・ページタイトルを保存する。
 * {quickMarkMain:{フォルダ名:{ページタイトル:URL}}}の形式で保存する。
 * Config→設定（選択しているフォルダ名等）を保存する。
 * {quickMarkConfig:{selectedkey:{ページタイトル:URL}}}の形式で保存する。
 *
 * @property {Object} storage chrome.storageの保存領域をsyncかlocalで保持する。
 * @class QMStorage
 */

class QMStorage {
  constructor() {
    this.storage = "a";
  }

  static async init() {
    const qmStorage = new QMStorage();
    qmStorage.storage = chrome.storage.sync;
    await new Promise(async (resolve, reject) => {
      chrome.storage.sync.get(QMStorage.QUICK_MARK_CONFIG, async result => {
        if (chrome.runtime.lastError) {
          alert(QMStorage.ALERT_MESSAGE + chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else if (result[QMStorage.QUICK_MARK_CONFIG] == undefined) {
          await qmStorage.makeQuickMarkData();
        } else {
          if (result[QMStorage.QUICK_MARK_CONFIG]["STORAGE"] == "LOCAL") {
            qmStorage.storage = chrome.storage.local;
          }
        }
        resolve('sucess');
      });
    });
    return qmStorage;
  }

  /**
   * フォルダ名・URL・ページタイトルを保存するObjectをstorageから呼び出すためのKey。
   * 今後コメントではMAINと呼称する。
   *
   * @readonly
   * @memberof QMStorage
   */
  static get QUICK_MARK_MAIN() { return "quickMarkMain"; }

  /**
   * 設定を保存するObjectをstorageから呼び出すためのKey。
   * 今後コメントではCONFIGと呼称する。
   *
   * @readonly
   * @memberof QMStorage
   */
  static get QUICK_MARK_CONFIG() { return "quickMarkConfig"; }

  /**
   * 設定用Objectへユーザーが選択したファイル名を保存する用のKey。
   *
   * @readonly
   * @memberof QMStorage
   */
  static get SELECTED_KEY() { return "selectedKey"; }

  /**
   * エラー用メッセージの定型文。
   *
   * @readonly
   * @memberof QMStorage
   */
  static get ALERT_MESSAGE() { return "エラーが発生しました。次のメッセージを開発者にお伝えください。"; }

  /**
   * storageからmainのObjectを取得し、保存用Keyを取り除いて返す。
   *
   * @memberof QMStorage
   */
  async loadMain() {
    const main = await this.loadFromStorage(QMStorage.QUICK_MARK_MAIN);
    return main[QMStorage.QUICK_MARK_MAIN];
  }

  /**
   * storageからconfigのObjectを取得し、保存用Keyを取り除いて返す。
   * @memberof QMStorage
   */
  loadConfig() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([QMStorage.QUICK_MARK_CONFIG], result => {
        if (chrome.runtime.lastError) {
          alert(QMStorage.ALERT_MESSAGE + chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(result[QMStorage.QUICK_MARK_CONFIG]);
        }
      });
    });
  }

  /**
   * ユーザーが指定しているファイル名をConfigから取得する。
   *
   * @returns {String} 現在ユーザーが選んでいるファイル（ObjectのKey名）
   * @memberof QMStorage
   */
  async loadSelectedKey() {
    const quickMarkConfig = await this.loadConfig();
    return quickMarkConfig[QMStorage.SELECTED_KEY];
  }

  /**
   * storageのmainへmainObjを保存する。
   *
   * @param {Object} mainObj
   * @memberof QMStorage
   */
  async saveMain(mainObj) {
    await this.saveToStorage(mainObj, QMStorage.QUICK_MARK_MAIN);
  }

  /**
   * storageのconfigへconfigObjを保存する
   *
   * @static
   * @param {Object} configObj
   * @memberof QMStorage
   */
  async saveConfig(configObj) {
    await this.saveToStorage(configObj, QMStorage.QUICK_MARK_CONFIG);
  }

  /**
   * ユーザーが指定したファイル名をstorageへselectedKeyへ保存する。
   *
   * @param {String} key ユーザーが選んだファイル名
   * @memberof QMStorage
   */
  async saveSelectedKey(key) {
    const quickMarkConfig = await this.loadConfig();
    quickMarkConfig[QMStorage.SELECTED_KEY] = key;
    await this.saveToStorage(quickMarkConfig, QMStorage.QUICK_MARK_CONFIG);
    chrome.runtime.sendMessage({ msg: "changeKey", keyName: key });
  }

  /**
   * objectKeyで指定したObjectをstorageから読み込む。
   *
   * @param {String} objectKey storageの取得先を指定する　getterを使った定数、CONFIGかMAINを入れる
   * @returns {Promise} storageから値を取得できなければ、エラーメッセージが表示される。
   * @memberof QMStorage
   */
  loadFromStorage(objectKey) {
    return new Promise((resolve, reject) => {
      this.storage.get([objectKey], result => {
        if (chrome.runtime.lastError) {
          alert(QMStorage.ALERT_MESSAGE + chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * objectKey→key,quickMarkObj→valueのObjectを生成し、それをstorageへ保存する。
   * 
   * @param {Object} quickMarkObj 保存するMainかConfigのobject
   * @param {String} objectKey storageの保存先を指定する。getterを使った定数、CONFIGかMAINを入れる。
   * @returns {Promise} storageへ保存でき無ければ、エラーメッセージが表示される。
   * @memberof QMStorage
   */
  saveToStorage(quickMarkObj, objectKey) {
    const objectPlusKey = {
      [objectKey]: quickMarkObj
    };
    return new Promise((resolve, reject) => {
      this.storage.set(objectPlusKey, () => {
        if (chrome.runtime.lastError) {
          alert(ALERT_MESSAGE + chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          resolve(objectPlusKey);
        }
      });
    });
  }
  /**
   * 初期化用のQuickMarkのデータを作成し、syncに保存する。
   * 
   * @static
   * @memberof QMStorage
   */
  async makeQuickMarkData() {

    const initQuickMarkMainObj = {
      "default": {}
    };
    const initQuickMarkConfigObj = {
      [QMStorage.SELECTED_KEY]: "default",
      STORAGE: "SYNC"
    }

    await this.saveMain(initQuickMarkMainObj);
    await this.saveConfig(initQuickMarkConfigObj);
  }

}
