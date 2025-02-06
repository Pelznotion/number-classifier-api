const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};
const isPerfect = (num) => {
  if (num < 1) return false;
  let sum = 1;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) {
      sum += i;
      if (i !== num / i) sum += num / i;
    }
  }
  return sum === num && num !== 1;
};
const isArmstrong = (num) => {
  const digits = num.toString().split("");
  const power = digits.length;
  const sum = digits.reduce(
    (acc, digit) => acc + Math.pow(parseInt(digit), power),
    0
  );
  return sum === num;
};
const classifyNumber = (num) => {
  let properties = [];
  if (num % 2 === 0) properties.push("even");
  else properties.push("odd");
  if (isArmstrong(num)) properties.push("armstrong");
  properties.sort();
  return {
    number: num,
    is_prime: isPrime(num),
    is_perfect: isPerfect(num),
    properties: properties,
    digit_sum: Math.abs(num)
      .toString()
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit), 0),
  };
};
app.get("/api/classify-number", async (req, res) => {
  let { number } = req.query;
  if (number === undefined) {
    return res.status(400).json({ error: true, number: "" });
  }
  number = String(number).trim();
  if (!/^[-]?\d+$/.test(number)) {
    return res.status(400).json({ error: true, number });
  }
  const num = parseInt(number);
  try {
    const classification = classifyNumber(num);
    const funFactResponse = await axios.get(
      `http://numbersapi.com/${num}/trivia`
    );
    classification.fun_fact = funFactResponse.data;
    return res.json(classification);
  } catch (error) {
    console.error("Error fetching fun fact:", error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
