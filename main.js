// 计分器JavaScript代码

// 初始化本地存储
if (localStorage.getItem("table_ball_number") === null){
    localStorage.setItem("table_ball_number", [0,15,1,1,1,1,1,1]);
}

// 全局变量
let score = [0, 0];
let shot_score = [0, 0];
let none_score = [0, 0];//罚分
let max_break = [0, 0];
let side_number = 0;//0为左边，1为右边
let this_shot = 0;//记录击球
let last_shot = 0;//记录上回合击球
const table_ball_number = localStorage.getItem("table_ball_number").split(","); //台面球的数量，对应：[空余,红,黄,绿,棕,蓝,粉,黑]
// const table_ball_number = [0,15,1,1,1,1,1,1]
const ball_points = [0,1,2,3,4,5,6,7]
let table_ball_roaming = table_ball_number;
let roaming = 0;//记录台面剩余
let color_ball_state = 0;//清彩阶段记录
let cheak_state = 0;//记录是否查看过记录
const bg_color = "white";
const ball_name = ["","red","yellow","green","brown","blue","pink","black"];
let break_in_a_ball = [0,0,0,0,0,0,0,0];
let modal_state = 0;//记录设置弹出框是否打开，0为否，1为是
let special_modal_state = 0;//记录特殊处置弹出框是否打开，0为否，1为是
let message = "";//记录后台数据
let press_btn = "";//记录按下的按键
// let button_show_state = 1;//记录按钮是否显示

// DOM元素
const tips = document.getElementById("tips");
const tips_text = ["","超分","复位黄球","复位绿球","复位棕球","复位蓝球","复位粉球","复位黑球"];

const set_modal = document.getElementById("set_Modal");
const special_modal = document.getElementById("special_Modal");

// 初始化显示
document.getElementById("left-name").innerHTML = localStorage.getItem("left-name");
document.getElementById("right-name").innerHTML = localStorage.getItem("right-name");


// 弹窗交互
// const set_modal = document.getElementById("set_Modal");
document.getElementById("more_set").addEventListener("click", function(){
    set_modal.style.display = "block";
    modal_state = 1;
});
document.getElementById("exit_set").addEventListener("click", function(){
    set_modal.style.display = "none";
    modal_state = 0;
});

document.getElementById("cheak").addEventListener("click", function(){
    cheak();
});

document.getElementById("reset").addEventListener("click", function(){
    reset();
});

const message_modal = document.getElementById("message_Modal");
document.getElementById("get_message").addEventListener("click", function(){
    set_modal.style.display = "none";
    message_modal.style.display = "block";
    get_message();
});
document.getElementById("exit_message").addEventListener("click", function(){
    message_modal.style.display = "none";
    modal_state = 0;
});

document.getElementById("back").addEventListener("click", function(){
    window.location.href = "./start_cx.html"
});

document.getElementById("special_handle").addEventListener("click", function(){
    special_modal.style.display = "block";
    special_modal_state = 1;
});

document.getElementById("exit_special").addEventListener("click", function(){
    special_modal.style.display = "none";
    special_modal_state = 0;
});

// const modal = document.getElementById("modal");
document.getElementById("set_message").addEventListener("click", function(){
    input_ball_number();
});

document.getElementById("reduce_red_ball").addEventListener("click", function(){
    reduce_red_ball();
});

// 移动端按钮事件处理
// 击球按钮
document.querySelectorAll('.score-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const ballNumber = parseInt(this.dataset.ball);
        score[side_number] += ball_points[ballNumber];
        shot_score[side_number] += ball_points[ballNumber];
        this_shot = ballNumber;
        press_btn = this_shot;
        show_score();
    });
});

// 罚分按钮
document.querySelectorAll('.foul-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const foulNumber = parseInt(this.dataset.foul);
        score[get_another_side_number(side_number)] += foulNumber;
        none_score[side_number] += foulNumber;
        this_shot = 0;
        press_btn = `Foul ${foulNumber}`;
        show_score();
    });
});

// 下一位球员按钮
document.getElementById("next-player").addEventListener("click", function() {
    side_number = side_number === 0 ? 1 : 0;
    this_shot = 0;
    press_btn = "Next Player";
    show_score();
});

document.getElementById("possible_tips").addEventListener("click", function(){
    const isSetPostip = confirm("是否使用满分杆提示？是请按确认，否请按取消");
    if(isSetPostip === true){
        const PTStoPostip = prompt("Break/单杆达到多少时显示满分杆提示？")
        const regex = /^[1-9]\d*$/;
        if((PTStoPostip !== null && Number(PTStoPostip) !== NaN) && regex.test(PTStoPostip)){
            localStorage.setItem("possible_tip", PTStoPostip);
            alert("设置成功！");
        }else{
            alert("请输入有效数字");
        }
    }else{
        localStorage.setItem("possible_tip", -1);
    }
});

function unshow_possible_ball(){
    document.getElementById("possible-ball").style.display = "none";
}

function show_possible_ball(){
    document.getElementById("possible-ball").style.display = "flex";
    let j = "red";
    for(let i = 1;i<=7;i++){
        j = ball_name[i];
        document.getElementById(`p-${j}-ball`).textContent = break_in_a_ball[i];
    }
}

function input_ball_number() {
    const userInput = prompt("请输入您要设置的红球数量：（标准球台为15颗）", localStorage.getItem("table_ball_number").split(",")[1]);
    if(userInput !== null){

        if (Number(userInput) !== NaN){
            const regex = /^([1-9]|[12]\d|30)$/;
            if (regex.test(userInput)){
                const confirm_to_set = confirm(`该设置是否保存于后台（在下一次仍使用该数据）？若需要保存在后台，请按确认；若只在本局比赛应用，请按取消`);
                if (confirm_to_set === true){
                    localStorage.setItem("table_ball_number", [0,Number(userInput),1,1,1,1,1,1]);
                    alert("设置成功");
                }else{
                    table_ball_number[1] = Number(userInput);
                    alert("设置成功，将在下一次击球时生效");
                }
                
            }else{
                alert("请输入正确的数字");
                input_ball_number();
            }
        }else{
            alert("请输入正确的数字");
            input_ball_number();
        }
    }
}

function reduce_red_ball() {
    const currentRedBall = table_ball_roaming[1];
    if (currentRedBall <= 0) {
        alert("台面上已经没有红球了！");
        return;
    }
    
    const confirmReduce = confirm(`当前台面红球数量：${currentRedBall}颗\n\n是否减少1颗红球？\n\n此操作用于处理红球离开台面的情况。`);
    if (confirmReduce) {
        table_ball_roaming[1] -= 1;
        const newRedBall = table_ball_roaming[1];
        alert(`红球数量已更新为：${newRedBall}颗`);
        
        special_modal.style.display = "none";
        special_modal_state = 0;
        
        this_shot = 0;
        show_score();
    }
}

function get_message(){
    const message_table = document.getElementById("message"); 
    // message_table.textContent = formatAndCopyData(message);
    message_table.textContent = message;

    try {
        navigator.clipboard.writeText(message)
            // .then(() => alert("后台数据已复制到剪贴板"))
            .catch(err => console.error("复制失败:", err));
    } catch (err) {
        console.error("复制失败:", err);
    }
}

function get_break(shot_list){
    let break_shot = 0;
    for(let i=1;i<=7;i++){
        break_shot += shot_list[i] * ball_points[i];
    }
    return break_shot;
}

function cheak_roaming() {
    let sum = 0;
    break_in_a_ball[this_shot] += 1;
    if(get_break(break_in_a_ball) >= Number(localStorage.getItem("possible_tip"))){
        show_possible_ball();
    }
    if(this_shot === 1){
        //击打了红球
        table_ball_roaming[1] -= 1;
        const red_ball_number = table_ball_roaming[1];
        sum = red_ball_number * 8;
        for(let i=2;i<=7;i++){
            sum += table_ball_roaming[i] * ball_points[i];
        };
        tips.innerHTML = "";
        return sum;
    }else {
        //击打了彩球
        if(table_ball_roaming[1] === 0 && last_shot != 1){
            //没有红球剩余
            tips.innerHTML = "";
            if(color_ball_state === 0){
                if (table_ball_roaming[2] === 1){
                    color_ball_state = 1;
                    // console.log("return 27")
                    return 27;
                }
            }
            if (this_shot === 7){
                // console.log("return 0")
                return 0;
            }else{
                table_ball_roaming[this_shot] -= 1;
                for(let i = this_shot + 1;i<=7;i++){
                    sum += table_ball_roaming[i] * ball_points[i];
                }
                return sum;
            }
        }else{
            //有红球剩余
            const red_ball_number = table_ball_roaming[1];
            sum = red_ball_number * 8;
            for(let i=2;i<=7;i++){
                sum += table_ball_roaming[i] * ball_points[i];
            };
            //显示复位提示
            tips.innerHTML = tips_text[this_shot];
            tips.style.color = ball_name[this_shot];
            
            return sum;
        }
    }
}

function show_score() {
    
    document.getElementById("left-name").innerHTML = localStorage.getItem("left-name");
    document.getElementById("right-name").innerHTML = localStorage.getItem("right-name");

    document.getElementById("left-number").innerHTML = score[0];
    document.getElementById("right-number").innerHTML = score[1];
    if(side_number === 0){
        document.getElementById("right-arrow").style.borderColor = `transparent transparent transparent ${bg_color}`;
        document.getElementById("left-arrow").style.borderColor = "transparent black transparent transparent";
    }else{
        document.getElementById("left-arrow").style.borderColor = `transparent ${bg_color} transparent transparent`;
        document.getElementById("right-arrow").style.borderColor = "transparent transparent transparent black";
    }
    if(this_shot != 0){
        //TODO
        const disparity = Math.abs(score[1] - score[0]);
        roaming = cheak_roaming();
        document.getElementById("roaming").innerHTML = `Disparity/差距: ${disparity} , Remaining/台面剩余: ${roaming} , Break/单杆： ${get_break(break_in_a_ball)}`;
        // console.log(table_ball_roaming)
    }else{
        unshow_possible_ball();
        break_in_a_ball = [0,0,0,0,0,0,0,0];
        tips.innerHTML = "";
        document.getElementById("roaming").innerHTML = `Disparity/差距: ${Math.abs(score[1] - score[0])} , Remaining/台面剩余: ${roaming}`;
    }
    if(get_break(break_in_a_ball) > max_break[side_number]){
        max_break[side_number] = get_break(break_in_a_ball);
        
    }
    if(press_btn != ""){
        const mess = `Time:${Date().split(" ")[4]} , Press:${press_btn} , Side:${side_number} , Shot_or_Foul: ${ball_name[this_shot] || this_shot} , Roaming:${roaming}, Break:${get_break(break_in_a_ball)} ;  `
        console.log(mess);
        message += `${mess} \n `;
    }
    
    last_shot = this_shot;
    // console.log(get_break(break_in_a_ball))
}

function get_another_side_number(number) {
    if(number === 0){
        return 1;
    }else{
        return 0;
    }
}

// 键盘事件监听
document.addEventListener("keydown", function (e) {
    if(!(modal_state === 1 || special_modal_state === 1)){    
    if(e.key === '4' && e.altKey){
        e.preventDefault();
        // console.log("alt+4");
        score[get_another_side_number(side_number)] += 4;
        none_score[side_number] += 4;
        this_shot = 0;
        press_btn = "Alt+4";
    }else if(e.key === '5' && e.altKey){
        e.preventDefault();
        score[get_another_side_number(side_number)] += 5;   
        none_score[side_number] += 5;
        this_shot = 0;
        press_btn = "Alt+5"
    }else if(e.key === '6' && e.altKey){
        e.preventDefault();
        score[get_another_side_number(side_number)] += 6;
        none_score[side_number] += 6;
        this_shot = 0;
        press_btn = "Alt+6"
    }else if(e.key === '7' && e.altKey){
        e.preventDefault();
        score[get_another_side_number(side_number)] += 7;
        none_score[side_number] += 7;
        this_shot = 0;
        press_btn = "Alt+7"
    }else if (e.key === '1') {
        score[side_number] += 1;
        shot_score[side_number] += 1;
        this_shot = 1;
        press_btn = this_shot;
    }else if (e.key === '2') {
        score[side_number] += 2;
        shot_score[side_number] += 2;
        this_shot = 2;
        press_btn = this_shot;
    }else if (e.key === '3') {
        score[side_number] += 3;
        shot_score[side_number] += 3;
        this_shot = 3;
        press_btn = this_shot;
    }else if (e.key === '4') {
        score[side_number] += 4;
        shot_score[side_number] += 4;
        this_shot = 4;
        press_btn = this_shot;
    }else if (e.key === '5') {
        score[side_number] += 5;
        shot_score[side_number] += 5;
        this_shot = 5;
        press_btn = this_shot;
    }else if (e.key === '6') {
        score[side_number] += 6;
        shot_score[side_number] += 6;
        this_shot = 6;
        press_btn = this_shot;
    }else if (e.key === '7') {
        score[side_number] += 7;
        shot_score[side_number] += 7;
        this_shot = 7;
        press_btn = this_shot;
    }else if (e.key === "Enter") {
        if(side_number === 0){
            side_number = 1;
        }else {
            side_number = 0;
        };
        this_shot = 0;
        press_btn = "Enter";
    }else{
        return;
    };
    show_score();
    }
});

function cheak(){
    //弹出窗口，显示得分、罚分、净得分
    if(cheak_state === 0){
        cheak_state = 1;
        document.getElementById("left-arrow").style.borderColor = `transparent ${bg_color} transparent transparent`;
        document.getElementById("right-arrow").style.borderColor = `transparent transparent transparent ${bg_color}`;

        document.getElementById("left-shot-score").style.display = "block";
        document.getElementById("left-shot-score").innerHTML = `净得分：${shot_score[0]}`;
        document.getElementById("right-shot-score").style.display = "block";
        document.getElementById("right-shot-score").innerHTML = `净得分：${shot_score[1]}`;
        document.getElementById("left-max-break").style.display = "block";
        document.getElementById("left-max-break").innerHTML = `单杆最高：${max_break[0]}`;
        document.getElementById("right-max-break").style.display = "block";
        document.getElementById("right-max-break").innerHTML = `单杆最高：${max_break[1]}`

        document.getElementById("left-none-score").style.display = "block";
        document.getElementById("left-none-score").innerHTML = ` 罚分：${none_score[0]}`;
        document.getElementById("right-none-score").style.display = "block";
        document.getElementById("right-none-score").innerHTML = ` 罚分：${none_score[1]}`;

        document.getElementById("cheak").innerHTML = "返回";
    }else{
        this_shot = 0;
        show_score();
        document.getElementById("left-shot-score").style.display = "none";
        document.getElementById("right-shot-score").style.display = "none";
        document.getElementById("left-none-score").style.display = "none";
        document.getElementById("right-none-score").style.display = "none";
        document.getElementById("left-max-break").style.display = "none";
        document.getElementById("right-max-break").style.display = "none";

        document.getElementById("cheak").innerHTML = "查看记录";
        cheak_state = 0;
    };
}

function reset() {
    const isConfirmed = confirm("确定要重置吗？");
    if (!isConfirmed) {
        return;
    }else{
        score = [0,0];
        shot_score = [0,0];
        none_score = [0,0];
        max_break = [0,0];
        break_in_a_ball = [0,0,0,0,0,0,0,0];
        side_number = 0;
        this_shot = 0;
        roaming = 0;
        table_ball_roaming = table_ball_number;
        localStorage.setItem("left-name", "");
        localStorage.setItem("right-name", "");
        tips.innerHTML = "";
        show_score();
        alert("已重置！将自动刷新页面！");
        window.location.reload();
    }
}

// 初始化显示
show_score();