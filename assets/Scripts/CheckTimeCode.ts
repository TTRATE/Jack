
import { _decorator, Component, Node, Label } from 'cc';
import { DataUserLogin } from './Login';
import { Login } from './Login';
import { ManagerSound } from './ManagerSound';
const { ccclass, property } = _decorator;

let timeExp;
var intervalTime;
function millisecondsToHuman(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms  / 1000 / 3600 ) % 24)
  

    let mR = minutes<10? '0'+minutes : minutes;
    let sR = seconds<10? '0'+seconds : seconds;

    // console.log('con sec : ' + seconds);
    // console.log('con Min : ' + minutes);
    // console.log('con Hour : ' + hours);
    // hours + ":" + mR + ":" + sR
    var val = hours + ":" + mR + ":" + sR
    return val;
  }

@ccclass('CheckTimeCode')
export class CheckTimeCode extends Component {

    static _instance:CheckTimeCode;
    static get instance() {
        if(this._instance){
            return this._instance;
        }

        this._instance = new CheckTimeCode();
        return this._instance;
    }

    @property(Label)
    timeCodeEnd:Label = null!;  

    isTimeOut:boolean = true;


    onLoad(){
        CheckTimeCode._instance = this;
    }

    onDisable(){
        this.isTimeOut = false;
        ManagerSound.instance.StopPlayLoop();
        clearInterval(intervalTime);
    }

    CheckTimeCodeExp(){
        var timeExp = new Date(DataUserLogin.getExpireTime);

        this.isTimeOut = true;
        intervalTime = setInterval(()=>{
            let toDayTest = new Date();
            
            let dateNa = timeExp.getTime() - toDayTest.getTime();
            this.timeCodeEnd.string = millisecondsToHuman(dateNa);
            if(millisecondsToHuman(dateNa) === '0:00:00' || millisecondsToHuman(dateNa).includes('-')){
                this.timeCodeEnd.string = '00:00';
                Login.instance.NotiWrongAPI(true);
                this.isTimeOut = false;
                ManagerSound.instance.StopPlayLoop();
                clearInterval(intervalTime);
            }
        },1000);
    }




}

