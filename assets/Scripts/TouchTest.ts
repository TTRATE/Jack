
import { _decorator, Component, Node, Vec3, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

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

    onLoad(){
    this.nodes.forEach((x)=>{
      x.on(Node.EventType.TOUCH_START,this.TouchStartCallback,this);
      //x.on(Node.EventType.MOUSE_DOWN,this.TouchStartCallback,this);
    })
    //systemEvent.on(SystemEvent.EventType.MOUSE_DOWN,this.TouchStartCallback,this);
    //systemEvent.on(SystemEvent.EventType.TOUCH_START,this.TouchStartCallback,this);
    //console.log("Set");
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
