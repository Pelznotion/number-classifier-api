const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const classifyNumber = (num) => {
  const properties = {
    isEven: num % 2 === 0,
    isPrime: isPrime(num),
    isPerfectSquare: Number.isInteger(Math.sqrt(num)),
    isCube: Number.isInteger(Math.cbrt(num)),
    isArmstrong: isArmstrong(num),
  };

  return properties;
};

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const isArmstrong = (num) => {
  const digits = num.toString().split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, power), 0);
  return sum === num;
};

// const funFact = [
//   "Zero is the only number that is neither positive nor negative",
//   "The number 1 is the only number that is neither prime nor composite",
//   "Pi is an irrational number and goes on forever without repeating",
//   "The number 371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371",
//   "Perfect Squares are numbers that can be formed by multiplying a number by itself",
// ];

app.get("/api/classify-number", async (req, res) => {
  const { number } = req.query;

  if (!number || isNaN(number) || !Number.isInteger(Number(number))) {
    return res.status(400).json({
      error:
        "Invalid input. Please provide an integer as the 'number' parameter.",
      status_code: 400,
    });
  }

  const num = parseInt(number, 10);
  const classification = classifyNumber(num);

  try {
    const response = await axios.get(`http://numbersapi.com/${num}`);
    const funFact = response.data;

    res.json({
      number: num,
      properties: classification,
      fun_fact: funFact,
      status_code: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve fun fact from NumbersAPI",
      status_code: 500,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
