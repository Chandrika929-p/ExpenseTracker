from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from database import Base




class Category(Base):
    expenses = relationship("Expense",back_populates="category")

    __tablename__ = 'categories'

    id = Column(Integer,primary_key=True)
    category_name = Column(String , nullable=False)



class Expense(Base):
    category = relationship("Category", back_populates="expenses")

    __tablename__ = 'expenses'

    id = Column(Integer,primary_key=True)
    expense_name = Column(String , nullable=False)
    amount = Column(Numeric(10,2) , nullable=False)
    description = Column(String )
    expense_date = Column(DateTime , nullable=False)
    category_id = Column(Integer,ForeignKey('categories.id'),nullable=False)



