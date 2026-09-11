import models
import database

from schema import ExpenseCreate, ExpenseResponse, ExpenseUpdate
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

router = APIRouter(tags=["Expense"])

### Expense Endpoints ###



@router.post("/expenses",response_model=ExpenseResponse)
def create_new_expense(
        expense: ExpenseCreate,
        db:Session=Depends(database.get_db)):

    category = db.get(models.Category,expense.category_id)
    if category is None:
        raise HTTPException(status_code=404,detail="Category not found")
    new_expense = models.Expense(expense_name=expense.expense_name,
                                 amount=expense.amount,
                                 description=expense.description,
                                 expense_date=expense.expense_date,
                                 category_id=expense.category_id)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


@router.get("/expenses",response_model=ExpenseResponse)
def get_all_expenses(
        db:Session=Depends(database.get_db),
        category_id:int | None=None,
        min_amount:int | None=None,
        max_amount:int| None = None,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        sort_by:str = Query("amount",pattern="^(amount|expense_date)$"),
        order : str = Query("desc",pattern="^(desc|asc)$"),
        page: int = Query(1,ge=1) ,
        limit :int = Query(100,ge=1,le=100) ):
    to_get = db.query(models.Expense)
    if category_id is not None:
        to_get = to_get.filter(models.Expense.category_id == category_id)
    if min_amount is not None:
        to_get = to_get.filter(models.Expense.amount >= min_amount)
    if max_amount is not None:
        to_get = to_get.filter(models.Expense.amount <= max_amount)
    if start_date is not None:
        to_get = to_get.filter(models.Expense.expense_date >= start_date)
    if end_date is not None:
        to_get = to_get.filter(models.Expense.expense_date <= end_date)
    sort_columns = {
        "amount": models.Expense.amount,
        "expense_date": models.Expense.expense_date
    }
    to_get= to_get.order_by(sort_columns[sort_by].desc() if order == "desc" else sort_columns[sort_by].asc())

    offset = (page - 1) * limit

    return to_get.offset(offset).limit(limit).all()

@router.get("/expenses/{expense_id}")
def get_expenses_by_id(expense_id:int,db:Session=Depends(database.get_db)):
    existing_expense = db.get(models.Expense,expense_id)
    if existing_expense is None:
        raise HTTPException(status_code=404,detail="Expense not found")
    return existing_expense

@router.put("/expenses/{expense_id}")
def update_expense(
        expense_id:int,
        expense : ExpenseUpdate,
        db:Session=Depends(database.get_db)):
    existing_expense = db.get(models.Expense,expense_id)
    category = db.get(models.Category, expense.category_id)
    if existing_expense is None:
        raise HTTPException(status_code=404,detail="Expense not found")
    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    existing_expense.expense_name = expense.expense_name
    existing_expense.amount = expense.amount
    existing_expense.description = expense.description
    existing_expense.expense_date = expense.expense_date
    existing_expense.category_id = expense.category_id
    db.commit()
    db.refresh(existing_expense)
    return existing_expense


@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id:int,db:Session=Depends(database.get_db)):
    to_delete = db.get(models.Expense,expense_id)
    if to_delete is None:
        raise HTTPException(status_code=404,detail="Expense not found")
    db.delete(to_delete)
    db.commit()
    return {"message":"Expense deleted successfully"}