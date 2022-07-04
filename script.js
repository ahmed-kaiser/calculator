class Stack{
    constructor(){
        this.array = [];
        this.count = -1;
    }

    pushItem(value){
        this.array.push(value);
        this.count++;
    }

    popItem(){
        this.count--;
        return this.array.pop();
    }

    len(){
        return this.count + 1;
    }

    isEmpty(){
        return this.count < 0 ? true : false;
    }

    getTopItem(){
        return this.array[this.count];
    }
}

class Calculator{
    constructor(){
        this.mainExpression = '';
        this.tempArr = [];
        this.tempNumber = '';
        this.total = 0;
        document.getElementById("display__total").innerText = this.total;
    }

    #evaluate(arr){
        let stack = new Stack();
        let lenOfArr = arr.length;
    
        for (let i = 0; i < lenOfArr; i++){
            if (!isNaN(arr[i])){
                stack.pushItem(arr[i]);
            }else{
                let num2 = Number(stack.popItem());
                let num1 = Number(stack.popItem());
    
                switch(arr[i]){
                    case "\u00D7":
                        stack.pushItem(num1 * num2);
                        break;
                    case "\u00F7":
                        stack.pushItem(num1 / num2);
                        break;
                    case "\u002B":
                        stack.pushItem(num1 + num2);
                        break;
                    case "\u2212":
                        stack.pushItem(num1 - num2);
                        break;
                    case "mod":
                        stack.pushItem(num1 % num2);
                        break;
                    case "pow":
                        stack.pushItem(num1 ** num2);
                        break;
                }
            }
        }
        return stack.getTopItem();
    }
    
    #toPostFix(arr){
        const precedence = {
            'pow': 3,
            'mod': 2,
            '\u00D7': 2,    // Multiplication Sign
            '\u00F7': 2,    // Division Sign
            '\u2212': 1,    // Minus Sign
            '\u002B': 1,    // Plus Sign
            '\u003D': 0     // Equal Sign
        };
    
        let stack = new Stack();
        let postFixExp = [];
        let lenOfArr = arr.length;
        let temp;

        if (isNaN(arr[lenOfArr - 1])){
            arr = arr.slice(0, lenOfArr - 1);
            lenOfArr -= 1;
        }
 
        for (let i = 0; i < lenOfArr; i++){
            temp = arr[i]
            if (isNaN(temp)){
                if(stack.isEmpty() || precedence[stack.getTopItem()] < precedence[temp]){
                    stack.pushItem(temp);
                }else{
                    while(1){
                        postFixExp.push(stack.popItem());
                        if(precedence[stack.getTopItem()] < precedence[temp] || stack.isEmpty()){
                            stack.pushItem(temp);
                            break;
                        }
                    }
                }        
            }else{
                postFixExp.push(temp);
            }
        }

        while(!stack.isEmpty()){
            postFixExp.push(stack.popItem());
        }
    
        return postFixExp;
    }

    appendNumber(number){

        if(isNaN(number) && number !== ".") return;

        if(this.mainExpression[this.mainExpression.length - 1] === "="){
            this.clear();
        }

        if (this.tempNumber.includes(".") && number === ".") {return};
        this.tempNumber  += number;
        document.getElementById("display__total").innerText = this.tempNumber;
        this.#checkDisplay();
    }

    deleteNumber(){
        if(this.tempNumber){
            this.tempNumber = this.tempNumber.slice(0, this.tempNumber.length - 1);
        }
        document.getElementById("display__total").innerText = this.tempNumber;
    }

    clear(){
        this.mainExpression = '';
        this.tempArr = [];
        this.tempNumber = '';
        this.total = 0;
        document.getElementById("display__total").innerText = this.total;
        document.getElementById("display__expression").innerText = '';
    }

    calculate(operator){

        let lastOperator = this.mainExpression[this.mainExpression.length - 1];

        // if previous value is equal operator
        if(lastOperator === "="){
            this.mainExpression = '';
            this.tempArr = [];
            this.tempNumber = this.total;
        }

        // if nothing input yet then return 
        if (this.tempNumber === '') return;

        // if previous value also a operator then return
        if(this.tempNumber === '' && isNaN(lastOperator)) return;

        this.mainExpression += this.tempNumber + operator;
        this.tempArr.push(this.tempNumber);
        this.tempArr.push(operator);
        this.tempNumber = '';

        let executableExpression = this.#toPostFix(this.tempArr);
        this.total = this.#evaluate(executableExpression);

        document.getElementById("display__expression").innerText = this.mainExpression;
        document.getElementById("display__total").innerText = this.total;
        this.#checkDisplay()
    }

    #checkDisplay(){
        let value = document.getElementById("display__total");
        let expression = document.getElementById("display__expression");
        let lenOfValue = value.innerText.length;
        let lenOfExpression = expression.innerText.length;

        if(lenOfValue < 16 ){
            value.style.fontSize = "1.6rem";
        }else if(lenOfValue > 15 && lenOfValue < 19){
            value.style.fontSize = "1.3rem";
        }else if(lenOfValue > 19 && lenOfValue < 26){
            value.style.fontSize = "1.1rem";
        }

        if(lenOfExpression < 15 ){
            expression.style.fontSize = "1.2rem";
        }else if(lenOfExpression > 15){
            expression.style.fontSize = "1rem";
        }
    }
}

let calculator = new Calculator();

let numberList = document.querySelectorAll(".number")
for (number of numberList){
    number.addEventListener('click', (e) => {
        calculator.appendNumber(e.target.innerText)
    })
}

let operatorList = document.querySelectorAll(".operator")
for (operator of operatorList){
    operator.addEventListener('click', (e) => {
        calculator.calculate(e.target.innerText)
    })
}

let del = document.querySelector("#del-btn");
del.addEventListener('click', () => {
    calculator.deleteNumber();
})

let clear = document.querySelector("#clear-btn");
clear.addEventListener('click', () => {
    calculator.clear();
})

document.addEventListener('keypress', (e) => {
    let keyValue = e.key;
    let temp;
    if (!isNaN(keyValue) || keyValue === "."){
        temp = document.querySelector(`[data-value="${keyValue}"]`);
        temp.classList.add("active");
        setTimeout(()=>{
            temp.classList.remove("active");
        }, 200)    
        calculator.appendNumber(e.key);
    }else{
        switch(keyValue){
            case ("Enter" || "="):
                calculator.calculate("\u003D");
                temp = document.getElementById("equal-btn");
                break;
            case "+":
                calculator.calculate("\u002B");
                temp = document.getElementById("plus-btn");
                break;
            case "-":
                calculator.calculate("\u2212");
                temp = document.getElementById("sub-btn");
                break;
            case "*":
                calculator.calculate("\u00D7");
                temp = document.getElementById("mul-btn");
                break;
            case "/":
                calculator.calculate("\u00F7");
                temp = document.getElementById("division-btn");
                break;
            case "%":
                calculator.calculate("mod");
                temp = document.getElementById("mod-btn");
                break;
            case "Delete":
                calculator.deleteNumber();
                temp = document.getElementById("del-btn");
                break;
            default:
                return
        }
        
        temp.classList.add("active");
        setTimeout(()=>{
            temp.classList.remove("active");
        }, 200)
    
    }
})

document.querySelector("#card").style.cursor = "pointer";

document.onselectstart = disableselect;