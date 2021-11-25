
import { _decorator, Component, Node, Vec3, Prefab, instantiate, game, Game} from 'cc';
import { Login } from './Login';
const { ccclass, property } = _decorator;
const urlPost = "https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/user/uid/data/";

// var isOnIOS = navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPhone/i);
// var eventName = isOnIOS ? "pagehide" : "beforeunload";


class dataPost  {
  uid:string
  time :string

  constructor(_uid:string,_time:string){
    this.uid = _uid;
    this.time = _time;
  }
}

var intervalTime;
@ccclass('TouchTest')
export class TouchTest extends Component {
    // [1]
    // dummy = '';


    @property(Node)
    test:Node = null!;
    @property(Prefab)
    prefabTouch:Prefab = null!;

     @property(Node)
     canvasParent:Node = null!;
    
     @property({type:Node,displayName:"AddEvent"})
     public nodes:Node[] = [];
     
    isCheck:boolean = false;
    isHide:boolean = false;
    isThere:boolean = false;

    onLoad(){
    this.nodes.forEach((x)=>{
      x.on(Node.EventType.TOUCH_START,this.TouchStartCallback,this);
      //x.on(Node.EventType.MOUSE_DOWN,this.TouchStartCallback,this);
    })
    //this.PostData();
    //window.addEventListener('beforeunload',this.PostData,false)

    //console.log("This isOn : " + isOnIOS +"And Event : " +eventName );
    //window.addEventListener(eventName,this.PostData,false);
    

    //systemEvent.on(SystemEvent.EventType.MOUSE_DOWN,this.TouchStartCallback,this);
    //systemEvent.on(SystemEvent.EventType.TOUCH_START,this.TouchStartCallback,this);


    document.addEventListener("visibilitychange", 
    (()=>{if (document.visibilityState === 'visible') {
       console.log(document.visibilityState);

    } else {
      console.log("Now : " + document.visibilityState + " ||| isHide : " + this.isHide+ " ||| isThere : " + this.isThere);
      if(Login.instance.GetIDUser()!= undefined && this.isHide && this.isThere){
        console.log("Send POST : status isHide >>>" + this.isHide);
        navigator.sendBeacon(urlPost+Login.instance.GetIDUser());
        }
      }
    })
    );

    game.on(Game.EVENT_HIDE,()=>{
      this.isHide = true;
      setTimeout(() => {
        this.isThere = false;
        console.log("set There By Hide : " + this.isThere);

      }, 1000);

      console.log("isHide : By Event_Hide >>>>>" + this.isHide)
      // var num =0;
      // intervalTime = setInterval(()=>{
      //   num++;
      //   console.log("Num : " + num);
      //   // if(num==5){
      //   //   this.PostData();
      //   // }
      // },1000);
    });
    game.on(Game.EVENT_SHOW,()=>{
      this.isHide = false;
      // isThereUse
      setTimeout(() => {
        this.isThere = true;
        console.log("set There By Show : " + this.isThere);
      }, 800);
      console.log("isHide : By Event_Show >>>>>" + this.isHide);
      //clearInterval(intervalTime);
    });

    

    //Ipad way
    // window.addEventListener(
    //   'pagehide',
    //   ()=>{
    //     if(Login.instance.GetIDUser()!= undefined){
    //       navigator.sendBeacon(urlPost+Login.instance.GetIDUser());
    //       this.labelTest4.string = "Send Post Pagehide Event!";
    //     }

    //   }
    // );

    // document.addEventListener("pagehide", 
    // (()=>{
    //   if(Login.instance.GetIDUser()!= undefined){
    //     navigator.sendBeacon(urlPost+Login.instance.GetIDUser());
    //     this.PostData();
    //   }})
    // );
      


    }

    testData:dataPost;
    
    PostData() {
      const xhr = new XMLHttpRequest();
      //var rnd = Math.floor(Math.random()*10000000);
      const json = ``;
     
      xhr.open("POST", urlPost+Login.instance.GetIDUser(), true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            console.log("Post UID " + xhr.responseText);

            
          } 
        }
      };
      xhr.send(json);
    }
    TouchStartCallback(event){
      if(this.isCheck){return;}
      this.isCheck = true;
        let parObj:Node = null!;
        parObj = instantiate(this.prefabTouch);
        parObj.setParent(this.canvasParent);
        parObj.setWorldPosition(new Vec3(event.getUILocation().x,event.getUILocation().y,0));

        setTimeout(() => {
          this.isCheck = false;
        }, 80);
        //console.log(`PosX ${event.getUILocation().x} PosY `);
    }
    
}
