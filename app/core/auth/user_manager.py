from fastapi_users import BaseUserManager, UUIDIDMixin
from fastapi import Depends, Request
from typing import Optional, TYPE_CHECKING
import logging

from app.models.db_helper import db_helper
from app.config import settings
from app.api.v1.mixin.user_id import IdIntPrimMixin

if TYPE_CHECKING:
    from app.models.user import User

log = logging.getLogger(__name__)


class UserManager(BaseUserManager['User', int], IdIntPrimMixin):
    reset_password_token_secret = settings.auth.authjwt_private_key
    verification_token_secret = settings.auth.authjwt_private_key

    def parse_id(self, id: str) -> int:
        return int(id)
    
    async def on_after_request_verify(
        self,
        user,
        token,
        request: Optional[Request] = None
    ):
        log.warning("Verification requested for user %r. Verification token: %r", user.id, token)
        
    async def on_after_register(
        self,
        user: 'User',
        request: Optional[Request] = None,
    ):
        log.info("User registered: %r", user.id)
        
    async def on_after_forgot_password(
        self,
        user: 'User',
        token: str,
        request: Optional[Request] = None,
    ):
        log.warning("User %r has forgot their password. Reset token: %r", user.id, token)

async def get_user_manager(user_db=Depends(db_helper.session_dependancy)):
    yield UserManager(user_db)