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
