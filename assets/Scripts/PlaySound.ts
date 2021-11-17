
import { _decorator, Component, Node } from 'cc';
import { ManagerSound } from './ManagerSound';
const { ccclass, property } = _decorator;
@ccclass('PlaySound')
export class PlaySound extends Component {
    
    PlaySound(_nsp:string){
        ManagerSound.instance.PlaySound(_nsp);
    }
}
