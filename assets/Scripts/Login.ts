import {
  _decorator,
  Component,
  Node,
  WebView,
  Label,
  Sprite,
  SpriteFrame,
  Animation,
  Button,
  Prefab,
  instantiate,
  Vec3,
  EditBox,
} from "cc";
import { CheckTimeCode } from "./CheckTimeCode";
import { MainAction } from "./MainAction";
import { ManagerSound } from "./ManagerSound";
import { Tutorial } from "./Tutorial";

const { ccclass, property } = _decorator;

var intervalUpdateUID;
export class DataUserLogin {
  readonly id: string;
  readonly status: boolean;
  readonly expireTime: Date;
  readonly countDevice:number

  public static getid: string;
  public static getStatus: boolean;
  public static getExpireTime: Date;
  public static getCountDevice:number;

  constructor(_id: string, _status: boolean, _dateTime: Date,_count:number) {
    this.id = _id;
    this.status = _status;
    this.expireTime = _dateTime;
    this.countDevice = _count;

    DataUserLogin.getStatus = this.status;
    DataUserLogin.getExpireTime = this.expireTime;
  }
  public GetTime() {
    return DataUserLogin.getExpireTime.getTime();
  }
}

const dataPost = {
  code: "demo",
};

const urlPost =
  "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/user";
const urlGetTime =
  "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/time";
const urlGetDialog =
  "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/dialog";
const urlGetPer =
  "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/percent/Y69jiY5eyTRBX0NKh1Db";

function getUrlUpdate(_id: string): string {
  return (
    "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/user/" + _id
  );
}
function getUrlUpdateUID(_id: string): string {
  return (
    "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/user/code/uid/" + _id
  );
}
function postUrlUpdateUID(_id: string): string {
  return (
    "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/user/uid/" + _id
  );
}

@ccclass("Login")
export class Login extends Component {
  static _instance: Login;

  static get instance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new Login();
    return this._instance;
  }

  @property(Node)
  loginPage: Node = null!;

  @property(Node)
  mainPage: Node = null!;

  @property(Node)
  popupUrl: Node = null!;

  @property(Node)
  loadingPage: Node = null!;

  @property(Node)
  tutorialBtn: Node = null!;

  @property(Node)
  notificationPage: Node = null!;
  @property(Node)
  notificationLukgeaw: Node = null!;

  @property(EditBox)
  codeLabel: EditBox = null!;

  @property(EditBox)
  urlGameEdit: EditBox = null!;

  @property(Label)
  timeCodeEnd: Label = null!;


  @property(Sprite)
  notiSP: Sprite = null!;
  @property(Sprite)
  notiSPLukgeaw: Sprite = null!;
  @property(SpriteFrame)
  notiSPfdefault: SpriteFrame = null!;

  @property(SpriteFrame)
  notiSPftimeOut: SpriteFrame = null!;
  @property(SpriteFrame)
  notiSPWarningActive: SpriteFrame = null!;
  @property(SpriteFrame)
  notiSPDuplicate: SpriteFrame = null!;
  @property(MainAction)
  pgBar: MainAction = null!;

  @property(Animation)
  animMainPage: Animation = null!;
  @property(Animation)
  animNotiPage: Animation = null!;


  @property(Animation)
  animNotiWarning: Animation = null!;
  @property(Button)
  notiWarningBtnClick: Button = null!;

  @property(Button)
  codeBtnClick: Button = null!;
  @property(Button)
  urlBtnClick: Button = null!;
  @property(Button)
  notiBtnClick: Button = null!;

  @property(Prefab)
  webViewPrefab: Prefab = null!;
  @property(Node)
  PosWebView: Node = null!;
  @property(Node)
  loadGetTexture: Node = null!;

  isCheckDialog: boolean = false;
  isCheckPecent: boolean = false;
  isCheckTime: boolean = false;
  isTutorial:boolean = false;

  dataGet = <DataUserLogin>{};

  timeResetCal: number = 20;
  pageActive: number = 1;
  countActiveDevice:number = 0;
  countCheckDuplicate:number=0;

  _listDialogMeowG: string[] = [];
  _listDialogMeowY: string[] = [];

  _nodeArr: Node[] = [];
  _listPer: string[] = [];
  _listDialog: string[] = [];

  onLoad() {  
    Login._instance = this;
    
  }
  Init() {
    this.codeLabel.string = "";
    this.notificationPage.active = false;
    this.loginPage.active = true;
    this.mainPage.active = false;
    this.loadingPage.active = false;
    this.loadGetTexture.active = false;
    this.notiBtnClick.node.active =true;
    this.notiWarningBtnClick.node.active =true;
    this.pageActive = 1;
    this.countActiveDevice = 0;
    this.countCheckDuplicate = 0;
    this.animMainPage.play("Main");
    if(intervalUpdateUID){clearInterval(intervalUpdateUID);}

    console.log("Init");
  }
  //#region  GetVal

  GetTimeReset(): number {
    return this.timeResetCal;
  }

  GetDialogMeow(percent:number): string {
    return percent<=79? this._listDialogMeowY[Math.floor(Math.random() * this._listDialogMeowY.length)]:
           this._listDialogMeowG[Math.floor(Math.random() * this._listDialogMeowG.length)];
  }
  perIndex: number = 0;
  dialogFocusIndex: number = 0;

  GetPercentLukgeaw(): number {
    let val = this._listPer[this.perIndex];
    this.perIndex++;
    if (this.perIndex === this._listPer.length) {
      this.perIndex = 0;
    }
    return Number(val);
  }

  GetIDUser(){
    if(this.dataGet.id !=undefined){
      return this.dataGet.id;
    }
  }

  GetDialogFocus(): string {
    let val = this._listDialog[this.dialogFocusIndex];
    this.dialogFocusIndex++;
    if (this.dialogFocusIndex === this._listDialog.length) {
      this.dialogFocusIndex = 0;
    }
    return val;
  }
  //#endregion
  OnClickedLogin() {
    this.codeBtnClick.interactable = false;
    this.animMainPage.play("MainClose");
    this.tutorialBtn.active = false;
    if(this.isTutorial){
      Tutorial.instance.SetActiveTutorial(false);
    }
    setTimeout(() => {
      if (this.codeLabel.string) {
        
        this.loadingPage.active = true;
        
        dataPost.code = `code=${this.codeLabel.string}`;
        this.codeLabel.string = "";
        this.PostData();
        this.GetDialog();
      } else {
        this.NotiWrongAPI();
      }
    }, 800);
  }
  OnClickedEnterURL() {
    // this.urlGameEdit.string ="https://m.pg-demo.com/hood-wolf/index.html?language=en-US&bet_type=2&operator_token=8735ze6y8kp7jpwmxvau7gvytu3adwj4&from=https%3A%2F%2Fpublic.pg-redirect.com%2Fpages%2Fclose.html&__refer=m.pg-redirect.com&__sv=0";
    this.urlBtnClick.interactable = false;
    if(!this.isTutorial){
      this.animMainPage.play("UrlPageClose");
    }
    setTimeout(() => {
      if (
        this.urlGameEdit.string &&
        !this.urlGameEdit.string.includes("jacky") && 
        this.urlGameEdit.string.includes("http://") ||
        this.urlGameEdit.string.includes("https://")
      ) {
        this._nodeArr = [];
        let webViewIn: Node = null!;
        webViewIn = instantiate(this.webViewPrefab);
        webViewIn.setParent(this.PosWebView); 
        webViewIn.setPosition(new Vec3(0, -104.025, 0));
        webViewIn.getComponent(WebView).url = this.urlGameEdit.string;
        webViewIn.on(WebView.EventType.LOADED, this.callback, this);
        this._nodeArr.push(webViewIn);
        if(this.isTutorial){
          Tutorial.instance.SetStateTutorial(13);
          Tutorial.instance.OnClickedAnyTutorial();
        }else{
          this.NextToMainStage();
        }
        
      } else {
        this.NotiWrongAPI();
      }
    }, 800);
  }

  //#region Post
  
  PostData() {
    const xhr = new XMLHttpRequest();
    const json = dataPost.code;
    xhr.open("POST", urlPost, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText);
          this.dataGet = new DataUserLogin(res.id, res.status, res.expireTime,res.countDevice);
          this.countActiveDevice = 0;
          if (!res.status||res.countDevice > 1) {
            console.log("Status False or CountDevice");
            this.NotiWrongAPI();
            return;
          }

          if (res.timeStamp) {
            if (this.dataGet.status) {
              this.getTimeReset();
            } else {
              this.NotiWrongAPI();
            }
          } else {
            this.UpdateTime();
          }
        } else {
          this.NotiWrongAPI();
        }
      }
    };
    xhr.send(json);
  }

  UpdateUID(ev:()=>void){
    const xhr = new XMLHttpRequest();
    let toDay = new Date();
    const jsonData = `time=${toDay.toUTCString()}`
    xhr.open("POST", postUrlUpdateUID(this.dataGet.id), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
          var res = JSON.parse(xhr.responseText);
          if(res.countDevice >=1||window.name != res.uid){
            if(res.countDevice > this.countActiveDevice){
              this.countActiveDevice = res.countDevice;
              this.countCheckDuplicate ++;
              if(this.pageActive ==1 ||this.pageActive ==2){
                if(this.countCheckDuplicate >3){
                  console.log("DuplicateUser!!!");
                  this.NotiWrongAPI(false,true,false);
                }else{
                  this.NotiWrongAPI(false,true);
                  console.log("Warning: " + this.countCheckDuplicate);
                }
              }else{
                if(this.countCheckDuplicate >3){
                  console.log("DuplicateUser!!!");
                  this.NotiDuplicateActiveLukgeaw(true);
                }else{
                  this.NotiDuplicateActiveLukgeaw();
                  console.log("Warning: " + this.countCheckDuplicate);
                }
              }
            }         
          }else{
            ev();
          }
        } else {
          this.NotiWrongAPI();
        }
      }
    };
    xhr.send(jsonData);
  }

  UpdateTime() {
    const xhr = new XMLHttpRequest();
    let toDay = new Date();

    // const jsonData = `expireTime=${toDay.getFullYear()}/${
    //   toDay.getMonth() + 1
    // }/${toDay.getDate()} ${
    //   toDay.getHours() + 1
    // }:${toDay.getMinutes()}:${toDay.getSeconds()}`;
    toDay.setHours( toDay.getHours() +1);
    const jsonData = `expireTime=${toDay.toUTCString()}`

    xhr.open("POST", getUrlUpdate(this.dataGet.id), true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          this.dataGet = new DataUserLogin(
            this.dataGet.id,
            this.dataGet.status,
            toDay,
            this.dataGet.countDevice
          );
          this.getTimeReset();
        } else {
          this.NotiWrongAPI();
        }
      }
    };
    xhr.send(jsonData);
  }
  //#endregion
  
  //#region Get
  getTimeReset() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", urlGetTime, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText);
          this.timeResetCal = res.time;
          this.GetUIDStatus();
          //  OldVersion
          // this.loadingPage.active = false;
          // this.popupUrl.active = true;
          // this.pageActive = 2;
          // this.urlBtnClick.interactable = true;
          // this.animMainPage.play("UrlPageOpen");
          // this.tutorialBtn.active = true;
          
        } else {
          this.NotiWrongAPI();
        }
      }
    };
    xhr.send("");
  }

  GetUIDStatus(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", getUrlUpdateUID(this.dataGet.id), true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var res = JSON.parse(xhr.responseText);
          if(res.statusUID){
            if(this.isTutorial){
              Tutorial.instance.SetActiveTutorial(true);
            }
            //
            window.name = res.uid;
            this.UpdateUID(()=>{
            this.loadingPage.active = false;
            this.popupUrl.active = true;
            this.pageActive = 2;
            this.urlBtnClick.interactable = true;
            this.animMainPage.play("UrlPageOpen");
            this.tutorialBtn.active = true;
            intervalUpdateUID =  setInterval(()=>{
              this.UpdateUID(()=>{});
           },5000);
            });
            

          }else{
            console.log("UID Status False");
            this.NotiWrongAPI();
          }
        } else {
          this.NotiWrongAPI();
        }
      }
    };
    xhr.send("");
  }
  GetDialog() {
    const xhrDia = new XMLHttpRequest();
    const xhrPer = new XMLHttpRequest();
    xhrPer.open("GET", urlGetPer, true);
    xhrDia.open("GET", urlGetDialog, true);
    xhrDia.onreadystatechange = () => {
      try {
        if (xhrDia.readyState == XMLHttpRequest.DONE) {
          if (xhrDia.status === 200) {
            var res = JSON.parse(xhrDia.responseText);
            this._listDialogMeowY = [];
            this._listDialogMeowG = [];
            for (let i = 0; i < res.length; i++) {
              if(res[i].type === "yellow"){
                this._listDialogMeowY.push(res[i].dialog);
              }else{
                this._listDialogMeowG.push(res[i].dialog);
              }
            }

            this.isCheckDialog = true;
          }
        }
      } catch (error) {}
    };

    xhrPer.onreadystatechange = () => {
      try {
        if (xhrPer.readyState == XMLHttpRequest.DONE) {
          if (xhrPer.status === 200) {
            var res = JSON.parse(xhrPer.responseText);
            this._listPer = res.percent.split("-");
            this._listDialog = res.dialog.split("-");
            // this._listPer.forEach((x)=>{console.log(x);})
            // this._listDialog.forEach((x)=>{console.log(x);})

            this.isCheckPecent = true;
          }
        }else{
        }
      } catch (error) {}
    };
    xhrDia.send("");
    xhrPer.send("");
  }
  //#endregion
  NextToMainStage(){
    this.loginPage.active = false;
    this.popupUrl.active = false;
    this.urlGameEdit.string = "";
    this.loadGetTexture.active = true;
    this.OnclickedCloseTutorial();
    this.pageActive =3;
    clearInterval(intervalUpdateUID);
    var check = setInterval(() => {
      if (this.isCheckDialog && this.isCheckPecent) {
        this.mainPage.active = true;       
        CheckTimeCode.instance.CheckTimeCodeExp();
        MainAction.instance.Init();
        
        clearInterval(check);
      }
    }, 1000);

  }

  callback(event) {
    this.loadGetTexture.active = false;
  }
  SetActiveWebView(_isActive:boolean){
    if(this._nodeArr.length!=0){
      this._nodeArr[0].active = _isActive;
    }
  }

  NotiDuplicateActiveLukgeaw(_dupicateUser:boolean = false){
    this.SetActiveWebView(false);
    if(!_dupicateUser){
      this.notiSPLukgeaw.spriteFrame = this.notiSPWarningActive;
    }else{
      this.notiSPLukgeaw.spriteFrame = this.notiSPDuplicate;
      this.notiWarningBtnClick.node.active =false;
      setTimeout(() => {
        this.Init();
      }, 2000);
    }
    this.notificationLukgeaw.active = true;
    this.notiWarningBtnClick.interactable = true;
    this.animNotiWarning.play("PopupStart");
  }



  SetNotiPopupSprite(str: string, sp: SpriteFrame) {
    if (str == "error") {
      this.notiSPfdefault = sp;
    } else {
      this.notiSPftimeOut = sp;
    }
  }
  BackPageLogin(){
    this.notificationPage.active = false;
    this.loginPage.active = true;
    this.popupUrl.active =false;
    this.mainPage.active = false;
    this.loadingPage.active = false;
    this.pageActive = 1;
    if(intervalUpdateUID){clearInterval(intervalUpdateUID);}

  }
  NotiWrongAPI(WrongTimeOut: boolean = false,_dupicateUser:boolean = false,isWarning:boolean = true) {
    this.loadingPage.active = false;
    ManagerSound.instance.StopPlayLoop();
    if (WrongTimeOut) {
      if(this._nodeArr.length>0){this._nodeArr[0].destroy();}
      this.notiSP.spriteFrame = this.notiSPftimeOut; 
      this.BackPageLogin();
    } else {
      if(!_dupicateUser){
        this.notiSP.spriteFrame = this.notiSPfdefault;
      }else{
        if(!isWarning){
          this.notiSP.spriteFrame = this.notiSPDuplicate;
          this.notiBtnClick.node.active =false;
          setTimeout(() => {
            this.Init();
          }, 2000);

        }else{  
          this.notiSP.spriteFrame = this.notiSPWarningActive;
        }
        this.popupUrl.active =false;
      }
    }
    if(this.isTutorial){this.OnclickedCloseTutorial();}
    this.tutorialBtn.active = false;
    this.notificationPage.active = true;
    this.notiBtnClick.interactable = true;
    this.animNotiPage.play("PopupStart");
  }

  //#region  ClickedEvent
  OnClickedNotiClose() {
    this.notiBtnClick.interactable = false;
    this.animNotiPage.play("ClosePopup");
    
    setTimeout(() => {
      this.notificationPage.active = false;
      if (this.pageActive == 1) {
        this.animMainPage.play("MainOpen");
        this.codeBtnClick.interactable = true;
        this.codeLabel.enabled = true;
        if(this.isTutorial){
          this.codeLabel.string ='';
          this.codeLabel.enabled = true;
          this.PlayStateTutorial(4);


        }
      } else if(this.pageActive == 2){
        this.popupUrl.active =true;
        this.animMainPage.play("UrlPageOpen");
        this.urlBtnClick.interactable = true;
        if(this.isTutorial){   
          this.urlGameEdit.string ='';
          this.PlayStateTutorial(9);
        }
      }   
      this.tutorialBtn.active = true;

    }, 800);
  }

  OnClickedBackHome(){
    CheckTimeCode.instance.isTimeOut = false;
    ManagerSound.instance.StopPlayLoop();
    //MainAction.instance.ClearInterval();
    this._nodeArr[0].destroy();
    this.loginPage.active = true;
    this.mainPage.active = false;
    this.loadingPage.active = false;
    this.popupUrl.active = true;
    this.pageActive = 2;
    this.urlBtnClick.interactable = true;
    this.animMainPage.play("UrlPageOpen");
    this.UpdateUID(()=>{});
    intervalUpdateUID =  setInterval(()=>{
      this.UpdateUID(()=>{});
   },15000);
  }
  OnClickedNotiCloseLukgeaw() {
    this.notiWarningBtnClick.interactable = false;
    this.animNotiWarning.play("ClosePopup");
   
   setTimeout(() => {
     this.SetActiveWebView(true);
     this.notificationLukgeaw.active = false;
   }, 800);
 }
  OnClickedHowto(){
    if(this.pageActive === 1){
      this.codeLabel.string ='';
      this.codeLabel.enabled = true;
      Tutorial.instance.SetStateTutorial(0);
    }else{
      this.urlGameEdit.string ='';
      Tutorial.instance.SetStateTutorial(8);
    }
    this.isTutorial = true;
    Tutorial.instance.tutorialNode.active = true;
    Tutorial.instance.OnClickedAnyTutorial();
  }
  OnclickedCloseTutorial(){
    ManagerSound.instance.StopPlayLoop();
    this.isTutorial = false;
    this.codeLabel.enabled = true;
    this.urlBtnClick.interactable = true;
    Tutorial.instance.tutorialNode.active = false;
    Tutorial.instance.SetStateTutorial(0);
  }
  //#endregion

  

  PlayStateTutorial(_state:number){
    Tutorial.instance.SetStateTutorial(_state);
    Tutorial.instance.tutorialNode.active = true;
    Tutorial.instance.OnClickedAnyTutorial();
  }



  CallbackEditCode(text, editbox, customEventData){
    if(text.length == 6 && this.isTutorial){
      this.codeLabel.enabled = false;
  }
  }
}
