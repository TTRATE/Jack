
import { _decorator, Component, Node, Sprite, assetManager, ImageAsset, Texture2D, SpriteFrame } from 'cc';
import { Login } from './Login';
import { DataTutorial, Tutorial } from './Tutorial';
const { ccclass, property } = _decorator;
class DataGetTexture{
    path_gs:string;
    name:string;
    type:string;


    constructor(_path:string,_name:string,_type:string){
        this.path_gs = _path;
        this.name = _name;
        this.type = _type;
    }

}



const typeGetData = {
    type : ''
}


 const urlGetAsset = 'https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/asset';
 const urlGetTutorial = ' https://us-central1-jack-webadmin.cloudfunctions.net/jacky/api/tutorial';

@ccclass('LoadData')
export class LoadData extends Component {

    @property(Sprite)
    listBtn:Sprite[] = [];

    _listDataGet:DataGetTexture[] = [];
    
    @property(Sprite)
    lsitspritesUI:Sprite[] = [];
    
    @property(String)
    listrefUI:String[] = [];

    @property(Sprite)
    spget:Sprite = null!;


    isCheckTutorial:boolean = false;


   
    onLoad(){
        this.GetDateTexture();
        this.GetDateTutorial();
    }

    GetDateTexture(){
        const xhr = new XMLHttpRequest();
        xhr.open("GET",urlGetAsset,true);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200){
                //console.log("Recive : " +xhr.response);
                var resArr = JSON.parse(xhr.responseText);
                this._listDataGet = [];
                for(let i = 0 ;i<resArr.length;i++){
                    let data:DataGetTexture;
                        data = new DataGetTexture(
                        resArr[i].path_gs,
                        resArr[i].name,
                        resArr[i].type);

                        this._listDataGet.push(data);
                }

                this.SetTexture();
                this.SetNotiPopup();
            }
        }
        
       xhr.send('');
    }

    GetDateTutorial(){
        const xhr = new XMLHttpRequest();
        xhr.open("GET",urlGetTutorial,true);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200){
                //console.log("Recive : " +xhr.response);
                var resArr = JSON.parse(xhr.responseText);
                var _listDatatutorail:DataTutorial[] = [];
                for(let i = 0 ;i<resArr.length;i++){
                    let data:DataTutorial;
                        data = new DataTutorial(
                        resArr[i].rank,
                        resArr[i].dialog,
                        resArr[i].size,
                        resArr[i].state);

                        _listDatatutorail.push(data);
                }

                Tutorial.instance.setTutorialData(_listDatatutorail);
                this.isCheckTutorial = true;
            }
        }
        
       
       xhr.send('');
    }



    SetTexture(){
        this._listDataGet.forEach((ref,index) =>{
            for (let i = 0; i < this.listrefUI.length; i++) {
                if(ref.name == 'Btn'){
                    this.listBtn.forEach((sp)=>{
                        this.LoadAsset(ref.path_gs,sp);
                    })
                    break;
                }
                if(ref.name == this.listrefUI[i]){
                    this.LoadAsset(ref.path_gs,this.lsitspritesUI[i]);
                    break;
                }               
            }
        })

        const interval = setInterval(()=>{          
                if(this.isCheckTutorial){
                    Login.instance.Init();
                    clearInterval(interval);
                }   
        },1000);
    }

    SetNotiPopup(){
        this._listDataGet.forEach((ref) =>{
            if(ref.name == 'NotiErrorPopp'){
                this.LoadAsset(ref.path_gs,this.spget,'error');
            }
            if(ref.name == 'NotiTimeOutPopp'){
                this.LoadAsset(ref.path_gs,this.spget,'timeout');
            }
        })
    }

    LoadAsset(_pathImage:string,_sprite:Sprite,_str:string = ''){
        assetManager.loadRemote<ImageAsset>(_pathImage,{ext:'.png'},(err:any,texture)=>{
            const tex = new Texture2D();
                tex.image = texture;
                const spriteframe = new SpriteFrame();
                spriteframe.texture = tex;
                _sprite.spriteFrame = spriteframe;

                if(_str != '')
                Login.instance.SetNotiPopupSprite(_str,spriteframe);
        })
    }

}

