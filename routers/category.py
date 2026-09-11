import models
import database
from schema import CreateCategory, CategoryResponse
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session


router = APIRouter(tags=["Category"])


### category Endpoints ###
@router.post("/categories",response_model=CategoryResponse)
def create_new_category(
        category: CreateCategory,
        db: Session=Depends(database.get_db)
):
    new_category = models.Category(category_name = category.category_name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/categories",response_model=CategoryResponse)
def get_all_categories(db:Session=Depends(database.get_db)):
    category_list = db.query(models.Category).all()
    return category_list

@router.get("/categories/{category_id}")
def get_category_by_id(category_id: int,db:Session=Depends(database.get_db)):
    category = db.get(models.Category,category_id)
    if category is None:
        raise HTTPException(status_code=404,detail="Category not found")
    return category

@router.put("/categories/{category_id}")
def update_category(category_id:int,category_name:str,db: Session=Depends(database.get_db)):
    existing_category = db.get(models.Category,category_id)
    if existing_category is None:
        raise HTTPException(status_code=404,detail="Category not found")
    existing_category.category_name = category_name
    db.commit()

    return existing_category

@router.delete("/categories/{category_id}")
def delete_category(category_id:int,db:Session=Depends(database.get_db)):
    to_delete = db.get(models.Category,category_id)
    if to_delete is None:
        raise HTTPException(status_code=404,detail="Category not found")

    db.delete(to_delete)
    db.commit()
    return {"message":"Category deleted successfully"}



### relationship ###

@router.get("/categories/{category_id}/expenses")
def get_category_expenses(category_id:int,db:Session=Depends(database.get_db)):
    category = db.get(models.Category,category_id)
    if category is None:
        raise HTTPException(status_code=404,detail="Category not found")
    return category.expenses

