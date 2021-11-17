
import { _decorator, Component, Node, Label, tween, Vec3, UITransform, Sprite, SpriteFrame, Animation, PageView, Button, math } from 'cc';
import { Login } from './Login';
import { ManagerSound } from './ManagerSound';
const { ccclass, property } = _decorator;

enum StateTutorial{
    dialog,
    doit
}

export class DataTutorial{
    rank:number;
    dialog:string;
    size:number;
    state:string;

    constructor(_rank:number,_dialog:string,_size:number,_state:string){
        this.dialog = _dialog;
        this.size = _size;
        this.state = _state;
        this.rank = _rank;
    }
}


@ccclass('Tutorial')
export class Tutorial extends Component {
    static _instance:Tutorial;
    static get instance(){
        if(this._instance){
            return this._instance;
        }
        this._instance = new Tutorial;
        return this._instance;
    }
    
    onLoad(){
        Tutorial._instance = this;
        this.stateDialog = StateTutorial.dialog;
        this.currentPage = 0;

    }

    //#region Tutorial Page1

    
    @property(Node)
    tutorialNode:Node = null!;
    @property(Node)
    tutorialMask:Node = null!;
    @property(Node)
    layerMask:Node = null!;
    @property(Node)
    frameTutorial:Node = null!;
    @property(Node)
    btnDialog:Node = null!;
    @property(Node)
    popupCode:Node = null!;
    @property(Node)
    codeHolder:Node = null!;
    @property(Node)
    btnOk:Node = null!;
    @property(Node)
    jackyTeacher:Node = null!;
    @property(Node)
    dialogBox:Node = null!;
    @property(Node)
    hand:Node = null!;
    @property(Node)
    anyClickedtext: Node = null!;

    @property(Node)
    popupurl:Node = null!;

    @property(SpriteFrame)
    textUp:SpriteFrame = null!;

    @property(SpriteFrame)
    textDown:SpriteFrame = null!;

    
    @property(Label)
    textTest:Label = null!;

    state:string = ''
    steps:string[] = [
        "hellojacky",
        "aboutjacky",
        "about2jacky",
        "about3jacky",
        "step1code",
        "editCode",
        "acceptcode",
        "abouturl",
        "aboutjackyurl",
        "step2url",
        "step2url2",
        "editurl",
        "accepturl",
        "fnish",
        "goodluck",];

    listTutorialData:DataTutorial[] = [];

    dialogTest:string = 'หากต้องการจะเข้าใช้งานท่านจะต้องกรอกข้อมูลให้ครบถ้วนและถูกต้อง !';
    stepNext:number = 0;
    dialogRun:boolean = false;

    stateDialog:StateTutorial;

    

    Init(){
        this.OnClickedAnyTutorial();
    }

    setTutorialData(_dataTutorial:DataTutorial[]){
        this.listTutorialData = _dataTutorial;
    }

    SetjackTeacher(_posXJ:number,_posYJ:number,_scaleJ:number){
        this.jackyTeacher.setScale(new Vec3(_scaleJ,_scaleJ,0));
        this.jackyTeacher.setPosition(new Vec3(_posXJ,_posYJ,0));

    }

    SetActiveJackDoit(_isActive:boolean){
        this.jackyTeacher.active = _isActive;
        this.dialogBox.active = _isActive;
        
    }

    SetStateTutorial(_state:number){
        this.stepNext = _state;
        this.SetHandTutorial(true,false);
        this.SetActiveJackDoit(true);
        this.ChangeStateTutorial(StateTutorial.dialog);
        if(_state==0){
            this.dialogRun = false;
        }
    }

    SetHandTutorial(_isHolder:boolean,_isActive:boolean){
        this.hand.active = _isActive;
        if(_isHolder){
            this.hand.getComponent(Animation).play('HandTutorial1');
        }else{
            this.hand.getComponent(Animation).play('HandTutorial2');
        }
    }

    SetTextBoxType(_posXD:number,_posYD:number,_scaleD:number,type:string){
        if(type=="up"){
            this.dialogBox.getComponent(Sprite).spriteFrame = this.textUp;
            this.textTest.node.setPosition(new Vec3(10,0,0));
            this.textTest.node.getComponent(UITransform).setContentSize(850,440);

        }else{
            this.dialogBox.getComponent(Sprite).spriteFrame = this.textDown;
            this.textTest.node.setPosition(new Vec3(0,0,0));
            this.textTest.node.getComponent(UITransform).setContentSize(1077,440);
        }
        this.dialogBox.setScale(new Vec3(_scaleD,_scaleD,0));
        this.dialogBox.setPosition(new Vec3(_posXD,_posYD,0));

    }

    FocusPoint(_state:string){
        this.SetHandTutorial(true,false);
        switch(_state){
            case "hellojacky":
                this.SetMaskTutorial(new Vec3(0,0,0),0,0);
                this.SetjackTeacher(-124,-324,1);
                this.SetTextBoxType(95,108,1,"up");
                break;
            case "aboutjacky":
                
                break;
            case "about2jacky":
            this.SetMaskTutorial(new Vec3(0,120,0),550,870);
                this.SetTextBoxType(0,-412,1,"down");
                break;
            case "about3jacky":
                                     
                break;
            case "step1code":
                this.SetMaskTutorial(new Vec3(this.popupCode.getPosition().x,this.popupCode.getPosition().y,0),
                                     this.popupCode.getComponent(UITransform).contentSize.width,this.popupCode.getComponent(UITransform).contentSize.height);
                this.SetjackTeacher(-200,-295,0.5);
                this.SetTextBoxType(0,-412,1,"down");
                break;
            case "editCode":
                this.SetMaskTutorial(new Vec3(this.codeHolder.getPosition().x,this.codeHolder.getPosition().y,0),
                                     this.codeHolder.getComponent(UITransform).contentSize.width,this.codeHolder.getComponent(UITransform).contentSize.height);
                       this.SetHandTutorial(true,true);
                       this.SetActiveJackDoit(false);
                       this.anyClickedtext.active = false;
                break;
            case "acceptcode":
                    this.SetMaskTutorial(new Vec3(this.btnOk.getPosition().x,this.btnOk.getPosition().y,0),
                                         this.btnOk.getComponent(UITransform).contentSize.width,this.btnOk.getComponent(UITransform).contentSize.height);
                    this.SetHandTutorial(false,true);                
                    this.SetjackTeacher(-202,-428,0.5);
                    this.SetTextBoxType(30,-506,0.8,"down");
                    this.SetActiveJackDoit(true);

                break;
            case "abouturl":
                    this.SetMaskTutorial(new Vec3(0,120,0),550,870);
                    this.SetjackTeacher(-124,-324,1);
                    this.SetTextBoxType(0,-412,1,"down");
                    this.anyClickedtext.active = true;

                break;
            case "aboutjackyurl":
                this.SetMaskTutorial(new Vec3(this.popupCode.getPosition().x,this.popupCode.getPosition().y,0),
                                     this.popupCode.getComponent(UITransform).contentSize.width,this.popupCode.getComponent(UITransform).contentSize.height);
                this.SetjackTeacher(-124,-324,1);
                this.SetTextBoxType(0,-412,1,"down");
                break;
            case "step2url":
                this.SetMaskTutorial(new Vec3(this.popupCode.getPosition().x,this.popupCode.getPosition().y,0),
                                     this.popupCode.getComponent(UITransform).contentSize.width,this.popupCode.getComponent(UITransform).contentSize.height);
                    
                break;
            case "editurl":
                this.SetMaskTutorial(new Vec3(this.codeHolder.getPosition().x,this.codeHolder.getPosition().y,0),
                                     this.codeHolder.getComponent(UITransform).contentSize.width,this.codeHolder.getComponent(UITransform).contentSize.height);
                       this.SetHandTutorial(true,true);
                       this.SetActiveJackDoit(false);
                       this.anyClickedtext.active = false;
                break;
            case "accepturl":
                this.SetMaskTutorial(new Vec3(this.btnOk.getPosition().x,this.btnOk.getPosition().y,0),
                                     this.btnOk.getComponent(UITransform).contentSize.width,this.btnOk.getComponent(UITransform).contentSize.height);   
                    this.SetHandTutorial(false,true);
                    this.SetjackTeacher(-202,-428,0.5);
                    this.SetTextBoxType(30,-506,0.8,"down");
                    this.SetActiveJackDoit(true);

                break;
            case "fnish":
                    this.SetMaskTutorial(new Vec3(0,0,0),0,0);
                    this.anyClickedtext.active = true;
                    this.SetjackTeacher(-124,-324,1);
                    this.SetTextBoxType(95,108,1,"up");              
                break;
            case "goodluck":
            
                break;
        }
        if(this.state == 'editCode' || this.state == 'editurl'||
        this.state == 'acceptcode' || this.state == 'accepturl'){     
            if(this.state == 'acceptcode' || this.state == 'accepturl'){
            ManagerSound.instance.PlayLoop('Dialog',0.5);
            }
         this.Dialog(this.listTutorialData[this.stepNext-1].dialog.replace("\\n","\n"),this.listTutorialData[this.stepNext-1].size,true);           
        }else{
         ManagerSound.instance.PlayLoop('Dialog',0.5);
         this.Dialog(this.listTutorialData[this.stepNext-1].dialog.replace("\\n","\n"),this.listTutorialData[this.stepNext-1].size,false); 
     }
    }

    ChangeStateTutorial(type:StateTutorial){
        if(type === StateTutorial.doit){
            this.stateDialog = StateTutorial.doit;
            this.btnDialog.active = false;
            
        }else{
            this.stateDialog = StateTutorial.dialog;
            this.btnDialog.active = true;
        }
    }

    Dialog(dialog:string,size:number,isDoit:boolean){
        var index = 0
        var char = '';
        this.textTest.fontSize = size;
        var dialogReplace = dialog.replace("\\n","\n");
        
        var progressRun = setInterval(()=>{
            if(index === dialog.length|| !this.dialogRun){
                this.textTest.string = dialogReplace;
                this.dialogRun = false;
                ManagerSound.instance.StopPlayLoop();

                if(isDoit){
                    this.ChangeStateTutorial(StateTutorial.doit)
                }
                clearInterval(progressRun);
                
            }else{
                char += dialogReplace.charAt(index);
                index++;
                this.textTest.string = char;
            }
            
         },40);       
    }

    SetMaskTutorial(_position:Vec3,_width:number,_height){
        var _posY = Math.abs(_position.y);
        var _posx = Math.abs(_position.x);

        this.tutorialMask.getComponent(UITransform).setContentSize(_width,_height);
        this.layerMask.setPosition(new Vec3(_posx,_posY,0));
        this.frameTutorial.getComponent(UITransform).setContentSize(_width+10,_height+10);
        this.tutorialMask.setPosition(_position);
    }

    OnClickedAnyTutorial(){
        if(this.stateDialog === StateTutorial.dialog){
            if(!this.dialogRun && this.stepNext == this.listTutorialData.length){
                Login.instance.NextToMainStage();
            }  
            if(this.dialogRun){
                this.dialogRun = false;
            }
            else{
                if(this.stepNext == this.listTutorialData.length||
                    this.state == "goodluck"){this.state = this.listTutorialData[0].state;return;}           
                this.dialogRun = true;        
                this.state = this.listTutorialData[this.stepNext].state;
                this.stepNext++;    
                this.FocusPoint(this.state);
            }
                      
        }else{
            if(this.dialogRun){
                this.dialogRun = false;
            }
        }
    }

    SetActiveTutorial(_isActive:boolean){
        this.tutorialNode.active = _isActive;
        if(_isActive){
            this.ChangeStateTutorial(StateTutorial.dialog)
            this.OnClickedAnyTutorial();
        }else{

        }
    }

    CallBackLogin(){

        this.ChangeStateTutorial(StateTutorial.dialog);
        this.OnClickedAnyTutorial();
    }

    OnHitCode(text, editbox, customEventData){
        if(this.stateDialog === StateTutorial.doit){
            if(text.length == 6){
                //console.log('Code : ' + text);
                this.ChangeStateTutorial(StateTutorial.dialog);
                this.OnClickedAnyTutorial();
            }
        }
    }
    OnHitUrl(text, editbox, customEventData){    
        if(this.stateDialog === StateTutorial.doit){
            if(text.includes("http://") || text.includes("https://")){
                this.ChangeStateTutorial(StateTutorial.dialog);
                this.OnClickedAnyTutorial();
            }
        }
    }

    //#endregion

    //#region TutorialPage2

    @property(Node)
    tutorialParent:Node = null!;
    @property(Node)
    nextBtn:Node = null!;
    @property(Node)
    backBtn:Node = null!;

    @property(Label)
    pageInfo:Label = null!;

    @property(PageView)
    pageView:PageView = null!;
    @property({type:Node,displayName:"TutorialPage"})
    public pages:Node[] = [];


    currentPage:number = 0;

    OnClickedHowtoPageAction(){
        this.currentPage = 0;
        this.pageView.setCurrentPageIndex(this.currentPage);
        this.tutorialParent.active = true;
        Login.instance.SetActiveWebView(false);
    }

    OnClikcedBtnTutorial(event, customEventData){
            var node = event.target;
            node.getComponent(Button).interactable = false;    
            this.currentPage += Number(customEventData);
            if(this.currentPage > this.pages.length || this.currentPage < 0){return;}
            this.pageView.setCurrentPageIndex(this.currentPage);
            this.pageInfo.string = `${this.currentPage+1}/${this.pages.length}`
            if(this.currentPage == this.pages.length){
                this.nextBtn.active =false;
            }else if(this.currentPage == 0){
                this.backBtn.active =false;
            }else{
                this.nextBtn.active =true;
                this.backBtn.active =true;
            }
            setTimeout(() => {
                node.getComponent(Button).interactable = true;
            }, 200);
    }

    OnClickedClose(){
        Login.instance.SetActiveWebView(true);
        this.tutorialParent.active = false;
        this.currentPage = 0;
        this.pageView.setCurrentPageIndex(this.currentPage);
    }

    CallbackPageView(pageView, eventType, customEventData){
        this.currentPage = pageView.getCurrentPageIndex();
        this.pageInfo.string = `${this.currentPage+1}/${this.pages.length}`
        if(pageView.getCurrentPageIndex() >= this.pages.length-1){
            this.nextBtn.active =false;
        }else if(pageView.getCurrentPageIndex() <= 0){
            this.backBtn.active =false;
        }else{
            this.nextBtn.active =true;
            this.backBtn.active =true;
        }
    }

    //#endregion

}

