from sqlalchemy import Column, String, Integer

from database import SessionLocal, Base
from models import Category

db = SessionLocal()







categories = db.query(Category).all()
for category in categories:
    print(category.category_name)

