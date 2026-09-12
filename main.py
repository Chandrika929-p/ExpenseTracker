
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

import database
from routers import category, expense


app = FastAPI(
    title="Expense Tracker API",
    description="API for managing expenses and categories",
    version="1.0.0"
)


# Create database tables
database.Base.metadata.create_all(
    bind=database.engine
)


# API Routers
app.include_router(category.router)
app.include_router(expense.router)


# Serve Frontend
app.mount(
    "/",
    StaticFiles(directory="frontend", html=True),
    name="frontend"
)