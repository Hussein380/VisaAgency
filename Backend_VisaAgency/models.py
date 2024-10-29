# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class News(db.Model):
    __tablename__ = 'news'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)
    excerpt = db.Column(db.Text, nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(255), nullable=True)
    link = db.Column(db.String(255), nullable=True)

    def __init__(self, title, category, date, excerpt, content, image=None, link=None):
        self.title = title
        self.category = category
        self.date = date
        self.excerpt = excerpt
        self.content = content
        self.image = image
        self.link = link

