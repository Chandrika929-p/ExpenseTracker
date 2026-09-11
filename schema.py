from pydantic import BaseModel
from datetime import datetime

class CreateCategory(BaseModel):
    category_name: str

class CategoryResponse(BaseModel):
    id: int
    category_name: str

    model_config = {"from_attributes": True}

class ExpenseCreate(BaseModel):
    expense_name : str
    amount : float
    description : str
    expense_date  : datetime
    category_id : int

class ExpenseResponse(BaseModel):
    id : int
    expense_name: str
    amount: float
    description: str
    expense_date: datetime
    category_id: int
    category: CategoryResponse
    model_config = {"from_attributes": True}

class ExpenseUpdate(BaseModel):
    expense_name: str
    amount: float
    description: str
    expense_date: datetime
    category_id: int