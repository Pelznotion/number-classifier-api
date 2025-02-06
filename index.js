const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function isArmstrong(num) {
  let sum = 0,
    temp = Math.abs(num),
    digits = num.toString().length;
  while (temp > 0) {
    sum += Math.pow(temp % 10, digits);
    temp = Math.floor(temp / 10);
  }
  return sum === Math.abs(num);
}
function isEven(num) {
  return num % 2 === 0;
}
function getDigitSum(num) {
  return Math.abs(num)
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit), 0);
}

function classifyNumber(num) {
  let properties = [];
  if (isEven(num)) properties.push("even");
  else properties.push("odd");

  if (isArmstrong(num)) properties.push("armstrong");
  if (isPerfect(num)) properties.push("perfect");

  if (num > 1 && isPrime(num)) properties.push("prime");
  return {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties: properties,
    digit_sum: getDigitSum(num),
  };
}

app.get("/api/classify-number", async (req, res) => {
  try {
    let { number } = req.query;

    if (!number || number.trim() === "") {
      return res.status(400).json({
        error: true,
        number: " ",
      });
    }
    let num = parseInt(number);
    if (isNaN(num)) {
      return res.status(400).json({
        error: true,
        message: " Invalid number format",
      });
    }
    let result = classifyNumber(num);

    let funFact = "";

    try {
      const response = await axios.get(`http://numbersapi.com/${num}`);
      const funFact = response.data;
    } catch (apiError) {
      console.error("Error fetching fun fact", apiError.message);
    }
    return res.status(200).json({ ...result, fun_fact: funFact });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
