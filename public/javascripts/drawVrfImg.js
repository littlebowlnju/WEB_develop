var nums = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
        'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z'
    ];
    var rand = drawCode();
    // 绘制验证码
    function drawCode() {
        var canvas = document.getElementById("vrfCanvas"); //获取HTML端画布
        var context = canvas.getContext("2d"); //获取画布2D上下文
        context.fillStyle = randomColor(100,160); //画布填充色
        context.fillRect(0, 0, canvas.width, canvas.height);
        // 创建渐变
        var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "magenta");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "red");
        //清空画布
        context.fillStyle = gradient; //设置字体颜色
        context.font = "25px Arial"; //设置字体
        var rand = new Array();
        var x = new Array();
        var y = new Array();
        for (var i = 0; i < 4; i++) {
            rand[i] = nums[Math.floor(Math.random() * nums.length)]
            x[i] = i * 16 + 10;
            y[i] = Math.random() * 20 + 20;
            context.fillText(rand[i], x[i], y[i]);
        }
        // console.log(rand);
        //画3条随机线
        for (var i = 0; i < 3; i++) {
            drawline(canvas, context);
        }
 
        // 画30个随机点
        for (var i = 0; i < 30; i++) {
            drawDot(canvas, context);
        }
        convertCanvasToImage(canvas);
        return rand;
    }

    function checkVrf(){
        var newRand=rand.join('').toUpperCase();
        console.log(newRand);

        var inputVrf = $('#vrf').val().toUpperCase();
        console.log(inputVrf);
        if (inputVrf != newRand) {
            console.log("verification wrong");
            document.getElementById("vrfMsg").style.display = "inline";
            return false;
        } else {
            console.log("verification right");
            document.getElementById("vrfMsg").style.display = "none";
            return true;
        }

    }

    // 随机线
    function drawline(canvas, context) {
        context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
        context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
        context.lineWidth = 0.5; //随机线宽
        context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
        context.stroke(); //描边，即起点描到终点
    }

    // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
    function drawDot(canvas, context) {
        var px = Math.floor(Math.random() * canvas.width);
        var py = Math.floor(Math.random() * canvas.height);
        context.moveTo(px, py);
        context.lineTo(px + 1, py + 1);
        context.lineWidth = 0.2;
        context.stroke();
    }

    //生成随机数
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    //随机颜色
    function randomColor(min, max) {
        var r = randomNum(min, max);
        var g = randomNum(min, max);
        var b = randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    // 绘制图片
    function convertCanvasToImage(canvas) {
        document.getElementById("vrfCanvas").style.display = "none";
        var image = document.getElementById("vrfImg");
        image.src = canvas.toDataURL("image/png");
        return image;
    }

    document.getElementById('vrfImg').onclick = function () {
        $('#vrfCanvas').remove();
        $('#vrf').after('<canvas width="100" height="40" id="vrfCanvas"></canvas>')
        rand = drawCode();
    }