from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email) # it is a method provided by the BaseUserManager class that normalizes the email address by lowercasing the domain part of the email address, ensuring consistency and preventing duplicate entries in the database due to case sensitivity.
        user = self.model(
            email=email,
            **extra_fields # it is a dictionary of additional fields that can be passed when creating a user instance
        )
        user.set_password(password) # it is a method provided by the AbstractBaseUser class that securely hashes the password and stores it in the user instance, ensuring that the password is not stored in plain text in the database.
        user.save(using=self._db) # it is a method that saves the user instance to the database, using the database connection specified by self._db, which is typically the default database connection unless otherwise specified.
        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", User.Role.ADMIN)

        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )


class User(AbstractUser):

    class Role(models.TextChoices):
        BUYER = "BUYER", "Buyer"
        SELLER = "SELLER", "Seller"
        ADMIN = "ADMIN", "Administrator"

    username = None # it is set to None to indicate that the username field is not used in this custom user model, as the email field will be used as the unique identifier for authentication instead of a traditional username.

    name = models.CharField(max_length=100)

    email = models.EmailField(unique=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.BUYER
    )

    USERNAME_FIELD = "email" # it is a class attribute that specifies the field to be used as the unique identifier for authentication in this custom user model. In this case, it is set to "email", meaning that users will log in using their email addresses instead of a traditional username.

    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    def __str__(self):
        return self.email