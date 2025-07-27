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
