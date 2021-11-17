
import { _decorator, Component, Node, AudioClip, AudioSource, resources } from 'cc';
const { ccclass, property } = _decorator;


const pathSound = 'Sound/';
@ccclass('ManagerSound')
export class ManagerSound extends Component {

    static _instance:ManagerSound;
    static get instance(){
        if(this._instance){
            return this._instance;
        }

        this._instance = new ManagerSound;
        return this._instance;
    }
    @property(AudioSource)
    playS:AudioSource = null!;

    @property(AudioSource)
    playSLoop:AudioSource = null!;
    
onLoad(){
   ManagerSound._instance = this;
}


    PlaySound(_nsp:string,volume:number = 1){
        resources.load(pathSound+_nsp,AudioClip,(err,clip)=>{
            if(err){
                console.log('Load Sound error : ' + err);
                return;
            }
            this.playS.volume = volume;
            this.playS.playOneShot(clip);
        })

    }

    PlayLoop(_nsp:string,volume:number = 1){
        resources.load(pathSound+_nsp,AudioClip,(err,clip)=>{
            if(err){
                console.log('Load Sound error : ' + err);
                return;
            }
            this.playSLoop.clip = clip;
            this.playSLoop.volume = volume;          
            this.playSLoop.play();
        })
    }

    StopPlayLoop(){
        if(this.playSLoop.playing){
            this.playSLoop.stop();
        }
    }


    PlaySoundEventBtn(event,customEventData){
        this.PlaySound(customEventData);
    }
}


