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
