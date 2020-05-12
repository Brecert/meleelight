import {playSounds, executeIntangibility, fastfall, airDrift, actionStates, getAngle} from "physics/actionStateShortcuts";
import {characterSelections, player} from "main/main";
export default {
  name : "ESCAPEAIR",
  canPassThrough : false,
  canGrabLedge : [false,false],
  wallJumpAble : false,
  headBonk : false,
  canBeGrabbed : true,
  landType : 1,
  vCancel : true,
  init : function(p,input){
    if(!player[p].canAirdodge) {
      return
    }
    player[p].actionState = "ESCAPEAIR";
    player[p].timer = 0;
    player[p].neutral = false
    player[p].canAirdodge = false
    if (Math.abs(input[p][0].lsX) > 0 || Math.abs(input[p][0].lsY) > 0){
      const ang = getAngle(input[p][0].lsX, input[p][0].lsY);
      player[p].phys.cVel.x = 3.1 * Math.cos(ang);
      player[p].phys.cVel.y = 3.1 * Math.sin(ang);
      player[p].phys.landingMultiplier = 3;
    }
    else {
      player[p].neutral = true
      player[p].canAirdodge = true
      player[p].phys.cVel.y += player[p].charAttributes.gravity;
      player[p].phys.landingMultiplier = 5;
      // player[p].phys.cVel.x = 0;
      // player[p].phys.cVel.y = 0;
    }
    player[p].phys.fastfalled = false;
    actionStates[characterSelections[p]].ESCAPEAIR.main(p,input);
  },
  main : function(p,input){
    player[p].timer++;
    if (!actionStates[characterSelections[p]].ESCAPEAIR.interrupt(p,input)){
      if(!player[p].neutral) {
        if (player[p].timer < 30){
          player[p].phys.cVel.x *= 0.9;
          player[p].phys.cVel.y *= 0.9;
        }
        else {
          airDrift(p,input);
          fastfall(p,input);
        }        
      } else {
        // airDrift(p,input);
        // player[p].phys.cVel.y -= 0.08;
        player[p].phys.cVel.y -= player[p].charAttributes.gravity;
        player[p].phys.cVel.y *= 0.95
      }
      executeIntangibility("ESCAPEAIR",p);
      playSounds("ESCAPEAIR",p);
    }
  },
  interrupt : function(p,input){
    if (player[p].timer > (player[p].neutral ? 34 : 49)){
      actionStates[characterSelections[p]].FALL.init(p,input,true);
      return true;
    }
    else {
      return false;
    }
  },
  land : function(p,input){
    player[p].phys.intangibleTimer = 0;
    player[p].phys.hurtBoxState = 0;
    actionStates[characterSelections[p]].LANDINGFALLSPECIAL.init(p,input);
  }
};

