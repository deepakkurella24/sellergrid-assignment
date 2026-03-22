# 📊 Review Insights Dashboard (SellerGrid Assignment)

## 🚀 Live Demo

* 🌐 **Frontend:** https://sellergrid-assignment.netlify.app/
* 🔗 **Backend API:** https://sellergrid-assignment-2.onrender.com/
* 📦 **GitHub Repo:** https://github.com/deepakkurella24/sellergrid-assignment
* 🎥 **Demo Video:** *(Add your Google Drive link here)*

---

## 🧠 Overview

This project is an **AI-powered review analytics dashboard** designed to help eCommerce brands quickly understand large volumes of customer feedback.

Instead of manually reading thousands of reviews, the system:

* Uses an **LLM (Large Language Model)** to extract insights
* Groups reviews into **actionable issues**
* Displays them in a **clean, interactive dashboard**

---

## ⚙️ Features

### 🔹 Backend (Node.js + Express)

* LLM-powered review analysis
* Extracts:

  * Sentiment (positive / neutral / negative)
  * Primary issue (single top issue per review)
  * Short summary
* Groups reviews by issue
* Provides aggregated insights:

  * Total count per issue
  * Sentiment breakdown

---

### 🔹 Frontend (React + Tailwind CSS)

* 📂 Accordion-based issue grouping
* 🔝 Top insights (Top Issue, Total Reviews)
* 📊 Issue distribution chart
* 🎯 Sentiment filter (positive / neutral / negative)
* ⏳ Loading state
* ❌ Error handling with mock data fallback

---

## 🔌 API Endpoint

### `GET /reviews`

Returns grouped review insights:

```json
{
  "success": true,
  "data": [
    {
      "issue": "Delivery Delay",
      "count": 3,
      "sentimentBreakdown": {
        "positive": 0,
        "neutral": 1,
        "negative": 2
      },
      "reviews": [...]
    }
  ]
}
```

---

## 🤖 How LLM is Used (Core Logic)

The backend uses an LLM (via Groq API) to process each review.

### Step-by-step:

1. **Input:** Raw user review text

2. **LLM Prompting:**
   The model is instructed to return structured JSON:

   * sentiment
   * issue (single main problem)
   * summary

3. **Example Prompt:**

```txt
You are an API. Return ONLY valid JSON.

{
  "sentiment": "positive | negative | neutral",
  "issue": "one short issue",
  "summary": "short summary"
}

Review: "Delivery was late but product is good"
```

---

### 🧠 Why Single Issue?

Instead of multiple keywords, we extract **one primary issue per review** to:

* Reduce noise
* Simplify grouping
* Improve clarity for business users

---

### ⚡ Optimizations

* 🔁 **Parallel processing** → faster LLM calls
* 💰 **Caching** → avoids repeated API cost
* 🛡️ **Safe JSON parsing** → handles malformed responses
* 📊 **Aggregation layer** → UI-ready data

---

## 🧩 Architecture

```txt
Raw Reviews → LLM Processing → Structured Data → Grouping → API → Frontend Dashboard
```

---

## 🎯 Design Decisions

* Focused on **clarity over complexity**
* Optimized for **cost & performance**
* Built for **real-world scalability**
* UI designed for **quick decision-making**

---

## ⚠️ Notes

* Backend hosted on Render (may have **cold start delay**)
* Frontend handles failures gracefully using **mock data fallback**

---

## 🙌 Conclusion

This project demonstrates how **LLMs can be used in real-world applications** to transform unstructured text into actionable business insights.

---

## 📬 Contact

Feel free to reach out for any questions or feedback!
