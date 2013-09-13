function roundCoords(actualData) 
{
for(var i=0; i<actualData.lenght;i++)
	{
	actualData[p].cx = Math.round(actualData[p].cx) ;
	actualData[p].cy = Math.round(actualData[p].cy);
	actualData[p].width = Math.round(actualData[p].width);
	actualData[p].height = Math.round(actualData[p].height);
	}

}

function calculateRub2px(actualSum, tmWidth, tmHeight)
{
	return rub2px = Math.sqrt(actualSum*tmWidth/tmHeight)/tmWidth; 
}


function equalBudgets(actualData, actualSum) //проверяем правильность JSON, сравниваем суммы дочерних элементов и текущую сумму бюджета
{
sum = 0;	

	for (var i=0; i<actualData.length; i++) //считаем общую сумму элементов 
	{
		sum += parseFloat(actualData[i].amount);
	}
	//if (sum.toFixed(2) != actualSum.toFixed(2)) {alert('Не сходится бюджет: '+ actualSum);} //сравниваем общую сумму бюджета с суммой элементов
}


function sortData (arrayData) // сортируем текущий массив
{

	function compareAmount(elemA, elemB) {
  		return parseFloat(elemB.amount) - parseFloat(elemA.amount);
	}
 
	arrayData.sort(compareAmount);
	
	return arrayData;

}

function ratioRect(square, height) //определяем пропорции
{
	ratio = height/(square/height);
	if (ratio>1) return ratio;
	else return 1/ratio;
}


function calculateRectRatio(actualData, ratioArray, width, height, p)
{
	if (width<height) //если высота больше длины меняем местами
		{
		temp = width;
		width = height;
		height = temp;
		}

	tempRatio=ratioRect(parseFloat(actualData[p].amount), height); //вычисляем первое отношение прямоугольник
	tempP = p;					//фиксируем на каком элементе оно находится

	var tempSum = parseFloat(actualData[p].amount);	
	p += 1;

	for (p; p<actualData.length;p++)
		{
		tempSum += parseFloat(actualData[p].amount);
		if (tempRatio<ratioRect(parseFloat(actualData[p].amount), height*parseFloat(actualData[p].amount)/tempSum))
			{
			ratioArray[tempP] = tempRatio;
			calculateRectRatio(actualData, ratioArray, width-(tempSum-parseFloat(actualData[p].amount))/height, height, p);
			if (p == actualData.length-1){ratioArray[tempP] = tempRatio;}
			break;			
			}		
		else
			{
			tempRatio = ratioRect(parseFloat(actualData[p].amount), height*parseFloat(actualData[p].amount)/tempSum);
			tempP = p;
			if (p == actualData.length-1){ratioArray[tempP] = tempRatio;}
			}

		}

	
	return ratioArray;

}



function calculateCoordsByRatio(width, height, ratioArray, actualData, rub2px) // исправить это!
{
	flagRatio = 0;      //флаг определяет ориентацию пропорции: 1 - ширина - больше, чем высота; 0 - наоборот
	countRect = 0;		//счетчик количества прямоугольников в ряду
	cx = 0; 
	cy = 0;					
	for(var i=0; i<ratioArray.length;i++)
	{	
		tempSum = 0;	
		countRect = 0;			//счетчик количества прямоугольников в ряду
		p=i;
		while (ratioArray[p] == null)
		{
			tempSum += parseFloat(actualData[p].amount);
			p+=1;
			countRect += 1;
		}
		tempSum+=parseFloat(actualData[p].amount);
		if ((countRect == 0)&&(flagRatio==0)) {
			widthRect = (parseFloat(actualData[p].amount)/(height*rub2px))/rub2px;
			actualData[p].cx = cx;
			actualData[p].cy = cy;
			actualData[p].width = widthRect;
			actualData[p].height = height;
			cx += widthRect;
			if (width-widthRect<height) {flagRatio = 1;}
			width = width - widthRect;		
		}
		else if ((countRect == 0)&&(flagRatio==1)){
			widthRect = (parseFloat(actualData[p].amount)/(width*rub2px))/rub2px;
			//alert('!');				
			actualData[p].cx = cx;
			actualData[p].cy = cy;
			actualData[p].width = width;
			actualData[p].height = widthRect;		
			cy += widthRect;
			if (height-widthRect<width) {flagRatio = 0;}
			height = height - widthRect;
			}
		else if ((countRect!=0)&&(flagRatio==0)) {
			tmpHeight = height;
			for(var cr=0; cr<=countRect;cr++) {				
				actualData[p-cr].height = height*(parseFloat(actualData[p-cr].amount)/tempSum);			
				actualData[p-cr].width = parseFloat(actualData[p-cr].amount)/(rub2px*(height*(parseFloat(actualData[p-cr].amount)/tempSum)))/rub2px;
				actualData[p-cr].cx = cx;
				actualData[p-cr].cy = cy + tmpHeight - actualData[p-cr].height;
				tmpHeight = tmpHeight - actualData[p-cr].height;
				}
			if (width-actualData[p].width<height) {flagRatio = 1;}
			cx += actualData[p].width;
			width = width - actualData[p].width;
			countRect=0;
			i=p;
			}
		else if ((countRect!=0)&&(flagRatio==1)) {
			tmpWidth = width;
			for(var cr=0; cr<=countRect;cr++) {
				actualData[p-cr].width = width*(parseFloat(actualData[p-cr].amount)/tempSum);			
				actualData[p-cr].height = parseFloat(actualData[p-cr].amount)/(rub2px*(width*(parseFloat(actualData[p-cr].amount)/tempSum)))/rub2px;
				actualData[p-cr].cy = cy;
				actualData[p-cr].cx = cx + tmpWidth - actualData[p-cr].width;
				tmpWidth = tmpWidth - actualData[p-cr].width;
				}
			if (height-actualData[p].height<width) {flagRatio = 0;}
			cy += actualData[p].height;
			height = height - actualData[p].height;
			countRect=0;
			i=p;
			}	
	}

return actualData;

}

function getClientWidth()
{
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}
 
function getClientHeight()
{
  return document.documentElement.clientHeight;
}

var history = new Array()

var width = 900;
var height = 400;
var len_symbol = 8;

function get_text_amount(amount) {

        if (amount < 1000) {textAmount = amount.toString() + " руб"} 
        else if ((amount < 1000000)&&(amount > 1000)) {textAmount = (amount/1000).toFixed(1).toString() + " тыс"}
        else if ((amount < 1000000000)&&(amount > 1000000)) {textAmount = (amount/1000000).toFixed(1).toString() + " млн"}
        else if ((amount < 1000000000000)&&(amount > 1000000000)) {textAmount = (amount/1000000000).toFixed(1).toString() + " млрд"}
        else if ((amount < 1000000000000000)&&(amount > 1000000000000)) {textAmount = (amount/1000000000000).toFixed(1).toString() + " трлн"}

    return textAmount;
}

function draw(data_json, history) 
{

    if (history.length == 0)
    {
        var object = {
            name: data_json.name,
            amount: data_json.amount,
            children: data_json,
            color: data_json.color
        }
        history.push(object);
    }

    var offset = 0;


    var paper = Raphael(document.getElementById("treemap"), width, height+offset+26);

    for (var count=0; count<history.length; count++)
    {
        var legend = paper.rect(0, offset, width, 25);

        var attributes = {
 	                 fill: history[count].color,
 	                 stroke: '#ffffff',
	                 'stroke-width': 2,
	                 'stroke-linejoin': 'round'
		         };
		legend.attr(attributes);

        legend.node.id = count;
        if (count+1 != history.length) {
    		legend.click(function(){
                    paper.clear();    
                    for (var temp_count=this.node.id; temp_count< count-1;temp_count++) { history.pop(); }
                    draw(history[this.node.id].children, history);
                    
                });
        }

        legend
			.hover(function(){
				this.animate({
				stroke: '#000',
				opacity: 0.5
				}, 300);
			}, function(){
				this.animate({
					stroke: '#ffffff',
					opacity:1
				}, 300);
			});

        var qtip_flag_history = 0;

        if (history[count].name.length * len_symbol > width - 50) {temp_history_name = history[count].name.substr(0, (width - 50)/len_symbol) + "..."; qtip_flag_history = 1;}
        else {temp_history_name = history[count].name;}

        t = paper.text(width/2 - 40, offset + 13 , count+1 + ". " + temp_history_name);
        t.attr({ "font-size": 14, "font-family": "Philosopher" });

        if (qtip_flag_history == 1){
        $(t.node).qtip({ content: { text: history[count].name },			// подключаем тултипы
	            style: {
	                padding: 5,
                    background: '#ddd',
                    color: 'black',
                    textAlign: 'center',
                    border: {
                        width: 1,
                        radius: 0,
                        color: '#0c0c0c'
                    },
                    tip: 'topLeft',
	            },
	            position: {
			target: 'mouse',
	                corner: {
	                    tooltip: 'topLeft'
	                }
	            }
	            });
        }
        qtip_flag_history = 0; 

        t2 = paper.text(width - get_text_amount(history[count].amount).length*8/2, offset + 13 , get_text_amount(history[count].amount));
        t2.attr({ "font-size": 14, "font-family": "Philosopher" });

        offset += 26; 
    }

    data_for_amount = data_json;
    data_json = data_json.children;


	var tmWidth = paper.width;
	var tmHeight = paper.height-offset;

	var actualData = data_json;
	var ratioArray = new Array(actualData.length);


	rub2px = calculateRub2px(parseFloat(data_for_amount.amount), tmWidth, tmHeight);	

	equalBudgets(actualData, parseFloat(data_for_amount.amount));	

	actualData = sortData(actualData);
	
	ratioArray = calculateRectRatio(actualData, ratioArray, tmWidth*rub2px, tmHeight*rub2px, i=0);
	
	actualData = calculateCoordsByRatio(tmWidth, tmHeight, ratioArray, actualData, rub2px, paper);



	for(var i=0; i<actualData.length; i++)
		{

        
        textAmount = ""
        if (actualData[i].amount < 1000) {textAmount = actualData[i].amount.toString() + " руб"} 
        else if ((actualData[i].amount < 1000000)&&(actualData[i].amount > 1000)) 
            {textAmount = (actualData[i].amount/1000).toFixed(1).toString() + " тыс"}
        else if ((actualData[i].amount < 1000000000)&&(actualData[i].amount > 1000000)) 
            {textAmount = (actualData[i].amount/1000000).toFixed(1).toString() + " млн"}
        else if ((actualData[i].amount < 1000000000000)&&(actualData[i].amount > 1000000000)) 
            {textAmount = (actualData[i].amount/1000000000).toFixed(1).toString() + " млрд"}
        else if ((actualData[i].amount < 1000000000000000)&&(actualData[i].amount > 1000000000000)) 
            {textAmount = (actualData[i].amount/1000000000000).toFixed(1).toString() + " трлн"}

		var obj = paper.rect(actualData[i].cx+actualData[i].width/2, 10, 10,10);        
        var attributes = {
 	                 fill: actualData[i].color,
 	                 stroke: '#ffffff',
	                 'stroke-width': 2,
	                 'stroke-linejoin': 'round'
		         };
		obj.attr(attributes);

        var rect_opt = {
            width: actualData[i].width,
            height: actualData[i].height,
            x: actualData[i].cx,
            y: actualData[i].cy + offset
            }

            speed = 800;

            if (rect_opt.width < 5) {rect_opt.x -= 5; rect_opt.width += 5;}
            if (rect_opt.height < 5) {rect_opt.y -= 5; rect_opt.height += 5;}

            obj.animate({
                x: rect_opt.x,              
                y:rect_opt.y,
                width:rect_opt.width,
                height:rect_opt.height                
            }, speed);

        obj.node.id = i;
		obj.click(function(){
            if (actualData[this.node.id].children) {
                paper.clear();
                var object = new Object()
                object = {
                    name: actualData[this.node.id].name,
                    amount: actualData[this.node.id].amount,
                    children: actualData[this.node.id],
                    color: actualData[this.node.id].color
                }             
                history.push(object);
                $(this.node).qtip("hide");
                draw(actualData[this.node.id], history);
                }
            });
		$(obj.node).qtip({ content: { text: actualData[i].name + '<br><br><b>' + textAmount + '</b>'},			// подключаем тултипы
	            style: {
	                padding: 5,
                    background: '#ddd',
                    color: 'black',
                    textAlign: 'center',
                    border: {
                        width: 1,
                        radius: 0,
                        color: '#0c0c0c'
                    },
                    tip: 'topLeft',
	            },
	            position: {
			target: 'mouse',
	                corner: {
	                    tooltip: 'topLeft'
	                }
	            }
	            });

		    obj
			.hover(function(){
				this.animate({
				stroke: '#000',
				opacity: 0.5
				}, 300);
			}, function(){
				this.animate({
					stroke: '#ffffff',
					opacity:1
				}, 300);
			});		

        
		t = paper.text(actualData[i].cx+actualData[i].width/2, -200, actualData[i].name); // вписываем в прямоугольник текст
		//форматируем текст чтоб не выходил за края квадрата.
		var maxWidth = actualData[i].width-actualData[i].width/6;
		var content = actualData[i].name;
		var words = content.split(" ");
        var countRows = 0;
		var tempText = "";
        var textText = "";
        
		for (var ii=0; ii<words.length; ii++) {
 			
            //if (actualData[i].name == "Жилищное хозяйство") 
            //    { alert(maxWidth); alert(t.getBBox().width); }
            tempText = tempText + " " + words[ii]
            t.attr("text", tempText);  			
            if (t.getBBox().width > maxWidth) {
    			textText += "\n" + words[ii]; 
                t.attr("text", textText);  			
			countRows += 1;
  			} else {textText += " " + words[ii];}
		}
        
        
        t.attr("text", textText); 
        if (((countRows)*30 > actualData[i].height)||(maxWidth < 80)) {t.attr("text", ""); textText = "";}

		t.attr({ "font-size": 13, "font-family": "Philosopher" });
        
        var anim = Raphael.animation({x:actualData[i].cx+actualData[i].width/2,y:actualData[i].cy+actualData[i].height/2-10+offset}, 600, "backout");
        t.animate(anim.delay(500)); 
        
        if (textText != "")
        {
            amount_text_coef = countRows/2*20+10;
            t2 = paper.text(actualData[i].cx+actualData[i].width/2, -600, textAmount);

            t2.attr({ "font-size": 13, "font-family": "Philosopher", "font-weight": "bold" });
        
            var anim2 = Raphael.animation({x:actualData[i].cx+actualData[i].width/2,y:actualData[i].cy+actualData[i].height/2+amount_text_coef+offset}, 800, "backout");
            t2.animate(anim2.delay(500)); 
        }
        if ((textText == "")&&(maxWidth>textAmount.length*6)&&(actualData[i].height > 30))
        {
            t2 = paper.text(actualData[i].cx+actualData[i].width/2, -600, textAmount);

            t2.attr({ "font-size": 13, "font-family": "Philosopher", "font-weight": "bold" });
        
            var anim2 = Raphael.animation({x:actualData[i].cx+actualData[i].width/2,y:actualData[i].cy+actualData[i].height/2 + offset}, 800, "backout");
            t2.animate(anim2.delay(500));
        }

       

        t.node.id = i;
		t.click(function(){
                if (actualData[this.node.id].children) {
                paper.clear();
                var object = new Object()
                object = {
                    name: actualData[this.node.id].name,
                    amount: actualData[this.node.id].amount,
                    children: actualData[this.node.id],
                    color: actualData[this.node.id].color
                }             
                history.push(object);
                $(this.node).qtip("hide");
                draw(actualData[this.node.id], history);
                }
 
            });
        
		$(t.node).qtip({ content: { text: actualData[i].name + '<br><br>' + textAmount},			// подключаем тултипы
	            style: {
	                padding: 5,
                    background: '#ddd',
                    color: 'black',
                    textAlign: 'center',
                    border: {
                        width: 1,
                        radius: 0,
                        color: '#0c0c0c'
                    },
                    tip: 'topLeft',
	            },
	            position: {
			target: 'mouse',
	                corner: {
	                    tooltip: 'topLeft'
	                }
	            },
                hide: { when: 'mouseout', fixed: true }
	            });
		t.toFront();
		}

}
