// enchant.jsを使うための準備
enchant();
//bgmのフレーム
var bgm_frame = 0;
var bgm_loop_start = false;

// コアオブジェクトの宣言
var core;
//charactor
//nana
var sprite_nana_beam = [];

var sprite_ilidas_flying;

var sprite_player_rocket;

var sprite_playerbeam = [];

var sprite_stone = [];

var label_HP_ilidas_flying;

var label_HP_player;

var music = new Bgm();
var se01;
var se02;
var se03;

var sprite_playerbeam = [];
//石クラス
Stone = Class.create(Sprite,{
	initialize: function(){
		Sprite.call(this,64,64);
		this.image = core.assets["./images/space1.png"];//使用画像
		this.scaleX = 0.25;
		this.scaleY = 0.55;
		this.speed = 0.4;
		this.vx = 0;//Ⅹ軸移動量
		this.vy = 0;//Ｙ軸移動量
		this.degree = 0;
		
	},
	
	//設置
	set: function(x,y){
		
		//座標決定
		this.x = x;
		this.y = y;
	},
	updatePosition: function(){
		//分解する
		this.vx = this.speed * cos(this.degree);
		this.vy = this.speed * sin(this.degree);
		//移動する
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;

			
			
	},
	
	//一時間フレーム毎に処理をする
	onenterframe: function(){
		
		//表示位置更新メゾッド
		this.updatePosition();

	}
});


Life = Class.create(Label, {
	//type = 0 物体 	1 player 2 company 3 boss 4 enemy
	initialize: function(name,parameter,type){
		Label.call(this);
		this.font = font(32);
		this.color = rgb(0,0,0);
		this.life = parameter.life;
		this.text = name + "'s Life:" + this.life;
		this.color = "white";
		this.font = 1;
		if(type == 1){
		  this.x = 0;
		  this.y = 0;
		}
		else if(type == 3){
		  this.x = 200;
		  this.y = 0;
		}
	},
	change: function(name,parameter,type){
		this.life = parameter.life;
		this.text = name + "'s Life:" + this.life;
		if(this.life <= 0){
			this.life = 0;
		  this.text = name + "'s Life: DEAD ";
		  core.rootScene.removeChild(parameter);
		  
		  if(type == 1){
		  	core.end();
		  }
		  else if(type == 3){
		  	core.clear();
		  }
		}
	}
});

//イリダス(I)クラス
//スプライトクラス継承
Ilidas_Flying = Class.create(Sprite, {
	// オブジェクトを初期化するメソッド
	initialize: function(){
		
		Sprite.call(this,40,72);//スプライトクラスを継承
		this.image = core.assets["./images/nana.png"];//使用画像
		this.frame = 0;//画像フレーム
		this.x = 208;//Ｘ座標
		this.y = 50;//Ｙ座標
		this.vx = 0;//Ⅹ軸移動量
		this.vy = 0;//Ｙ軸移動量
		this.speed = 10;
		this.life = 3500;//HP
		this.degree = 180;
		this.nanabeam = false;
		this.traffic = false;
		//突進フラグ 論理値 true/突進中, false/突進していない 
		this.rush_flag = false
		//攻撃フラグ 論理値 true/攻撃中, false/攻撃していない 
		this.attack_flag = false;
		
		this.scaleX = 0.8;
		this.scaleY = 0.8;
		
		
		// アニメーションカウント
		this.count = 0;
		
	},
	
	//表示位置更新メゾッド
	updatePosition: function(){
			//分解する
			this.vx = this.speed * cos(this.degree);
			this.vy = this.speed * sin(this.degree);
			//移動する
			this.x = this.x + this.vx;
			this.y = this.y + this.vy;
		
		if(this.traffic == true){
			this.vy= Math.cos(core.frame);

		
			//向き
			if(this.x >= 448){
				this.degree = 180;
			}
			if(this.x <= 0){
				this.degree = 0;
			}
		}
	},
	
	
	//アニメーション更新メゾッド
	updateAnimation: function(){
		
		if(core.frame % 6 == 0){
			
			this.count ++;
			
		}
				
		if(this.count % 2 == 0){
			
			this.frame = 1;
			
		}		
		
		else{
			
			this.frame = 0;
			
		}
		
		
	},
		
	//一時間フレーム毎に処理をする
	
	onenterframe: function(){

		this.updatePosition();//表示位置更新メゾッド
		this.updateAnimation();//アニメーション	更新メゾッド
		
			
	}
});
			
//プレイヤークラス
//スプライトクラス継承
Aie_Rocket = Class.create(Sprite, {
	
	// オブジェクトを初期化するメソッド
	initialize: function(){
		
		Sprite.call(this,32,64);//スプライトクラスを継承
		this.image = core.assets["./images/roket.PNG"];//使用画像
		this.frame = 0;//画像フレーム
		this.x = 208;//Ｘ座標
		this.y = 248;//Ｙ座標
		this.vx = 0;//Ⅹ軸移動量
		this.vy = 0;//Ｙ軸移動量
		this.ac = 0;//移動量の変化率
		this.speed = 10;//移動量の大きさ
		this.degree = 90;//角度
		this.rotation = 0;
		this.life = 640;
		
		//攻撃フラグ 論理値 true/攻撃中, false/攻撃していない 
		this.attack_flag = false;
		
		// 攻撃アニメーションパターン番号 
		this.attack_pattern = 0;
		
		// フライトアニメーションパターン番号 
		this.fright_pattern = 0;
		
		// アニメーションカウント
		this.count = 0;
		
		//攻撃アニメーション配列
		this.attack = [7,5,6,7,8,9,-1];
		
		//フライトアニメーション配列
		this.fright = [0,1,2,3];
		
	},
	
	//表示位置更新メゾッド
	updatePosition: function(){
		if(core.input.left == true && this.speed > 0){
	   		this.degree++;
		}
		else if(core.input.right == true && this.speed > 0){
	 	  	this.degree--;
		}
		if(core.input.up == true && this.speed < 24){
			this.ac =  0.4;
		}
		else if(core.input.down == true && this.speed > 12){
			this.ac = -0.4;
		}
		else{
			this.ac = 0;
		}
		if(this.speed<0){
			this.life = 0;
		}
		
		//加速度から速さを出す
		this.speed = this.speed + this.ac;
		//分解する
		this.vx = this.speed * cos(this.degree);
		this.vy = this.speed * sin(this.degree);
		
		//速度から座標
		this.x = this.x + this.vx;
		this.y = this.y - this.vy;
		//ローテーションさせる
		this.rotation = 90 - this.degree ;
		
		if(this.x < 0){
		  	this.x = 0;
	  		this.vx = - this.vx * 0.1;
	  		this.degree = this.degree = Vector_Phase(this.vx,this.vy);
	  	}
	  	if(this.x > 480-32){
	  		this.x = 480-32;
		  	this.vx = - this.vx * 0.1;
		  	this.degree = this.degree = Vector_Phase(this.vx,this.vy);
	  	}
	},
		
	//アニメーション更新メゾッド
	updateAnimation: function(){
		
		// 攻撃中ではない時処理をする 
		if(this.attack_flag == false){
			
			// 指定時間フレーム毎に歩くアニメーションをさせる 
			if((this.count % 2)==0){
				
				this.fright_pattern = core.frame % 4;
				
				// 画像フレーム番号を歩く配列の要素から取得する 
				this.frame = this.fright[this.fright_pattern];
			}
		}
		
		// 攻撃中の時処理をする 
		else{
			
			// 指定時間フレーム毎に攻撃するアニメーションをさせる 
			if(this.count % 2 == 0){
				
				
				
				// 画像フレーム番号を攻撃する配列の要素から取得する 
				this.frame = this.attack[this.attack_pattern];
				
				// アニメーションパターン番号を 1 増やす
				this.attack_pattern++;
				
				// 攻撃アニメーション終了時に処理をする 
				if(this.frame == -1){
					
					// 画像フレームを 0 番にする
					this.frame = 6;
					// 攻撃してないに切り替える
					this.attack_flag = false;
					
					
				}
				
			}
			
		
		}
		
		
	},
		
	
	onenterframe: function(){
		
		this.updatePosition();//表示位置更新メゾッド
		this.updateAnimation();//アニメーション更新メゾッド
		this.count++;
		this.y = this.y + this.vy;//カメラ
	}

}); // プレイヤークラス 終了 ///////////////////////////////////////
//Nanabeam
NanaBeam = Class.create(Sprite, {
	//初期
	initialize: function(){
		
		// スプライトクラスを呼び出して、スプライトクラスのメソッドとプロパティを使えるようにする 
		Sprite.call(this,32,32);
		this.image = core.assets["./images/effect.png"];//使用画像
		this.x = 208;//Ｘ座標
		this.y = 248;//Ｙ座標
		this.vx = 0;//Ⅹ軸移動量
		this.vy = 0;//Ｙ軸移動量
		this.frame = 0;// 画像フレーム
		this.count = 0;
		
	},
	
	//表示位置更新メゾッド
	updatePosition: function(){
		
		this.vx = 10*Math.sin(this.count/10);
			
		this.vy = 5;
		
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
		
	},
		
	//設置
	set: function(x,y){
		
		//座標決定
		this.x = x;
		this.y = y;
	},
	
	//一時間フレーム毎に処理をする
	onenterframe: function(){
		
		//表示位置更新メゾッド
		this.updatePosition();
		
		this.count++;

	}
});

 // プレイヤービームクラス 開始 ///////////////////////////////////////////////////////////////////
PlayerBeam = Class.create(Sprite, {
	
	// 初期化 
	initialize: function(){
		
		// スプライトクラスを呼び出して、スプライトクラスのメソッドとプロパティを使えるようにする 
		Sprite.call(this,16,16);
		
		// プレイヤービームに使用する画像を指定する
		this.image = core.assets["./images/icon0.png"];
		this.vx = 0;//Ⅹ軸移動量
		this.vy = 0;//Ｙ軸移動量
		// プレイヤービームの画像フレームを指定する 
		this.frame = 48;
		
		// プレイヤービームのスピードを指定する 
		this.speed = 4;
	},
	
	// 位置を決める 
	set:function(x,y,degree){
		this.x = x;
		this.y = y;
		this.degree = degree;
	},
	
	//移動
	move: function(){
		//分解する
		this.vx = this.speed * cos(this.degree);
		this.vy = this.speed * sin(this.degree);
		
		//速度から座標
		this.x = this.x + this.vx;
		this.y = this.y - this.vy;
		//ローテーションさせる
		this.rotation = 90 - this.degree ;
	},
	
	// プレイヤービームのフレームイベント 
	onenterframe: function(){
		
		//移動
		this.move();
		
	}

});

/*ポーズクラス
シーンクラスを継承
*/
Pause = Class.create(Scene, {
	
	//オブジェクト初期化メゾッド
	initialize: function(){
		this.key_flag = true;
		this.key_flag_2 = true;
		//選択番号用
		this.a = 0;
		this.b = 0;
		
		
		Scene.call(this);// シーンクラスを呼び出す
		
		
		
	},
	
	select: function(){
		
		//右を押すと
		if(core.input.right == true && this.key_flag_2 == false){ 
			this.a++;
		}
		//左を押すと
		else if(core.input.left == true && this.key_flag_2 == false){ 
			this.a--;
		}
		//上を押すと
		else if(core.input.up == true && this.key_flag_2 == false){ 
			this.b --;
		}
		//上を押すと
		else if(core.input.up == true && this.key_flag_2 == false){ 
			this.b ++;
		}
		
		//spaceを押すと
		if(core.input.space == true && this.key_flag_2 == false){ 
			
			//1,0のときゲーム終了
			if(this.a == 1 && this.b==0){
				core.end();
			}
			
		}
		
		
		//ボタンがおされたとき
		if((core.input.down == true || core.input.up == true)+(core.input.right == true || core.input.left == true)){
			
			this.key_flag_2 = true;
		}
		
		else if(core.input.space == true){
			
			this.key_flag_2 = true;
			
		}
		
		else{
			
			this.key_flag_2 = false;
			
		}
		
		
		
		
	},
	
	
	//ポップメゾッド
	pop: function(){
		//エンターを押すと
		if(core.input.enter == true && this.key_flag == false){ 
			
			core.input.enter = false;
			core.input.down = false;
			core.input.up = false;
			core.input.right = false;
			core.input.left = false;
			core.input.space = false;
				document.getElementById('debug_message').innerHTML = "";
	document.getElementById('debug').style.visibility = "hidden"
			core.popScene(this);//ポーズ削除
			
		
		}
		
		//エンターがおされたとき
		if(core.input.enter == true){
			
			this.key_flag = true;
		}
		
		else{
			
			this.key_flag = false;
			
		}
		
	},
	
	onenterframe: function(){
		
		//.this.select();
		bgm_frame++;
	//	debug(bgm_frame);
		if(bgm_loop_start == false && bgm_frame > 755){
				music.stop();
				bgm_loop_start = true;
				music = Sound.load("./musics/illidas-1.mp3");
				music.play();
			}
			if(bgm_loop_start == true && (bgm_frame-755) % (5900-755) == 0){
				music.stop();
				bgm_loop_start = true;
				music = Sound.load("./musics/illidas-1.mp3");
				music.play();
			}
		this.pop();
		
			
	}
	
});
////////////////////////////////////////////////////
// ウィンドウが読み込まれたら実行
window.onload = function(){
	
	var bgm_start_flag = false;

	
	// コアオブジェクトの生成
	core = new Core(480, 320);
	//Ilidas NanaのPreload
	core.preload("./images/nana.png");
	//Player
	core.preload("./images/roket.PNG");
	//Beam Image
   core.preload("./images/icon0.png");
   core.preload("./images/effect.png");
   core.preload("./images/space1.png");
  //Ketboard
  core.keybind(13,"enter");
	core.keybind(32,"space");
	core.keybind(16,"shift");

   //sound
   core.preload("./sound/launcher1.mp3");//打つ
   core.preload("./sound/short_bomb.mp3");//当たった
   core.preload("./sound/small_explosion1.mp3");//火
   core.preload("./sound/jet_crash.mp3");//GAME OVER
	//BGMのPreload
	core.preload("./musics/illidas-1.mp3");
	core.preload("./musics/ilidas-2.mp3");
	// コアオブジェクトが読み込まれたら実行
	core.onload = function(){
		
		se01 = Sound.load("./sound/bomb4.wav");
		se02 = Sound.load("./sound/bomb1.wav");
		se03 = Sound.load("./sound/bomb2.wav");
		
		sprite_ilidas_flying = new Ilidas_Flying();//イリダス(I)オブジェクトの生成
		core.rootScene.addChild(sprite_ilidas_flying);//ルートシーンにイリダス(I)を追加
		sprite_player_rocket = new Aie_Rocket();//ロケットオブジェクトの生成
		core.rootScene.addChild(sprite_player_rocket);//ルートシーンにロケットを追加
		label_HP_ilidas_flying = new Life("Ilidas",sprite_ilidas_flying,3);//
		core.rootScene.addChild(label_HP_ilidas_flying);//
		label_HP_player = new Life("Player",sprite_player_rocket,1);//
		core.rootScene.addChild(label_HP_player);//
		

		// ルートシーンのフレームイベント 開始 /////////////////////////////////////// 
		core.rootScene.onenterframe = function(){
			
			//BGM再生
			if(bgm_start_flag == false){
				bgm_start_flag = true;
				music = Sound.load("./musics/ilidas-2.mp3");
				music.play();
				bgm_frame = 0;
			}
	//		debug(bgm_frame);
			if(bgm_loop_start == false && bgm_frame > 755){
				music.stop();
				bgm_loop_start = true;
				music = Sound.load("./musics/illidas-1.mp3");
				music.play();
			}255
			if(bgm_loop_start == true && (bgm_frame-755) % (5900-755) == 0){
				music.stop();
				bgm_loop_start = true;
				music = Sound.load("./musics/illidas-1.mp3");
				music.play();
			}
			
			//ilidas_flyingが存在しているときの動作/////////////////////////
			if(sprite_ilidas_flying != null){
				//ilidas が やられる
				if(sprite_ilidas_flying.life <= 0){
				
					// ルートシーンからiliasを消す
					core.rootScene.removeChild(sprite_ilidas_flying);
			
					//データを空にする
					sprite_ilidas_flying = null;
				
				}
				
				//プレイヤーが存在するとき
				if(sprite_player_rocket != null){
					if(sprite_player_rocket.within(sprite_ilidas_flying,20)){
						sprite_player_rocket.life = sprite_player_rocket.life -30;
						se02.clone().play();
						//フォントを変える
						label_HP_player.change("player",sprite_player_rocket,1);
					}
					if(sprite_ilidas_flying.rush_flag == false){
						//イリダスの下にプレイヤーがいるとき
						if((Vector_Phase(sprite_player_rocket.x-sprite_ilidas_flying.x,sprite_player_rocket.y-sprite_ilidas_flying.y)>30)*(Vector_Phase(sprite_player_rocket.x-sprite_ilidas_flying.x,sprite_player_rocket.y-sprite_ilidas_flying.y)<90)){
						
							//ビーム発射する
							sprite_ilidas_flying.nanabeam = true;
							sprite_ilidas_flying.traffic = false;
						}
						else{
							
							//ビーム発射しない
							sprite_ilidas_flying.nanabeam = false;
							sprite_ilidas_flying.traffic = true;
					
						}
					}
					//突進する
					if(sprite_ilidas_flying.rush_flag==true){
						
						if(sprite_ilidas_flying.y > 300){
							sprite_ilidas_flying.degree = 270;
						}
						else if(sprite_ilidas_flying.degree == 270 && sprite_ilidas_flying.y < 50){
							sprite_ilidas_flying.rush_flag = false;
							sprite_ilidas_flying.y = 50;
							sprite_ilidas_flying.degree=0;
						}
							
					}
						
					
				
				}
				// 指定時間フレーム毎に処理をする
				if(core.frame % 30 == 0){
					
					//ナナビームを撃てるとき
					if(sprite_ilidas_flying.nanabeam == true){
				// 
						i = sprite_nana_beam.length;
					
						//ナナビームを生成する 
						sprite_nana_beam[i] = new NanaBeam();
				
						//位置を設定する
						sprite_nana_beam[i].set(sprite_ilidas_flying.x +16 ,sprite_ilidas_flying.y+16);
				
						// ルートシーンに追加する
						core.rootScene.addChild(sprite_nana_beam[i]);
				
						//se03を再生する
						se03.clone().play();
					
					}
					
					//ナナビームを撃てるないときは石を投げる
					else{
						
						i = sprite_stone.length;
						
						//ただし5個まで
						if(i<5){
							
							//石を生成する 
							sprite_stone[i] = new Stone();
				
							//位置を設定する
							sprite_stone[i].set(sprite_ilidas_flying.x +16 ,sprite_ilidas_flying.y+16);
				
							// ルートシーンにスライムを追加する
							core.rootScene.addChild(sprite_stone[i]);
						
						}
						
						if(sprite_ilidas_flying.rush_flag == false && i>3){
							//突進するフラグをTrueにする
							sprite_ilidas_flying.rush_flag = true;
							sprite_ilidas_flying.traffic = false;
							sprite_ilidas_flying.degree = Vector_Phase(sprite_player_rocket.x-sprite_ilidas_flying.x,sprite_player_rocket.y-sprite_ilidas_flying.y);
							sprite_ilidas_flying.speed = 10;
						}
					
					}
				
				}
			
			}///////////////////////////////////////////////////////////////////
			
			
			// 変数を宣言する 
			var i,j;
			
			//プレイヤービーム生成
			
			// 指定時間フレーム毎に処理をする
			if(core.frame % 4 == 0){
				
				// 変数 i にプレイヤービームの配列の⻑さを入れる 
				i = sprite_playerbeam.length;
				
				// ビームが出せる時 
				if(i<10 && core.input.space == true){
					
					// プレイヤービームを生成する 
					sprite_playerbeam[i] = new PlayerBeam();
					
					// プレイヤービームの位置をセットする 
					// 引数 1 はX軸の値、引数 2 はY軸の値 
					sprite_playerbeam[i].set(sprite_player_rocket.x + 8 * sin(sprite_player_rocket.degree),sprite_player_rocket.y + 16 * cos(sprite_player_rocket.degree),sprite_player_rocket.degree);
					
					// ルートシーンにプレイヤービームを追加する 
					core.rootScene.addChild(sprite_playerbeam[i]);
					
					//se01を再生する
					se01.clone().play();
					
					sprite_player_rocket.attack_flag = true;
					sprite_player_rocket.attack_pattern = 0 + random(2);
				}
			}
			//ビームが上までいったら消滅////////////////////////////
			// 変数 i の値を 0 にする 
	        i = 0;
	        
	        // プレイヤービームの数だけ繰り返す
	        while(i < sprite_playerbeam.length){
	        	
	        	// プレイヤービームが画面外まで移した時 
				if(((sprite_playerbeam[i].y < -16)+(sprite_playerbeam[i].y > 250))||((sprite_playerbeam[i].x < -16)+(sprite_playerbeam[i].x > 500))){
					
					// ルートシーンから指定したプレイヤービームオブジェクトを削除する 
					core.rootScene.removeChild(sprite_playerbeam[i]); 
					
					// 指定したインデックスを削除して左詰する
					sprite_playerbeam.splice(i,1);
					
					// ループを抜ける 
					break;
				}
				
				// ループカウントを 1 増やす 
				i++;
			}
			//石が上までいったら消滅////////////////////////////
			// 変数 i の値を 0 にする 
	        i = 0;
	        
	        // 石の数だけ繰り返す
	        while(i < sprite_stone.length){
	        	
	        	// 石が画面外まで移した時 
				if(((sprite_stone[i].y < -16)+(sprite_stone[i].y > 250))||((sprite_stone[i].x < -16)+(sprite_stone[i].x > 500))){
					
					// ルートシーンから指定した石オブジェクトを削除する 
					core.rootScene.removeChild(sprite_stone[i]); 
					
					// 指定したインデックスを削除して左詰する
					sprite_stone.splice(i,1);
					
					// ループを抜ける 
					break;
				}
				
				// ループカウントを 1 増やす 
				i++;
			}
			////////////////////////////////////////////////////////
			
			//石の向きの変化
			if(sprite_player_rocket != null){
				//変数 i の値を 0 にする
				i = 0;
			
				while(i < sprite_stone.length){
					if(sprite_stone[i].speed>0){
						sprite_stone[i].degree = Vector_Phase(sprite_player_rocket.x-sprite_stone[i].x,sprite_player_rocket.y-sprite_stone[i].y);
					}
					i++;
				}
				i = 0;
				while(i < sprite_stone.length){
					if(sprite_stone[i].y>200){
						sprite_stone[i].degree = 90;
						
					}
					i++;
				}
			}
			
			//イリダス(I)のHPの変化////////////////////////////////////////////////
			//変数 i の値を 0 にする
			i = 0;
			
			// プレイヤービームの数だけ繰り返す
			while(i < sprite_playerbeam.length){
				
				//プレイヤービームがilidas_flyingにぶつかったら
				if(sprite_ilidas_flying != null){
					
					
					if(sprite_playerbeam[i].within(sprite_ilidas_flying,24)){
					//ルートシーンから指定したプレイヤービームオブジェクトを削除する 
					core.rootScene.removeChild(sprite_playerbeam[i]);
					
					//指定したインデックスを削除して左詰する 
					sprite_playerbeam.splice(i,1);
					
					//se02を再生する
					se02.clone().play();
					
					
					//ilidas_flyingのHPを減らす
					sprite_ilidas_flying.life=sprite_ilidas_flying.life-60;
					
					//フォントを変える
					label_HP_ilidas_flying.change("Ilidas",sprite_ilidas_flying,3);
					}
				}
				
				// ループカウントを 1 増やす 
				i = i + 1;
			}
			
			//変数 i の値を 0 にする
			i = 0;
			
			// 石の数だけ繰り返す
			while(i < sprite_stone.length){	
				//石がilidas_flyingにぶつかったら
				if(sprite_ilidas_flying != null){
					
					
					if((sprite_stone[i].within(sprite_ilidas_flying,20))*(sprite_stone[i].speed<0)){
						
						//ルートシーンから指定した石オブジェクトを削除する 
						core.rootScene.removeChild(sprite_stone[i]);
					
						//指定したインデックスを削除して左詰する 
						sprite_stone.splice(i,1);
					
						//se02を再生する
						se02.clone().play();
					
					
						//ilidas_flyingのHPを減らす
						sprite_ilidas_flying.life=sprite_ilidas_flying.life-15;
					
						//フォントを変える
						label_HP_ilidas_flying.change("Ilidas",sprite_ilidas_flying,3);
					}
				}
				
				// ループカウントを 1 増やす 
				i = i + 1;
			}
			
			
			
			//NanaBeamとPlayer
			// 変数 j の値を 0 にする 
			j = 0;
			
			// NanaBeamの数だけ繰り返す 
			while(j < sprite_nana_beam.length){
				
				// プレイヤーとLaunchの衝突判定をする 
				if(sprite_player_rocket.within(sprite_nana_beam[j],20)){
					
					// プレイヤーは１ライフが減る
					sprite_player_rocket.life = sprite_player_rocket.life - 30;
					
					//フォントを変える
					label_HP_player.change("player",sprite_player_rocket,1);
					
					//ルートシーンから指定したLaunchオブジェクトを削除する 
					core.rootScene.removeChild(sprite_nana_beam[j]);
					
					//指定したインデックスを削除して左詰する 
					sprite_nana_beam.splice(j,1);
					
					//se02を再生する
					se02.clone().play();
					
				}
				
				// ループカウントを 1 増やす 
				j++;
				
			}// プレイヤーとビームの衝突判定 終了 ///////////////
			
			
			//石とプレイヤーの衝突判定
			// 変数 j の値を 0 にする 
			j = 0;
			
			// 石の数だけ繰り返す 
			while(j < sprite_stone.length){
				
				// プレイヤーと石の衝突判定をする 
				if(sprite_player_rocket.within(sprite_stone[j],20)){
					
					// プレイヤーはライフが減る
					sprite_player_rocket.life = sprite_player_rocket.life - 10;
					
					//フォントを変える
					label_HP_player.change("player",sprite_player_rocket,1);
					
					//ルートシーンから指定したLaunchオブジェクトを削除する 
					core.rootScene.removeChild(sprite_stone[j]);
					
					//指定したインデックスを削除して左詰する 
					sprite_stone.splice(j,1);
					
					//se02を再生する
					se02.clone().play();
					
				}
				
				// ループカウントを 1 増やす 
				j++;
				
			}// プレイヤーと石の衝突判定 終了 ///////////////
			
			// プレイヤービームと石の衝突判定 開始 ///////////////////// 
			// 変数 i の値を 0 にする
			i = 0;
			
			// 2 重ループを抜けるフラグ（初期値） 
			// true : 抜ける、 false : そのまま 
			var flag = false;
			
			//ビームの数だけ判定する
			while(i < sprite_playerbeam.length){
				
				// 変数 j の値を 0 にする 
				j = 0;
				
				// 石の数だけ繰り返す
				while(j < sprite_stone.length){
					
					// プレイヤービームと石が衝突したか判定する
			        if(sprite_playerbeam[i].within(sprite_stone[j], 8)){
			        	
			        	// ルートシーンから指定したプレイヤービームを削除する 
						core.rootScene.removeChild(sprite_playerbeam[i]);
						
						// 指定したインデックスを削除して左詰にする 
						sprite_playerbeam.splice(i,1);
						
						sprite_stone[j].speed = sprite_stone[j].speed -3;
						
						// 2 重ループフラグを true にする 
						flag = true;
						
						// ループを抜ける 
						break;
						
					}
					// ループカウントを 1 増やす 
			    	j++;
		    	}
		    	
		    	// 2 重ループを抜けるか判定する 
		    	if(flag == true){
		    		
		    		// ループを抜ける 
			    	break;
			    	
		    	}
		    	
		    	// ループカウントを 1 増やす 
		    	i++;
	        }
	        
	        // 変数 i の値を 0 にする 
	        i = 0;
	        
	        // プレイヤービームの数だけ繰り返す
	        while(i < sprite_playerbeam.length){
	        	
	        	// プレイヤービームが画面の上まで移した時 
				if(sprite_playerbeam[i].y < -16){
					
					// ルートシーンから指定したプレイヤービームオブジェクトを削除する 
					core.rootScene.removeChild(sprite_playerbeam[i]); 
					
					// 指定したインデックスを削除して左詰する
					sprite_playerbeam.splice(i,1);
					
					// ループを抜ける 
					break;
				}
				
				// ループカウントを 1 増やす 
				i++;
			}
			
			
			
			//フォントを変える
			label_HP_player.change("Player",sprite_player_rocket,1);
			
			//エンターを押すと
			if(core.input.enter == true){ 
				
				var pause = new Pause(); //ポーズ生成
				
				core.pushScene(pause);//ポーズ追加
			//	debug("tur ha mesa hu. kamo tur game ha muþan.");
				//debug(bgm_frame);

			
			}
			else{
				bgm_frame++;
			}
		}
		
		
		core.rootScene.backgroundColor = "rgb(30,15,4)";


	}

	// ゲーム開始
	core.start();
}
