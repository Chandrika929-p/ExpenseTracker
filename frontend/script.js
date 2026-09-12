
const CATEGORY_URL = "/categories";
const EXPENSE_URL = "/expenses";


// ========================================
// Category Elements
// ========================================

const categoryNameInput =
    document.getElementById("category-name");

const addCategoryButton =
    document.getElementById("add-category-btn");

const categoriesContainer =
    document.getElementById("categories-container");


// ========================================
// Expense Elements
// ========================================

const expenseNameInput =
    document.getElementById("expense-name");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("expense-date");

const descriptionInput =
    document.getElementById("description");

const addExpenseButton =
    document.getElementById("add-expense-btn");

const expensesContainer =
    document.getElementById("expenses-container");

const totalExpense =
    document.getElementById("total-expense");


// ========================================
// Filter Elements
// ========================================

const filterCategory =
    document.getElementById("filter-category");

const minAmount =
    document.getElementById("min-amount");

const maxAmount =
    document.getElementById("max-amount");

const startDate =
    document.getElementById("start-date");

const endDate =
    document.getElementById("end-date");

const sortBy =
    document.getElementById("sort-by");

const order =
    document.getElementById("order");

const filterButton =
    document.getElementById("filter-btn");

const showAllButton =
    document.getElementById("show-all-btn");


// ========================================
// Edit Elements
// ========================================

const editForm =
    document.getElementById("edit-form");

const editExpenseName =
    document.getElementById("edit-expense-name");

const editAmount =
    document.getElementById("edit-amount");

const editCategory =
    document.getElementById("edit-category");

const editExpenseDate =
    document.getElementById("edit-expense-date");

const editDescription =
    document.getElementById("edit-description");

const saveEditButton =
    document.getElementById("save-edit-btn");

const cancelEditButton =
    document.getElementById("cancel-edit-btn");


let editingExpenseId = null;


// ========================================
// Get Categories
// ========================================

async function getCategories() {

    try {

        const response =
            await fetch(CATEGORY_URL);

        if (!response.ok) {
            throw new Error("Failed to load categories");
        }

        const categories =
            await response.json();


        categoriesContainer.innerHTML = "";

        categoryInput.innerHTML =
            '<option value="">Select Category</option>';

        filterCategory.innerHTML =
            '<option value="">All Categories</option>';

        editCategory.innerHTML =
            '<option value="">Select Category</option>';


        if (categories.length === 0) {

            categoriesContainer.innerHTML = `
                <p class="empty-state">
                    No categories found.
                </p>
            `;

            return;
        }


        categories.forEach(category => {

            // Add category to dropdowns

            const option =
                document.createElement("option");

            option.value = category.id;

            option.textContent =
                category.category_name;


            categoryInput.appendChild(
                option.cloneNode(true)
            );

            filterCategory.appendChild(
                option.cloneNode(true)
            );

            editCategory.appendChild(
                option.cloneNode(true)
            );


            // Display category

            const categoryItem =
                document.createElement("div");

            categoryItem.className =
                "category-item";


            categoryItem.innerHTML = `

                <span class="category-name">
                    ${category.category_name}
                </span>

                <div class="category-actions">

                    <button
                        class="delete-btn"
                        onclick="deleteCategory(${category.id})">

                        Delete

                    </button>

                </div>

            `;


            categoriesContainer.appendChild(
                categoryItem
            );

        });


    } catch (error) {

        console.error(error);

        categoriesContainer.innerHTML = `
            <p class="empty-state">
                Unable to load categories.
            </p>
        `;

    }

}


// ========================================
// Add Category
// ========================================

async function addCategory() {

    const categoryName =
        categoryNameInput.value.trim();


    if (!categoryName) {

        alert(
            "Please enter a category name."
        );

        return;
    }


    try {

        const response =
            await fetch(
                CATEGORY_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        category_name:
                            categoryName

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add category"
            );

        }


        categoryNameInput.value = "";


        await getCategories();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to add category."
        );

    }

}


// ========================================
// Delete Category
// ========================================

async function deleteCategory(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${CATEGORY_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete category"
            );

        }


        await getCategories();

        await getExpenses();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete category. It may contain expenses."
        );

    }

}


// ========================================
// Display Expenses
// ========================================

function displayExpenses(expenses) {

    expensesContainer.innerHTML = "";

    let total = 0;


    if (expenses.length === 0) {

        expensesContainer.innerHTML = `

            <div class="empty-state">

                <h3>No Expenses Found 💸</h3>

                <p>
                    Add an expense or change your filters.
                </p>

            </div>

        `;

        totalExpense.textContent =
            "Total: ₹0.00";

        return;
    }


    expenses.forEach(expense => {

        total += Number(expense.amount);


        const expenseCard =
            document.createElement("div");

        expenseCard.className =
            "expense-card";


        const categoryName =
            expense.category
                ? expense.category.category_name
                : "Unknown";


        const formattedDate =
            new Date(
                expense.expense_date
            ).toLocaleString();


        expenseCard.innerHTML = `

            <div class="expense-top">

                <h3>
                    ${expense.expense_name}
                </h3>

                <span class="expense-amount">
                    ₹${Number(expense.amount).toFixed(2)}
                </span>

            </div>


            <div class="expense-info">

                <p>
                    <strong>Category:</strong>

                    <span class="category-badge">
                        ${categoryName}
                    </span>
                </p>


                <p>
                    <strong>Date:</strong>
                    ${formattedDate}
                </p>


                <p>
                    <strong>Description:</strong>
                    ${expense.description || "No description"}
                </p>

            </div>


            <div class="expense-actions">

                <button
                    class="edit-btn"
                    onclick="editExpense(${expense.id})">

                    Edit

                </button>


                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">

                    Delete

                </button>

            </div>

        `;


        expensesContainer.appendChild(
            expenseCard
        );

    });


    totalExpense.textContent =
        `Total: ₹${total.toFixed(2)}`;

}


// ========================================
// Get Expenses
// ========================================

async function getExpenses(params = "") {

    expensesContainer.innerHTML =
        '<p class="loading">Loading expenses...</p>';


    try {

        const response =
            await fetch(
                `${EXPENSE_URL}${params}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load expenses"
            );

        }


        const expenses =
            await response.json();


        displayExpenses(expenses);


    } catch (error) {

        console.error(error);

        expensesContainer.innerHTML = `

            <div class="empty-state">

                <h3>Something went wrong 😕</h3>

                <p>
                    Unable to load expenses.
                </p>

            </div>

        `;

    }

}


// ========================================
// Add Expense
// ========================================

async function addExpense() {

    const expenseName =
        expenseNameInput.value.trim();

    const amount =
        amountInput.value;

    const categoryId =
        categoryInput.value;

    const expenseDate =
        dateInput.value;

    const description =
        descriptionInput.value.trim();


    if (
        !expenseName ||
        !amount ||
        !categoryId ||
        !expenseDate
    ) {

        alert(
            "Please fill all required fields."
        );

        return;
    }


    const expenseData = {

        expense_name:
            expenseName,

        amount:
            Number(amount),

        description:
            description,

        expense_date:
            new Date(
                expenseDate
            ).toISOString(),

        category_id:
            Number(categoryId)

    };


    try {

        const response =
            await fetch(
                EXPENSE_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(expenseData)

                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to add expense"
            );

        }


        expenseNameInput.value = "";

        amountInput.value = "";

        categoryInput.value = "";

        dateInput.value = "";

        descriptionInput.value = "";


        await getExpenses();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to add expense."
        );

    }

}


// ========================================
// Delete Expense
// ========================================

async function deleteExpense(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this expense?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${EXPENSE_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to delete expense"
            );

        }


        await getExpenses();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete expense."
        );

    }

}


// ========================================
// Open Edit Form
// ========================================

async function editExpense(id) {

    editingExpenseId = id;


    try {

        const response =
            await fetch(
                `${EXPENSE_URL}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to get expense"
            );

        }


        const expense =
            await response.json();


        editExpenseName.value =
            expense.expense_name;

        editAmount.value =
            expense.amount;

        editCategory.value =
            expense.category_id;

        editDescription.value =
            expense.description || "";


        if (expense.expense_date) {

            const date =
                new Date(
                    expense.expense_date
                );


            const localDate =
                new Date(
                    date.getTime()
                    -
                    date.getTimezoneOffset()
                    * 60000
                )
                .toISOString()
                .slice(0, 16);


            editExpenseDate.value =
                localDate;

        }


        editForm.style.display =
            "block";


        editForm.scrollIntoView({
            behavior: "smooth"
        });


    } catch (error) {

        console.error(error);

        alert(
            "Unable to load expense."
        );

    }

}


// ========================================
// Save Edited Expense
// ========================================

saveEditButton.addEventListener(
    "click",
    async function () {

        const expenseName =
            editExpenseName.value.trim();

        const amount =
            editAmount.value;

        const categoryId =
            editCategory.value;

        const expenseDate =
            editExpenseDate.value;

        const description =
            editDescription.value.trim();


        if (
            !expenseName ||
            !amount ||
            !categoryId ||
            !expenseDate
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        const expenseData = {

            expense_name:
                expenseName,

            amount:
                Number(amount),

            description:
                description,

            expense_date:
                new Date(
                    expenseDate
                ).toISOString(),

            category_id:
                Number(categoryId)

        };


        try {

            const response =
                await fetch(
                    `${EXPENSE_URL}/${editingExpenseId}`,
                    {

                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(expenseData)

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Failed to update expense"
                );

            }


            editForm.style.display =
                "none";

            editingExpenseId = null;


            editExpenseName.value = "";

            editAmount.value = "";

            editCategory.value = "";

            editExpenseDate.value = "";

            editDescription.value = "";


            await getExpenses();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to update expense."
            );

        }

    }
);


// ========================================
// Cancel Edit
// ========================================

cancelEditButton.addEventListener(
    "click",
    function () {

        editForm.style.display =
            "none";

        editingExpenseId = null;

        editExpenseName.value = "";

        editAmount.value = "";

        editCategory.value = "";

        editExpenseDate.value = "";

        editDescription.value = "";

    }
);


// ========================================
// Apply Filters
// ========================================

filterButton.addEventListener(
    "click",
    function () {

        const params =
            new URLSearchParams();


        if (filterCategory.value) {

            params.append(
                "category_id",
                filterCategory.value
            );

        }


        if (minAmount.value) {

            params.append(
                "min_amount",
                minAmount.value
            );

        }


        if (maxAmount.value) {

            params.append(
                "max_amount",
                maxAmount.value
            );

        }


        if (startDate.value) {

            params.append(
                "start_date",
                `${startDate.value}T00:00:00`
            );

        }


        if (endDate.value) {

            params.append(
                "end_date",
                `${endDate.value}T23:59:59`
            );

        }


        params.append(
            "sort_by",
            sortBy.value
        );


        params.append(
            "order",
            order.value
        );


        getExpenses(
            `?${params.toString()}`
        );

    }
);


// ========================================
// Show All
// ========================================

showAllButton.addEventListener(
    "click",
    function () {

        filterCategory.value = "";

        minAmount.value = "";

        maxAmount.value = "";

        startDate.value = "";

        endDate.value = "";

        sortBy.value = "amount";

        order.value = "desc";


        getExpenses();

    }
);


// ========================================
// Initial Load
// ========================================

async function initializeApp() {

    await getCategories();

    await getExpenses();

}


addCategoryButton.addEventListener(
    "click",
    addCategory
);


addExpenseButton.addEventListener(
    "click",
    addExpense
);


initializeApp();