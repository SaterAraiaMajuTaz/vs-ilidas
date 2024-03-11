////////////////////////////////////////////////////////////////////////////////
function debug(str){
	document.getElementById('debug_message').innerHTML
		= str + "<br />" + document.getElementById('debug_message').innerHTML;
	if (document.getElementById('debug_message').innerHTML == "") {
		document.getElementById('debug').style.visibility = "hidden";
	}
	else{
		document.getElementById('debug').style.visibility = "visible";
	}
}
////////////////////////////////////////////////////////////////////////////////
function debug_clear(){
	document.getElementById('debug_message').innerHTML = "";
	document.getElementById('debug').style.visibility = "hidden";
}
////////////////////////////////////////////////////////////////////////////////
function floor(num){
	return Math.floor(num);
}
////////////////////////////////////////////////////////////////////////////////
function random(num){
	return Math.floor(Math.random() * num);
}
////////////////////////////////////////////////////////////////////////////////
function rgb(a, b, c){
	return "rgb("+a+","+b+","+c+")";
}
////////////////////////////////////////////////////////////////////////////////
function font(a, b){
	var b = (b !== undefined) ? b : "meiryo";
	return ""+a+"px "+b+"";
}
////////////////////////////////////////////////////////////
window.onerror = function(msg, url, line, col, err) {  
	document.getElementById('error_message').style.visibility = "visible";
	//document.getElementById('error_message').innerHTML = msg + " --- Line " + line;
	document.getElementById('error_message').innerHTML = "エラーが発生しました。エラー内容をデバッグツールで確認してプログラムを修正してください。";
}

//Triangonomy Function
function sin(num){
	return Math.sin(num * (Math.PI) / 180 );
}
//////////////////////////////////////////////////////////////
function cos(num){
	return Math.cos(num * (Math.PI) / 180);
}
//////////////////////////////////////////////////////////////
function tan(num){
	return Math.tan(num * (Math.PI) / 180);
}
//////////////////////////////////////////////////////////////
function cot(num){
	return 1 / (Math.tan(num * (Math.PI) / 180));
}
//////////////////////////////////////////////////////////////
function sec(num){
	return 1 / ( Math.cos(num * (Math.PI) / 180));
}
//////////////////////////////////////////////////////////////
function cosec(num){
	return 1 / (Math.sin(num * (Math.PI) / 180));
}
//////////////////////////////////////////////////////////////
function Radian(degree){
	return degree * (Math.PI) / 180;
}
//////////////////////////////////////////////////////////////
function Vector_Phase(x,y){
	if(x < 0){
		return (Math.PI - Math.asin(y / Math.sqrt(x*x + y*y))) * 180 / Math.PI;
	}
	if(x >= 0){
		return (Math.asin(y / Math.sqrt(x*x + y*y))) * 180 / Math.PI;
	}
	if((x >= 0)*(y <= 0)){
		return (Math.asin(y / Math.sqrt(x*x + y*y)) + 2 * Math.PI)* 180 / Math.PI;
	}
}/////////////////////////////////////////////////////////////////////////////////////////////

function Vector_Phage3D_Latitude(x,y,z){
	return Math.acos(z / Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2))) * 180 / Math.PI;
}
function Vector_Phage3D_Longitude(x,y,z){
	return Math.acos(x / Math.sqrt(Math.pow(x,2)+Math.pow(y,2))) * 180 / Math.PI;
}

Bgm = enchant.Class.create({
    initialize: function(){
        this.data = null;
        this.isPlay = false;//プレイの状態フラグ
        this.isPuase = false;
    },
    //BGM用音楽ファイルのセット
    set: function(data){
        this.data = data;
    },
	//再生(再生のみに使う)
    play: function(){
        this.data.play();
        this.isPlay = true;
        this.isPuase = false;
        if(this.data.src != undefined){//srcプロパティを持っている場合
            this.data.src.loop = true;
        }
    },
    //ループ再生(必ずループ内に記述すること) PCでのループ再生で使う
    loop: function(){
        if(this.isPlay == true && this.data.src == undefined){//再生中でsrcプロパティを持っていない場合
            this.data.play();
        }
    },
    //再生停止(曲を入れ替える前は,必ずstop()させる)
    stop: function(){
        if(this.data != null){
            if(this.isPuase){
                this.isPlay = false;
                this.isPuase = false;
                this.data.currentTime = 0;
            }else if(this.isPlay){
                this.data.stop();
                this.isPlay = false;
            }
        }
    },
    //一時停止（ポーズ画面などの一時的な画面の切り替え時に音を止めたいときのみ使う）
    pause: function(){
        if(this.data != null){
            this.data.pause();
            this.isPuase = true;
            this.isPlay = false;
        }
    }
});

/////////////////////////////////////////////////////////////////////////////////////////
Se = enchant.Class.create({
    initialize: function(){
        this.data = null;
    },
    //SE用音楽ファイルのセット
    set: function(data){
        this.data = data;
    },
    //再生
	play: function(){
		this.data.clone().play();
	}
});
