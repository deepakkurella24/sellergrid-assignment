const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const cache = {};

const rawReviews = [
  {
    review:
      "I ordered these earphones last week and although the sound quality is excellent and bass is really impressive, the delivery was significantly delayed. It took almost 5 extra days beyond the promised date which was quite frustrating.",
    userName: "Deepak",
    rating: 3,
    platform: "Amazon",
  },
  {
    review:
      "The product works fine and performance is decent for the price, but the packaging was very poor. The box was slightly damaged and not sealed properly which made me doubt if the product was handled correctly.",
    userName: "Sai",
    rating: 2,
    platform: "Flipkart",
  },
  {
    review:
      "Absolutely loved the product! The build quality is premium, battery life is amazing and it exceeded my expectations. Delivery was also quick and hassle-free.",
    userName: "Ravi",
    rating: 5,
    platform: "Amazon",
  },
  {
    review:
      "The price feels a bit high compared to similar products in the market. While the features are good, I expected more value for money at this price point.",
    userName: "Kiran",
    rating: 3,
    platform: "Flipkart",
  },
  {
    review:
      "Customer support was very disappointing. I tried reaching out multiple times regarding my issue but there was no proper response and the problem is still unresolved.",
    userName: "Anil",
    rating: 1,
    platform: "Amazon",
  },
  {
    review:
      "Product quality is good and works as expected, but delivery experience was खराब and very late. Also tracking updates were not accurate which caused confusion.",
    userName: "Vamsi",
    rating: 2,
    platform: "Flipkart",
  },
  {
    review:
      "Setup was easy and the product works smoothly without any issues. I am satisfied overall and would recommend it to others looking for a reliable option.",
    userName: "Sneha",
    rating: 4,
    platform: "Amazon",
  },
  {
    review:
      "The design looks good but the material feels cheap and not durable. After a few days of use, I noticed small scratches which is disappointing.",
    userName: "Pooja",
    rating: 2,
    platform: "Flipkart",
  },
  {
    review:
      "Delivery was on time but the product had a minor defect initially. However, replacement process was smooth and quick which improved my experience.",
    userName: "Rahul",
    rating: 4,
    platform: "Amazon",
  },
  {
    review:
      "Overall the product is decent but not exceptional. It does the basic job but lacks some advanced features that competitors are offering at similar price.",
    userName: "Manoj",
    rating: 3,
    platform: "Flipkart",
  }
];

function safeParse(content) {
  try {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}") + 1;
    const jsonString = content.slice(start, end);
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

async function analyzeReview(text) {

  if (cache[text]) return cache[text];

  const prompt = `
You are an API. Return ONLY valid JSON. No extra text.

{
  "sentiment": "positive | negative | neutral",
  "issue": "one short issue like Delivery Delay, Packaging, Pricing, Quality, General",
  "summary": "max 12 words summary"
}

Review: "${text}"
`;

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const content = response.choices[0].message.content;
    const parsed = safeParse(content);

    const result = parsed || {
      sentiment: "neutral",
      issue: "General",
      summary: text,
    };

    cache[text] = result;

    return result;
  } catch (err) {
    console.log(err);
    return {
      sentiment: "neutral",
      issue: "General",
      summary: text,
    };
  }
}

async function processReviews(reviews) {
  const promises = reviews.map(async (r) => {
    const ai = await analyzeReview(r.review);

    return {
      ...r,
      sentiment: ai.sentiment,
      issue: ai.issue,
      summary: ai.summary,
    };
  });

  return Promise.all(promises);
}

function groupByIssue(data) {
  const map = {};

  data.forEach((item) => {
    if (!map[item.issue]) {
      map[item.issue] = {
        issue: item.issue,
        count: 0,
        sentimentBreakdown: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        reviews: [],
      };
    }

    map[item.issue].count++;
    map[item.issue].sentimentBreakdown[item.sentiment]++;
    map[item.issue].reviews.push(item);
  });

  return Object.values(map);
}


app.get("/reviews", async (req, res) => {
  try {
    const processed = await processReviews(rawReviews);
    const grouped = groupByIssue(processed);

    res.json({
      success: true,
        data: grouped.sort((a, b) => {
            const scoreA = a.sentimentBreakdown.negative * 2 + a.count;
            const scoreB = b.sentimentBreakdown.negative * 2 + b.count;
            return scoreB - scoreA;
        })
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


const PORT =  5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});