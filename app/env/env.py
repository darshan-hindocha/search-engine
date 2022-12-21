from flask_sqlalchemy import SQLAlchemy

class Environment:
    SQLALCHEMY_DATABASE_URI=None
    db= None

    def __new__(cls, db_uri, app):
        cls.SQLALCHEMY_DATABASE_URI=db_uri
        cls.db = SQLAlchemy(app)

    @classmethod
    def get_SQLALCHEMY_DB_URI(cls):
        return cls.SQLALCHEMY_DATABASE_URI

    @classmethod
    def get_db(cls):
        return