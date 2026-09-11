from fastapi import FastAPI
import database
from routers import category, expense

app = FastAPI()

database.Base.metadata.create_all(bind=database.engine)

app.include_router(category.router)
app.include_router(expense.router)





