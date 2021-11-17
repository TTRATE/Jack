
import { _decorator, Component, Node, Tween, tween, ProgressBar, Label, Vec3, Button, Color, Sprite, easing, Animation, WebView, sp, ParticleSystem2D } from 'cc';
import { CheckTimeCode } from './CheckTimeCode';
import { Login } from './Login';
import { ManagerSound } from './ManagerSound';
const { ccclass, property } = _decorator;
 
 enum ColorEtpye{
     red = '#FF0000',
     yellow = '#F7FF2A',
     green = '#00FF33'
 }

const getTimeReset = 'https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/time';
var intervalPercent;
var intervalTime;

@ccclass('MainAction')
export class MainAction extends Component {

    static _instance:MainAction;
    static get instance(){
        if(this._instance){
            return this._instance;
        }

        this._instance = new MainAction();
        return this._instance;
    }

    @property(ProgressBar)
    bar:ProgressBar = null!;

    @property(Label)
    percentShow:Label = null!;
    @property(Label)
    mewoMessage:Label = null!;

    @property(Label)
    timeDelayShow:Label = null!;

    @property(Node)
    meowBtn:Node = null!;

    @property(Node)
    jack:Node = null!;

    @property(Sprite)
    lukGeaw:Sprite = null!;

    @property(Node)
    meowTextBox:Node = null!;

    @property(Node)
    webViewTest:Node = null!;

    OnClickedBtnCloseWebview(){
        this.webViewTest.active = !this.webViewTest.active;
    }

    @property(Node)
    loadingPage:Node = null!;

    @property(ParticleSystem2D)
    parOrb:ParticleSystem2D = null!;

    @property({type: sp.Skeleton})
    skelMeow:sp.Skeleton = null!;

    actionMewoAnim:number = 200;

    from:number =0;
    to:number = 0;
    duration:number = 0;
    elapsed:number = 0;
    percent:number =0;
    percentShowUI:number = 0;
    timeReset:number = 0;


    tweenBar:Tween<ProgressBar> = null!;
    tweenNumber:Tween<number> = null!;

    hightPercent:boolean = false;

    onLoad(){
        MainAction._instance = this;
        
    }
    
    Init(){
         this.timeReset = Number(Login.instance.GetTimeReset());
         this.hightPercent = false;
         this.jack.setPosition(Vec3.ZERO);
         this.skelMeow.animation = 'Jackle01';
         this.CountDownDelay();
         this.UpdateProgressBar();
         if(intervalPercent){clearInterval(intervalPercent);}
         intervalPercent =  setInterval(()=>{
            if(!CheckTimeCode.instance.isTimeOut){
                clearInterval(intervalPercent);
            }else{
             this.UpdateProgressBar();       
            }
         },(this.timeReset+1) * 1000);
    }

    onDisable(){
        this.ClearInterval();
    }

    ClearInterval(){
        clearInterval(intervalPercent);
        clearInterval(intervalTime)
        this.ActiveMeowMessage(false,'');
    }

    TweenMewoAction(positionAdd:number){
        let animPlay = !this.hightPercent? 'Jackle01':'Jackle';   
        var mewoAction = new Vec3(this.jack.getPosition());
        let positionAction = positionAdd<0 ? -600:-500;

        var tweenMeow = tween<Node>(this.jack).parallel(
            tween<Node>(this.jack).to(1.5,{position:new Vec3(mewoAction.x,mewoAction.y+positionAction,0)}
            ,{onComplete:()=>{
                    this.skelMeow.animation = animPlay;
                    },easing:easing.bounceIn}),
            tween<Node>(this.jack).delay(1.7).to(1,{position:new Vec3(mewoAction.x,mewoAction.y+positionAdd,0)}
            ,{onComplete:()=>{
                if(this.hightPercent){
                    this.ResetBtnMewo();
                    this.OnClickedMeowBtn();
                }
                },easing:easing.smooth})
        ).call(()=>{})
        .start();       
    }
    
    TweenLabelPercent(stringVal:string){
        var tweenTest = tween<Label>(this.percentShow)
        .to(1.5,{string:stringVal}
            ,{onUpdate:()=> {
                
                let numRand = Math.floor(Math.random()*100);
                this.percentShow.string = numRand + ' %';
                
            }})
        .call(()=> {
            
            this.percentShow.string = stringVal + ' %';
            this.TweenColorChange(Number(stringVal));
            tweenTest =null; 
        })
        .start();
    }

    colorMain:Color = null!;
    TweenColorChange(percent:number){
        let colorChange;
        if(percent >= 80){
            colorChange = new Color(ColorEtpye.green);
        }else if(percent >= 40){
            colorChange = new Color(ColorEtpye.yellow);
        }else{
            colorChange = new Color(ColorEtpye.red);
        }
        this.colorMain = new Color(this.lukGeaw.color);
        var tweenColor = tween<Sprite>(this.lukGeaw)
                        .to(1,{color:this.lukGeaw.color}
                        ,{onUpdate:()=>{
                            this.colorMain.lerp(colorChange,0.1);
                            this.lukGeaw.color = this.colorMain;
                            this.parOrb.startColor = this.colorMain;
                            this.parOrb.startColorVar = this.colorMain;

                        },onComplete:()=>{ 
                            this.lukGeaw.color = colorChange;
                            this.parOrb.startColor = colorChange;
                            this.parOrb.startColorVar = colorChange;},easing:easing.smooth})
                        .call(()=>{})
                        .start();

                        
    }

    TweenProgressBar(duration: number, percent: number) {
        this.tweenBar = tween<ProgressBar>(this.bar).to(duration, { progress: percent }).call(()=>{
            this.tweenBar = null;
        }).start();
    }
    
    UpdateProgressBar(){
            //this.percent = Math.floor(Math.random()*100);
            this.percent = Login.instance.GetPercentLukgeaw();
            this.TweenProgressBar(1.5,this.percent/100);
            this.TweenLabelPercent(this.percent.toString());
            this.CheckmewoAction(this.percent);
            this.CountDownDelay();
            this.TweenColorChange(this.percent);
            
    }

    CountDownDelay(){
        let countDown = this.timeReset;
        this.timeDelayShow.string = countDown.toString();
        if(intervalTime){clearInterval(intervalTime)};
        intervalTime = setInterval(()=>{
            countDown--;         
            if(countDown <=0){
                clearInterval(intervalTime);
            }
            this.timeDelayShow.string = countDown.toString();
        },1000);
        // const interval = setInterval(()=>{
        //     countDown--;
            
        //     if(countDown <=0){
        //         clearInterval(interval);
        //     }
        //     this.timeDelayShow.string = countDown.toString();
        // },1000);
    }

    CheckmewoAction(percent:number){
        if(percent >= 50){
            this.ActiveMeowMessage(false,'');  
            if(this.hightPercent == false){
                this.hightPercent = !this.hightPercent
                this.jack.setPosition(Vec3.ZERO);
                this.TweenMewoAction(this.actionMewoAnim);
            }else{this.ResetBtnMewo();this.OnClickedMeowBtn();}           
                      
        }else if(percent < 50 && this.hightPercent == true){
            this.hightPercent = !this.hightPercent
            this.ActiveMeowMessage(false,'');
            this.meowBtn.getComponent(Button).interactable = false;
            this.TweenMewoAction(-(this.actionMewoAnim));          
        }
        
        if(percent >= 80){
            ManagerSound.instance.PlaySound('80_Percent_Change');
            ManagerSound.instance.PlayLoop('80_Loop');
        }else{
            ManagerSound.instance.PlaySound('Percent Change');
            ManagerSound.instance.StopPlayLoop();
        }
    }


    ResetBtnMewo(){
        this.meowBtn.getComponent(Button).interactable = true;
    }

    OnClickedMeowBtn(){
        if(!this.hightPercent){
            this.meowBtn.getComponent(Button).interactable = false;
            return;
        }
        ManagerSound.instance.PlaySound('Cat_Pop_Up');
         this.meowBtn.getComponent(Button).interactable = false;
         setTimeout(() => {
             if(this.hightPercent){
                 this.ResetBtnMewo();
             }
         }, 5000);
         //this.ActiveMeowMessage(true,Login.instance.GetDialogMeow(this.percent).replace("\\n","\n"));
         this.ActiveMeowMessage(true,Login.instance.GetDialogFocus());
         this.meowTextBox.getComponent(Animation).play('TextMeow');     
    }

    ActiveMeowMessage(activeBox:boolean,mes:string = undefined){
            this.meowTextBox.active = activeBox;
            this.mewoMessage.string = mes;       
    }
}


