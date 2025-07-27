# Create Auth Context in React

https://github.com/user-attachments/assets/5acd817c-9e0a-4569-ac03-35ef0b3449d9

# Setup
1. Clone this repo
```
git clone https://github.com/thuinanutshell/react-context-auth
```
2. Go to the backend folder and create a virtual environment
```
cd backend
python3 -m venv .venv
```
3. Install all the dependencies in the `requirements.txt` file
```
pip install -r requirements.txt
```
4. Run the backend
```
python3 app.py
```
5. Create a new terminal and go to the frontend
```
cd frontend
```
9. Install all dependencies and run the frontend
```
npm install
npm run dev
```

# Tutorial
## Backend
I set up the backend API using Flask and SQLite for the database. The folder structure is very straightforward because the main purpose of this project is to practice creating a context in React. The order in which I created the backend is: 
1. Define the model (database) schema
2. Define the API routes
3. Register blueprints and configurations for the whole app
   
- `models.py`: I used `flask_sqlalchemy` to define the model, and the code is pretty simple. First, we need to initialize a `db` object. Then, we create a helper function to generate the `UUID` and convert it into a string because, according to the documentation for `flask_jwt_extended`, the method `create_access_token` only accepts a string, so we need to be careful here. In the past, I defined the ID as an integer, and got an error that the ID is not in a valid form.

<img width="880" height="174" alt="Screenshot 2025-07-27 at 5 43 23 PM" src="https://github.com/user-attachments/assets/a9a82b88-895f-4e58-a5f9-7ddc9506708e" />

```python
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
import uuid

db = SQLAlchemy()


def generate_uuid():
    return str(uuid.uuid4())


class User(db.Model):
    id: Mapped[str] = mapped_column(String, primary_key=True, default=generate_uuid)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hashed: Mapped[str] = mapped_column(String)
```
- `routes.py`: I defined the API for the authentication feature here - register, login, logout. I used JWT (JSON Web Token) as the authentication method, so I will use the `flask_jwt_extended` library for this. We will also need to initialize an object for the JWT Manager and use Redis to revoke a token when a user logs out. 
```python
from flask import Flask, Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    JWTManager,
    get_jwt,
)
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from datetime import timedelta
import redis

auth = Blueprint("auth", __name__)
jwt = JWTManager()
ACCESS_EXPIRES = timedelta(hours=1)
jwt_redis_blocklist = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


@auth.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    new_user = User(
        username=username, email=email, password_hashed=generate_password_hash(password)
    )
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=new_user.id)

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": {"username": new_user.username, "email": new_user.email},
                "access_token": access_token,
            }
        ),
        201,
    )


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    login = data.get("login")
    password = data.get("password")

    user = User.query.filter((User.username == login) | (User.email == login)).first()
    if not user:
        return jsonify({"message": "Username or email are invalid"}), 400

    if not check_password_hash(user.password_hashed, password):
        return jsonify({"message": "Invalid password"}), 400

    access_token = create_access_token(identity=user.id)
    return (
        jsonify(
            {
                "message": "User logged in successfully",
                "user": {"username": user.username, "email": user.email},
                "access_token": access_token,
            }
        ),
        200,
    )


@auth.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    jwt_redis_blocklist.set(jti, "", ex=ACCESS_EXPIRES)
    return jsonify(msg="Access token revoked")
```
- `app.py`: Finally, we configure the app and register the blueprint
```python
from models import db
from routes import auth, jwt
from flask import Flask
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

# Set configuration FIRST
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# THEN initialize extensions
app.register_blueprint(auth)
db.init_app(app)
jwt.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
```

## Frontend
The order in which I developed the frontend is:
1. Define the API that interacts with the backend in `api.js`
2. Create a custom hook for authentication using context in `AuthContext.jsx`
3. Create essential components and group them inside the components folder
4. Set up the routes in `App.jsx`

# Resources
[1] https://react.dev/learn/passing-data-deeply-with-context

[2] https://flask-jwt-extended.readthedocs.io/en/stable/blocklist_and_token_revoking.html
