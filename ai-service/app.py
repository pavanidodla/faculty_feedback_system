from flask import Flask, request, jsonify
from textblob import TextBlob
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
    data = request.json
    comment = data.get("comment", "")

    blob = TextBlob(comment)
    polarity = blob.sentiment.polarity

    if polarity > 0:
        sentiment = "Positive"
    elif polarity < 0:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    return jsonify({
        "sentiment": sentiment,
        "score": round(polarity, 2)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)