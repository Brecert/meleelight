twoPi = Math.PI*2;

function drawArrayPathNew(can,col,face,tX,tY,path,scaleX,scaleY,rotate,rpX,rpY){
  // scaleX = 0.24*(stage.scale/4.5);
  // scaleY = 0.24*(stage.scale/4.5);
  //fg1.globalCompositeOperation="xor";
  can.save();
  can.translate(tX-rpX,tY-rpY);
  can.rotate(rotate);
  for (var j=0;j<path.length;j++){
    var x = (path[j][0]*scaleX*face)+rpX;
    var y = (path[j][1]*scaleY)+rpY;
    if (j == 0){
      can.fillStyle = col;
      can.beginPath();
      can.moveTo(x,y);
    }
    else {
      if (path[j].length == 2){
        can.moveTo(x,y);
      }
      else {
        can.bezierCurveTo(x,y,(path[j][2]*scaleX*face)+rpX,(path[j][3]*scaleY)+rpY,(path[j][4]*scaleX*face)+rpX,(path[j][5]*scaleY)+rpY);
      }
    }
  }
  can.closePath();
  can.fill();
  can.restore();
}

function drawArrayPath(can,col,face,tX,tY,path,scaleX,scaleY){
  for (var j=0;j<path.length;j++){
    var x = (path[j][0]*scaleX*face)+tX;
    var y = (path[j][1]*scaleY)+tY;
    if (j == 0){
      can.fillStyle = col;
      can.beginPath();
      can.moveTo(x,y);
    }
    else {
      can.lineTo(x,y);
    }
  }
  can.closePath();
  can.fill();
}

function renderPlayer(i){
  var temX = (player[i].phys.pos.x*stage.scale) + stage.offset[0];
  var temY = (player[i].phys.pos.y*-stage.scale) +stage.offset[1];
  var face = player[i].phys.face;
  var frame = Math.floor(player[i].timer);
  if (frame == 0){
    frame = 1;
  }
  if (frame > frames[cS[i]][player[i].actionState]){
    frame = frames[cS[i]][player[i].actionState];
  }

  var model = animations[cS[i]][player[i].actionState][frame-1];

  if (aS[cS[i]][player[i].actionState].reverseModel){
    face *= -1;
  }
  else if (player[i].actionState == "TILTTURN"){
    if (frame > 5){
      face *= -1;
    }
  }
  else if (player[i].actionState == "RUNTURN"){
    if (frame > aS[cS[i]].RUNTURN.reverseModelFrame){
      face *= -1;
    }
  }
  // JiGGS MULTIJUMP TURN
  else if (player[i].actionState.substring(0, player[i].actionState.length-1) == "AERIALTURN" && player[i].timer > 5){
    face *= -1;
  }
  // MARTH BAIR
  else if (player[i].actionState == "ATTACKAIRB" && cS[i] == 0){
    if (frame > 29){
      face *= -1;
    }
  }

  if (!aS[cS[i]][player[i].actionState].dead){
    var col;
    if (player[i].phys.shielding && player[i].phys.powerShielded && player[i].hit.hitlag > 0){
      col = "rgb(255,255,255)";
    }
    else if (player[i].phys.intangibleTimer % 9 > 3 || player[i].phys.invincibleTimer % 9 > 3 || player[i].hit.hitlag > 0){
      col = palettes[pPal[i]][1];
    }
    else if (player[i].phys.charging && player[i].phys.chargeFrames % 9 > 3){
      col = "rgb(252, 255, 91)";
    }
    else if (player[i].actionState == "FURAFURA" && player[i].timer % 30 < 6){
      col = palettes[pPal[i]][3];
    }
    else if (player[i].colourOverlayBool){
      col = player[i].colourOverlay;
    }
    else {
      col = palettes[pPal[i]][0];
    }
    if (player[i].phys.chargeFrames % 4 == 3){
      temX += 2;
    }
    else if (player[i].phys.chargeFrames % 4 == 1){
      temX -= 2;
    }
    if (temX > 1220 || temX < -20 || temY > 880 || temY < -30){
      var pA = new Vec2D(temX-600,temY-375);
      var pB = new Vec2D(0,0);
      var s = (pA.y-pB.y)/(pA.x-pB.x);
      if (-375 <= s * 600 && s*600<= 375){
        if (pA.x > pB.x){
          player[i].miniViewPoint = new Vec2D(1150,s*600+375);
          player[i].miniViewSide = 0;
        }
        else {
          player[i].miniViewPoint = new Vec2D(50,-s*600+375);
          player[i].miniViewSide = 1;
        }
        player[i].miniView = true;
        player[i].phys.outOfCameraTimer++;
      }
      else if (-600 <= 375/s && 375/s<= 600){
        if (pA.y > pB.y){
          if (temX < 50){
            player[i].miniViewPoint = new Vec2D(50,700);
          }
          else if (temX > 1150){
            player[i].miniViewPoint = new Vec2D(1150,700);
          }
          else {
            //player[i].miniViewPoint = new Vec2D(375/s+stage.offset[0],700);
            player[i].miniViewPoint = new Vec2D(temX,700);
          }
          player[i].miniViewSide = 2;
        }
        else {
          player[i].miniViewPoint = new Vec2D(-375/s+stage.offset[0],50);
          player[i].miniViewSide = 2;
        }
        player[i].miniView = true;
        player[i].phys.outOfCameraTimer++;
      }
      else {
        player[i].miniView = false;
        player[i].phys.outOfCameraTimer = 0;
      }
    }
    else {
      player[i].miniView = false;
      player[i].phys.outOfCameraTimer = 0;
    }
    if (player[i].miniView && player[i].actionState != "SLEEP"){
      fg1.fillStyle = "black";
      fg1.strokeStyle = palettes[pPal[i]][0];
      fg1.beginPath();
      fg1.arc(player[i].miniViewPoint.x,player[i].miniViewPoint.y,35,twoPi,0);
      fg1.fill();
      fg1.lineWidth = 6;
      fg1.stroke();
      fg1.lineWidth = 1;

      drawArrayPathNew(fg1,col,face,player[i].miniViewPoint.x,player[i].miniViewPoint.y+30,model,player[i].charAttributes.miniScale,player[i].charAttributes.miniScale,player[i].rotation,player[i].rotationPoint.x,player[i].rotationPoint.y);
    }
    else {
      if (player[i].actionState == "ENTRANCE"){
        drawArrayPathNew(fg1,col,face,temX,temY,model,player[i].charAttributes.charScale*(stage.scale/4.5),Math.min(player[i].charAttributes.charScale,player[i].charAttributes.charScale*(1.5-startTimer))*(stage.scale/4.5),player[i].rotation,player[i].rotationPoint.x,player[i].rotationPoint.y);
      }
      else {
        drawArrayPathNew(fg1,col,face,temX,temY,model,player[i].charAttributes.charScale*(stage.scale/4.5),player[i].charAttributes.charScale*(stage.scale/4.5),player[i].rotation,player[i].rotationPoint.x,player[i].rotationPoint.y);
      }
    }
  }
  if (player[i].phys.shielding){
    if (!(player[i].phys.powerShielded && player[i].hit.hitlag > 0)){
      var sX = ((player[i].phys.shieldPositionReal.x)*stage.scale) + stage.offset[0];
      var sY = ((player[i].phys.shieldPositionReal.y)*-stage.scale) +stage.offset[1];
      var sCol = palettes[pPal[i]][2];
      if (Math.floor(player[i].hit.shieldstun) > 0){
        sCol = palettes[pPal[i]][4];
      }
      fg1.fillStyle = sCol+(0.6*player[i].phys.shieldAnalog)+")";
      fg1.beginPath();
      fg1.arc(sX,sY,player[i].phys.shieldSize*stage.scale,twoPi,0);
      fg1.fill();
    }
  }
  if (hasTag[i]){
    fg1.fillStyle = makeColour(0,0,0,0.5);
    fg1.strokeStyle = palettes[pPal[i]][0];
    var size = 10*tagText[i].length
    fg1.fillRect(temX-size/2,temY-130*(stage.scale/4.5),size,20);
    fg1.strokeRect(temX-size/2,temY-130*(stage.scale/4.5),size,20);
    fg1.font = "13px Lucida Console, monaco, monospace";
    fg1.textAlign = "center";
    fg1.fillStyle = "white";
    fg1.fillText(tagText[i],temX,temY+15-130*(stage.scale/4.5));
    fg1.fillStyle = palettes[pPal[i]][0];
    fg1.beginPath();
    fg1.moveTo(temX-8,temY+20-130*(stage.scale/4.5));
    fg1.lineTo(temX+8,temY+20-130*(stage.scale/4.5));
    fg1.lineTo(temX,temY+28-130*(stage.scale/4.5));
    fg1.closePath();
    fg1.fill();
    fg1.textAlign = "start";
  }
  if (player[i].actionState == "REBIRTH" || player[i].actionState == "REBIRTHWAIT"){
    fg1.fillStyle = palettes[pPal[i]][1];
    fg1.strokeStyle = palettes[pPal[i]][0];
    fg1.beginPath();
    fg1.moveTo(temX+18*(stage.scale/4.5),temY+13.5*(stage.scale/4.5));
    fg1.lineTo(temX+31.5*(stage.scale/4.5),temY);
    fg1.lineTo(temX-31.5*(stage.scale/4.5),temY);
    fg1.lineTo(temX-18*(stage.scale/4.5),temY+13.5*(stage.scale/4.5));
    fg1.closePath();
    fg1.fill();
    fg1.stroke();
  }
  if (player[i].showLedgeGrabBox){
    fg1.strokeStyle = "#4478ff";
    fg1.strokeRect(player[i].phys.ledgeSnapBoxF.min.x*stage.scale+stage.offset[0],player[i].phys.ledgeSnapBoxF.min.y*-stage.scale+stage.offset[1],14*stage.scale,10*stage.scale);
    fg1.strokeStyle = "#ff4444";
    fg1.strokeRect(player[i].phys.ledgeSnapBoxB.min.x*stage.scale+stage.offset[0],player[i].phys.ledgeSnapBoxB.min.y*-stage.scale+stage.offset[1],14*stage.scale,10*stage.scale);
  }
  if (player[i].showECB){
    fg1.fillStyle = "#ff8d2f";
    fg1.beginPath();
    fg1.moveTo((player[i].phys.ECB1[0].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[0].y*-stage.scale)+stage.offset[1]);
    fg1.lineTo((player[i].phys.ECB1[1].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[1].y*-stage.scale)+stage.offset[1]);
    fg1.lineTo((player[i].phys.ECB1[2].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[2].y*-stage.scale)+stage.offset[1]);
    fg1.lineTo((player[i].phys.ECB1[3].x*stage.scale)+stage.offset[0],(player[i].phys.ECB1[3].y*-stage.scale)+stage.offset[1]);
    fg1.closePath();
    fg1.fill();
    fg1.strokeStyle = "white";
    fg1.beginPath();
    fg1.moveTo((player[i].phys.ECBp[0].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[0].y*-stage.scale)+stage.offset[1]);
    fg1.lineTo((player[i].phys.ECBp[1].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[1].y*-stage.scale)+stage.offset[1]);
    fg1.lineTo((player[i].phys.ECBp[2].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[2].y*-stage.scale)+stage.offset[1]);
    fg1.lineTo((player[i].phys.ECBp[3].x*stage.scale)+stage.offset[0],(player[i].phys.ECBp[3].y*-stage.scale)+stage.offset[1]);
    fg1.closePath();
    fg1.stroke();
    fg1.beginPath();
    fg1.moveTo(temX,temY-6);
    fg1.lineTo(temX,temY+6);
    fg1.closePath();
    fg1.stroke();
    fg1.beginPath();
    fg1.moveTo(temX+6,temY);
    fg1.lineTo(temX-6,temY);
    fg1.closePath();
    fg1.stroke();
  }
  if (player[i].showHitbox){
    fg1.fillStyle = hurtboxColours[player[i].phys.hurtBoxState];
    fg1.fillRect(player[i].phys.hurtbox.min.x*stage.scale+stage.offset[0],player[i].phys.hurtbox.min.y*-stage.scale+stage.offset[1],player[i].charAttributes.hurtboxOffset[0]*2*stage.scale,player[i].charAttributes.hurtboxOffset[1]*stage.scale);
    fg1.fillStyle = makeColour(255,29,29,0.69);
    for (var j=0;j<4;j++){
      switch (j){
        case 0:
          fg1.fillStyle = makeColour(255,29,29,0.69);
          fg1.strokeStyle = makeColour(255,126,126,0.69);
          break;
        case 1:
          fg1.fillStyle = makeColour(47,255,29,0.69);
          fg1.strokeStyle = makeColour(126,252,115,0.69);
          break;
        case 2:
          fg1.fillStyle = makeColour(29,208,255,0.69);
          fg1.strokeStyle = makeColour(117,226,255,0.69);
          break;
        case 3:
          fg1.fillStyle = makeColour(203,29,255,0.69);
          fg1.strokeStyle = makeColour(216,116,246,0.69);
          break;
        default:
          break;
      }
      if (player[i].hitboxes.active[j]){
        var offset = player[i].hitboxes.id[j].offset[player[i].hitboxes.frame];
        if (player[i].actionState == "DAMAGEFLYN"){
          offset = player[i].hitboxes.id[j].offset[0];
        }
        fg1.beginPath();
        fg1.arc(((offset.x*player[i].phys.face+player[i].phys.pos.x)*stage.scale)+stage.offset[0],((offset.y+player[i].phys.pos.y)*-stage.scale)+stage.offset[1],player[i].hitboxes.id[j].size*stage.scale,Math.PI*2,0);
        fg1.fill();
        if (player[i].phys.prevFrameHitboxes.active[j]){
          var offset = player[i].phys.prevFrameHitboxes.id[j].offset[player[i].phys.prevFrameHitboxes.frame];
          if (player[i].actionState == "DAMAGEFLYN"){
            offset = player[i].phys.prevFrameHitboxes.id[j].offset[0];
          }
          fg1.beginPath();
          fg1.arc(((offset.x*player[i].phys.facePrev+player[i].phys.posPrev.x)*stage.scale)+stage.offset[0],((offset.y+player[i].phys.posPrev.y)*-stage.scale)+stage.offset[1],player[i].phys.prevFrameHitboxes.id[j].size*stage.scale,Math.PI*2,0);
          fg1.fill();

          //console.log(player[i].phys.interPolatedHitbox[j]);
          fg1.beginPath();
          fg1.moveTo((player[i].phys.interPolatedHitbox[j][0].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][0].y*-stage.scale)+stage.offset[1]);
          fg1.lineTo((player[i].phys.interPolatedHitbox[j][1].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][1].y*-stage.scale)+stage.offset[1]);
          fg1.lineTo((player[i].phys.interPolatedHitbox[j][2].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][2].y*-stage.scale)+stage.offset[1]);
          fg1.lineTo((player[i].phys.interPolatedHitbox[j][3].x*stage.scale)+stage.offset[0],(player[i].phys.interPolatedHitbox[j][3].y*-stage.scale)+stage.offset[1]);
          fg1.closePath();
          fg1.fill();
          fg1.stroke();
        }
      }

    }
  }
  $("#actState"+i).empty().append(player[i].actionState);
  $("#stateNum"+i).empty().append(frame);
  $("#face"+i).empty().append(player[i].phys.face);
  $("#percent"+i).empty().append(player[i].percent);
}
lostStockQueue = [];
function renderOverlay(showStock){

  // stocks, percent, timer
  ui.strokeStyle = "black";
  if (!versusMode){
    ui.fillStyle = "white";
    ui.lineWidth = 2;
    ui.font = "900 40px Arial";
    ui.textAlign = "center";
    var min = (Math.floor(matchTimer/60)).toString();
    var sec = (matchTimer % 60).toFixed(2);
    ui.fillText(((min.length<2)?"0"+min:min)+":"+((sec.length<5)?"0"+sec[0]:sec[0]+sec[1]),590,70);
    ui.strokeText(((min.length<2)?"0"+min:min)+":"+((sec.length<5)?"0"+sec[0]:sec[0]+sec[1]),590,70);
    ui.font = "900 25px Arial";
    ui.fillText(((sec.length<5)?sec[2]+sec[3]:sec[3]+sec[4]),670,70);
    ui.strokeText(((sec.length<5)?sec[2]+sec[3]:sec[3]+sec[4]),670,70);
  }
  if (showStock){
    ui.font = "900 53px Arial";
    ui.lineWidth = 2;
    ui.textAlign = "end";
    ui.save();
    ui.scale(0.8,1);
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        ui.fillStyle = "rgb(255,"+Math.max(255-player[i].percent,0)+", "+Math.max(255-player[i].percent,0)+")";
        ui.fillText(Math.floor(player[i].percent)+"%",(450+i*145+player[i].percentShake.x)*1.25,670+player[i].percentShake.y);
        ui.strokeText(Math.floor(player[i].percent)+"%",(450+i*145+player[i].percentShake.x)*1.25,670+player[i].percentShake.y);
      }
    }
    ui.restore();
    for (var i=0;i<4;i++){
      if (playerType[i] > -1){
        ui.fillStyle = palettes[pPal[i]][0];
        for (var j=0;j<player[i].stocks;j++){
          ui.beginPath();
          ui.arc(337+i*145+j*30,600,12,0,twoPi);
          ui.closePath();
          ui.fill();
          ui.stroke();
        }
      }
    }
    lostStockPopQueue = [];
    ui.fillStyle = "white";
    ui.strokeStyle = "white";
    for (var i=0;i<lostStockQueue.length;i++){
      lostStockQueue[i][2]++;
      if (lostStockQueue[i][2] > 20){
        lostStockPopQueue.push(i);
      }
      else {
        ui.save();
        ui.translate(337+lostStockQueue[i][0]*145+lostStockQueue[i][1]*30-2,600-2);
        ui.fillRect(lostStockQueue[i][2],0,4,4);
        ui.fillRect(lostStockQueue[i][2],lostStockQueue[i][2],4,4);
        ui.fillRect(-lostStockQueue[i][2],lostStockQueue[i][2],4,4);
        ui.fillRect(lostStockQueue[i][2],-lostStockQueue[i][2],4,4);
        ui.fillRect(-lostStockQueue[i][2],-lostStockQueue[i][2],4,4);
        ui.fillRect(-lostStockQueue[i][2],0,4,4);
        ui.fillRect(0,lostStockQueue[i][2],4,4);
        ui.fillRect(0,-lostStockQueue[i][2],4,4);
        ui.beginPath();
        ui.arc(2,2,lostStockQueue[i][2]/2,0,twoPi);
        ui.closePath();
        ui.stroke();
        ui.restore();
      }
    }
    for (var k=0;k<lostStockPopQueue.length;k++){
      lostStockQueue.splice(lostStockPopQueue[k]-k, 1);
    }
    ui.textAlign = "start";
  }
}

function renderForeground(){
  // pause UI
  ui.fillStyle = "#8e8e8e";
  ui.save();
  ui.fillRect(45,48,300,24);
  ui.fillStyle = "#3724a6";
  ui.fillRect(60,50,50,20);
  ui.beginPath();
  ui.arc(60,60,10,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.beginPath();
  ui.arc(110,60,10,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.restore();
  ui.save();
  ui.translate(950,650);
  ui.fillRect(0,0,8,45);
  ui.fillRect(0,25,200,20);
  ui.fillRect(192,0,8,45);
  ui.fillRect(0,0,12,4);
  ui.fillRect(188,0,12,4);
  var xPos = 54;
  for (var j=0;j<3;j++){
    ui.fillRect(xPos-2,-6,4,12);
    ui.fillRect(xPos-6,-2,12,4);
    xPos += 46;
  }
  ui.beginPath();
  ui.arc(169,2,12,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#21792f";
  ui.beginPath();
  ui.arc(123,2,15,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#9a2622";
  ui.beginPath();
  ui.arc(40,62,12,0,twoPi);
  ui.closePath();
  ui.fill();
  ui.fillStyle = "#636363";
  ui.beginPath();
  ui.arc(31,2,15,0.8*Math.PI,twoPi);
  ui.closePath();
  ui.fill();
  ui.beginPath();
  ui.arc(77,2,15,twoPi/2,0.2*Math.PI);
  ui.closePath();
  ui.fill();
  //ui.fillRect(20,59,4,12)
  ui.fillRect(14,55,4,12);
  ui.fillRect(10,59,12,4);
  ui.fillRect(60,52,140,20);
  ui.fillStyle = "black";
  ui.font = "800 20px Arial";
  ui.fillText("S",158,8);
  ui.fillText("B",32,70);
  ui.fillText("Z",-872,-583);
  ui.font = "800 17px Arial";
  ui.fillText("T",170,9);
  ui.scale(1.2,1);
  ui.font = "900 24px Arial";
  ui.fillText("RESET",72,43);
  ui.fillText("L",17,7);
  ui.fillText("R",56,7);
  ui.fillText("A",93,9);
  ui.font = "900 20px Arial";
  ui.fillText("RUNBACK",53,70);
  ui.font = "900 18px Arial";
  ui.fillText("FRAME ADVANCE",-685,-584);
  ui.restore();
}
