
const gameBoard = (()=> {
   let boardArray = ['','','',
                     '','','',
                     '','',''];

    let result='';

    let pvpBtn = document.querySelector(".pvp");
    let pvAIBtn = document.querySelector(".pvai");
    let board = document.querySelector(".game-board");
    let btns = document.querySelector(".game-mode");
    let playerNames= document.querySelector(".players-names");
    let namesButton= document.querySelector(".name-btn");
    let name1 = document.querySelector("#x-player");
    let name2 = document.querySelector("#o-player");
    let resetButton =document.querySelector(".res-btn");
    let oName = document.querySelector(".op");
    let isPvP=false;
    


    const startPvPGame = ()=>{
        playerNames.classList.add("show");
        btns.classList.add("hidden");
        gameBoard.isPvP=true;
    }
    const startPvAIGame = ()=>{
        playerNames.classList.add("show");
        oName.classList.add("hidden");
        btns.classList.add("hidden");
        gameBoard.isPvP=false;
    }

    const displayBoard = ()=>{
        playerNames.classList.remove("show");
        board.classList.add("show");
        resetButton.classList.add("show");
    }
    pvpBtn.addEventListener('click',startPvPGame);
    pvAIBtn.addEventListener('click',startPvAIGame);
    namesButton.addEventListener('click',displayBoard);
    resetButton.addEventListener('click',()=> location.reload())

    /*Check if the someone won the game*/
    const boardCheck= () =>{

        if(gameBoard.boardArray[2]!=''&& gameBoard.boardArray[2]==gameBoard.boardArray[4]&&
         gameBoard.boardArray[2]==gameBoard.boardArray[6]){
            gameBoard.result=true;
            DisplayController.alarmResult();
          
        }

        if(gameBoard.boardArray[0]!=''&& gameBoard.boardArray[0]==gameBoard.boardArray[4]&&
         gameBoard.boardArray[0]==gameBoard.boardArray[8]){
            gameBoard.result=true;
            DisplayController.alarmResult();     
        }
            
        for (let i = 0; i < 3; i++) {
            if(gameBoard.boardArray[i]!==''&& gameBoard.boardArray[i]==gameBoard.boardArray[i+3]
            && gameBoard.boardArray[i]==gameBoard.boardArray[i+6]){
                gameBoard.result=true;
               
                DisplayController.alarmResult();      
        }}

        for (let i = 0; i < 7; i+=3) {
            if(gameBoard.boardArray[i]!==''&& gameBoard.boardArray[i]==gameBoard.boardArray[i+1]
            && gameBoard.boardArray[i]==gameBoard.boardArray[i+2]){
                gameBoard.result=true;
                
                DisplayController.alarmResult();  
        }
        }
    }
    
  return {boardArray,boardCheck,result,name1,name2,isPvP};

})();


const playerFactory = (name)=>{
  return {name};
}; 
let player1 = playerFactory(gameBoard.name1);
let player2 = playerFactory(gameBoard.name2);

const DisplayController = (()=> {
  let blocks= document.querySelectorAll(".spot");
  let xTurn= true;
  let round= 0;
  let evaluating=false;
  let evaluation;

  
  const resetGame = ()=>{

    blocks.forEach(block=> block.textContent='');
    gameBoard.result='';
    round=0;
    xTurn= true;
    gameBoard.boardArray = ['','','',
    '','','',
    '','',''];
  }
/*Display the pressed box by the players and add it to the array*/
  const display = (pressedBlock) =>{
    
    if( gameBoard.boardArray[pressedBlock.target.getAttribute("pos")]=='')
    {
        if (xTurn) {
          let result = document.querySelector(".res");
          result.textContent="";
            pressedBlock.target.textContent='X';
            gameBoard.boardArray[pressedBlock.target.getAttribute("pos")]='X';
            xTurn=false;
            round++;
          }
          else if (!xTurn&& gameBoard.isPvP){
              pressedBlock.target.textContent='O';
              gameBoard.boardArray[pressedBlock.target.getAttribute("pos")]='O';
              xTurn=true;
              round++;
          }
          gameBoard.boardCheck();
 
         if (round==9){
            let result = document.querySelector(".res");
            result.textContent="Draw";
            resetGame();
          }
          if(!gameBoard.isPvP&&!xTurn){
            xTurn=false;
            let chosenBlock = document.querySelector(`[pos="${AI.bestChoice(gameBoard.boardArray)}"]`)
            chosenBlock.textContent='O';
            gameBoard.boardArray[chosenBlock.getAttribute("pos")]='O';
            xTurn=true;
            round++;
          }
          gameBoard.boardCheck();
          if (round==9){
            let result = document.querySelector(".res");
            result.textContent="Draw";
            resetGame();
          }
         
    }
         
  } 

  const alarmResult = ()=>{
    if (gameBoard.result && !xTurn &&  !DisplayController.evaluating){
        let result = document.querySelector(".res");
        result.textContent=player1.name.value+' Won!';
        resetGame();
        }
        else if (gameBoard.result && xTurn && gameBoard.isPvP && !DisplayController.evaluating){
        let result = document.querySelector(".res");
        result.textContent=player2.name.value+' Won!';
        resetGame();
        }
        else if (gameBoard.result &&  xTurn && !gameBoard.isPvP && !DisplayController.evaluating){
            let result = document.querySelector(".res");
            result.textContent=player2.name.value+'The AI Won!';
            resetGame();
        }


}
  blocks.forEach(one=>{one.addEventListener("click",display)});
return {alarmResult,round,xTurn,evaluating,evaluation};
})();


const AI =(()=>{
  let SpotEvaluation;
  let depthCounter=0;
const bestChoice = (gameState)=>{
  
 depthCounter=0;
  //Check at what depth the AI should make the decision
  for (let i = 0; i <9; i++) {
    if(gameState[i]==''){
      depthCounter++;
    }
  }

 console.log(gameState);
 console.log(depthCounter);
  console.log(AI.minimax(depthCounter,true,gameState)) ;
  DisplayController.evaluating=false;
  console.log(AI.SpotEvaluation);

return  AI.SpotEvaluation;
}

const minimax = (depth,aiTurn,position)=>{
  DisplayController.evaluating=true;

  gameBoard.boardCheck();
  if(depth == 0 && !gameBoard.result){
     return 0;
  }   

  if(gameBoard.result&&!aiTurn){ 
    gameBoard.result=false;
    return 1;
  }
  if(gameBoard.result&& aiTurn){ 
    gameBoard.result=false;
    return -1;
  }

  else if(aiTurn){
        let maxEval=-Infinity;
        
        for (let i = 0; i < position.length; i++) {
          if(position[i]==''){
            position[i] = 'O';
            let eval =minimax(depth-1,false,position);
            position[i] = '';
            if(eval>maxEval&& depth==depthCounter){
               AI.SpotEvaluation=i;
              
            }
            maxEval=Math.max(maxEval,eval);
          }  
        }
        return maxEval;
    }
   else{
    DisplayController.evaluating=true;
   
    let minEval=Infinity;
        for (let i = 0; i < position.length; i++) {
          if(position[i]==''){
            position[i] = 'X';
            let eval =minimax(depth-1,true,position);
            position[i] = '';
            minEval=Math.min(minEval,eval);
          }  
        }
        return minEval;
        
    }
    
}
return{bestChoice,minimax,SpotEvaluation,depthCounter}
})();
