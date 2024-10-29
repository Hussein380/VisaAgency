# app.py
from flask import Flask
from config import Config
from models import db
from routes.news_routes import news_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the database
db.init_app(app)

# Register Blueprints
app.register_blueprint(news_bp)

# Create tables if not exist

def create_tables():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)

