# Celestial Fuels - Digital Marketplace for Alternative Fuels

This is a functional prototype of the Energy Marketplace.

## Prerequisites

1.  **Python 3.8+** must be installed.
2.  (Optional) A virtual environment is recommended.

## Setup Instructions

1.  **Navigate to the backend directory**:
    ```powershell
    cd backend
    ```

2.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```

3.  **Initialize the Database**:
    ```powershell
    python init_db.py
    ```
    This will create a `marketplace.db` SQLite file.

4.  **Run the Server**:
    ```powershell
    uvicorn main:app --reload
    ```

5.  **Access the App**:
    Open your browser and go to `http://127.0.0.1:8000`.

## Features
*   **Frontend**: A responsive Tailwind CSS landing page (located in `frontend/`).
*   **Backend**: FastAPI server with SQLite database.
*   **API Specs**: view automatic documentation at `http://127.0.0.1:8000/docs`.
