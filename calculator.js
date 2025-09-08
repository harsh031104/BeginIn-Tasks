const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function calculator() {
  rl.question("Enter first number: ", (num1) => {
    rl.question("Enter operator (+, -, *, /): ", (operator) => {
      rl.question("Enter second number: ", (num2) => {
        num1 = Number(num1);
        num2 = Number(num2);
        let result;

        switch (operator) {
          case "+":
            result = num1 + num2;
            console.log("Result:", result);
            break;
          case "-":
            result = num1 - num2;
            console.log("Result:", result);
            break;
          case "*":
            result = num1 * num2;
            console.log("Result:", result);
            break;
          case "/":
            if (num2 === 0) {
              console.log("Error: Division by zero is not allowed!");
            } else {
              result = num1 / num2;
              console.log("Result:", result);
            }
            break;
          default:
            console.log("Invalid operator! Please use +, -, * or /");
        }
        rl.question("you want more calculation? (1 = Yes, 0 = No): ", (choice) => {
          if (choice === "1") {
            calculator();
          } else {
            console.log("Calculator closed. Goodbye!");
            rl.close();
          }
        });
      });
    });
  });
}
calculator();
