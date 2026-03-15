const size=12;
let timer=0;
let interval;
let undoStack=[];
let locked=false;
const lockKey="nonogramSolved";

/* ===== OBFUSCATION FUNCTIONS ===== */

function d(a){
    return atob(a);
}

function x(s,k){
    let r="";
    for(let i=0;i<s.length;i++){
        r+=String.fromCharCode(s.charCodeAt(i)^k);
    }
    return r;
}

/* ===== ENCRYPTED SOLUTION (12x12) ===== */

/* ===== ENCRYPTED SOLUTION (12x12) ===== */

const p1="W1sxLDEsMSwxLDEsMSwwLDEsMCwxLDAsMV0s";
const p2="WzAsMSwxLDAsMSwwLDEsMSwwLDEsMSwwXSxb";
const p3="MSwxLDAsMSwwLDEsMCwxLDEsMCwxLDBdLFsw";
const p4="LDEsMCwxLDEsMCwxLDAsMSwxLDAsMV0sWzEs";
const p5="MCwxLDAsMSwxLDAsMSwwLDEsMSwwXSxbMCwx";
const p6="LDEsMCwxLDAsMSwxLDAsMSwwLDFdLFsxLDAs";
const p7="MSwxLDAsMSwwLDEsMSwwLDEsMF0sWzAsMSww";
const p8="LDEsMSwwLDEsMCwxLDEsMCwxXSxbMSwxLDEs";
const p9="MSwxLDEsMSwwLDEsMCwxLDBdLFswLDEsMSww";
const p10="LDEsMCwxLDEsMCwxLDAsMV0sWzEsMCwxLDEs";
const p11="MCwxLDAsMSwxLDAsMSwwXSxbMCwxLDAsMSwx";
const p12="LDAsMSwwLDEsMSwxLDFdXQ==";

const solution = JSON.parse(d(
p1+p2+p3+p4+p5+p6+p7+p8+p9+p10+p11+p12
));
/* ===== CLUE GENERATOR ===== */

function generateClues(line){

    let clues=[];
    let count=0;

    for(let i=0;i<line.length;i++){

        if(line[i]===1){
            count++;
        }else{

            if(count>0){
                clues.push(count);
            }

            count=0;

        }

    }

    if(count>0){
        clues.push(count);
    }

    if(clues.length===0){
        clues=[0];
    }

    return clues;

}

/* ===== START ===== */

function startGame(){

    if(localStorage.getItem(lockKey)){
        alert("Already solved on this device.");
        return;
    }

    document.getElementById("startScreen").style.display="none";
    document.getElementById("gameArea").style.display="block";

    buildGame();
    startTimer();

}

/* ===== TIMER ===== */

function startTimer(){

    interval=setInterval(()=>{

        timer++;

        let m=Math.floor(timer/60).toString().padStart(2,'0');
        let s=(timer%60).toString().padStart(2,'0');

        document.getElementById("timer").innerText=`Time: ${m}:${s}`;

    },1000);

}

/* ===== BUILD GAME ===== */

function buildGame(){

    const container=document.getElementById("game");
    container.innerHTML="";

    const table=document.createElement("table");

    let colClues=[];

    for(let c=0;c<size;c++){

        let col=solution.map(row=>row[c]);
        colClues.push(generateClues(col));

    }

    let rowClues=solution.map(row=>generateClues(row));

    let maxCol=Math.max(...colClues.map(c=>c.length));
    let maxRow=Math.max(...rowClues.map(r=>r.length));

    for(let r=0;r<maxCol+size;r++){

        let tr=document.createElement("tr");

        for(let c=0;c<maxRow+size;c++){

            let td=document.createElement("td");

            if(r<maxCol && c<maxRow){

                td.className="blank";

            }
            else if(r<maxCol){

                let clue=colClues[c-maxRow];
                let val=clue[clue.length-(maxCol-r)]||"";

                td.className="clue";
                td.innerText=val;

            }
            else if(c<maxRow){

                let clue=rowClues[r-maxCol];
                let val=clue[clue.length-(maxRow-c)]||"";

                td.className="clue";
                td.innerText=val;

            }
            else{

                td.className="cell";

                td.dataset.row=r-maxCol;
                td.dataset.col=c-maxRow;

                td.onclick=function(){

                    if(locked) return;

                    if(this.classList.contains("xmark")){
                        this.classList.remove("xmark");
                    }

                    this.classList.toggle("fill");

                    undoStack.push(this);

                };

                td.oncontextmenu=function(e){

                    e.preventDefault();

                    if(locked) return;

                    if(this.classList.contains("fill")){
                        this.classList.remove("fill");
                    }

                    this.classList.toggle("xmark");

                    undoStack.push(this);

                };

            }

            tr.appendChild(td);

        }

        table.appendChild(tr);

    }

    container.appendChild(table);

}

/* ===== UNDO ===== */

function undoMove(){

    const last=undoStack.pop();

    if(last){

        last.classList.remove("fill");
        last.classList.remove("xmark");

    }

}

/* ===== CLEAR ===== */

function clearGrid(){

    if(locked) return;

    document.querySelectorAll(".cell").forEach(cell=>{

        cell.classList.remove("fill");
        cell.classList.remove("xmark");

    });

}

/* ===== SUBMIT ===== */

function submitPuzzle(){

    if(locked) return;

    let correct=true;

    document.querySelectorAll(".cell").forEach(cell=>{

        let r=cell.dataset.row;
        let c=cell.dataset.col;

        let filled=cell.classList.contains("fill")?1:0;

        if(filled!=solution[r][c]){
            correct=false;
        }

    });

    if(correct){

        locked=true;

        clearInterval(interval);

        localStorage.setItem(lockKey,"true");

        document.getElementById("resultMessage").innerText=
        "Correct! Code: "+generateCode();

    }
    else{

        document.getElementById("resultMessage").innerText=
        "Incorrect Solution";

    }

}

/* ===== ENCRYPTED FIXED CODE (UNCHANGED) ===== */

function generateCode(){

    const a="N0BLcSE5eiNMMiR2";
    const b="WCY4bVJeNHBUKjF5";
    const c="VyU2Y0g/M25CKzVk";
    const d1="Rj0walMhdUU=";

    return d(a+b+c+d1);

}
