# routes/news_routes.py
from flask import Blueprint, request, jsonify
from models import db, News

news_bp = Blueprint('news', __name__)

@news_bp.route('/api/news', methods=['GET'])
def get_all_news():
    news_items = News.query.all()
    return jsonify([{
        'id': item.id,
        'title': item.title,
        'category': item.category,
        'date': item.date.strftime('%Y-%m-%d'),
        'excerpt': item.excerpt,
        'content': item.content,
        'image': item.image,
        'link': item.link
    } for item in news_items])

@news_bp.route('/api/news', methods=['POST'])
def add_news():
    data = request.json
    new_news = News(
        title=data['title'],
        category=data['category'],
        date=data.get('date', datetime.utcnow()),
        excerpt=data['excerpt'],
        content=data['content'],
        image=data.get('image'),
        link=data.get('link')
    )
    db.session.add(new_news)
    db.session.commit()
    return jsonify({'message': 'News item added successfully'}), 201

@news_bp.route('/api/news/<int:id>', methods=['PUT'])
def update_news(id):
    data = request.json
    news_item = News.query.get_or_404(id)
    news_item.title = data['title']
    news_item.category = data['category']
    news_item.date = data['date']
    news_item.excerpt = data['excerpt']
    news_item.content = data['content']
    news_item.image = data.get('image')
    news_item.link = data.get('link')
    db.session.commit()
    return jsonify({'message': 'News item updated successfully'})

@news_bp.route('/api/news/<int:id>', methods=['DELETE'])
def delete_news(id):
    news_item = News.query.get_or_404(id)
    db.session.delete(news_item)
    db.session.commit()
    return jsonify({'message': 'News item deleted successfully'})

