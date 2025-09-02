from fastapi_users import FastAPIUsers
from typing import TYPE_CHECKING

from app.api.v1.dependancy.dependancy_user_manager import get_user_manager
from app.api.v1.dependancy.backend import auth_backend

if TYPE_CHECKING:
    from app.models.db_helper import User

fastapi_users = FastAPIUsers['User', int](
    get_user_manager,
    [auth_backend],
)
current_user = fastapi_users.current_user(active=True)

current_superuser = fastapi_users.current_user(active=True, superuser=True)