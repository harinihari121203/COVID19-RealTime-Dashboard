from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

@app.route('/global_data')
def global_data():
    url = "https://disease.sh/v3/covid-19/all"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/country_data')
def country_data():
    url = "https://disease.sh/v3/covid-19/countries"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/historical_data')
def historical_data():
    url = "https://disease.sh/v3/covid-19/historical/all?lastdays=30"
    response = requests.get(url)
    return jsonify(response.json())

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
