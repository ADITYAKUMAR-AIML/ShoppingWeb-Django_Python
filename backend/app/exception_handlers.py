import logging
import traceback
import uuid

from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler


logger = logging.getLogger("api")


def custom_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    request = context.get("request")
    view = context.get("view")

    error_id = str(uuid.uuid4())
    extra = {
        "error_id": error_id,
        "exception_type": exc.__class__.__name__,
        "path": getattr(request, "path", None),
        "method": getattr(request, "method", None),
        "view": f"{view.__class__.__module__}.{view.__class__.__name__}" if view else None,
        "user": getattr(getattr(request, "user", None), "id", None),
    }

    if response is None:
        payload = {
            "error": "Internal Server Error",
            "error_id": error_id,
        }
        if settings.DEBUG:
            payload["detail"] = str(exc)
            payload["trace"] = traceback.format_exc()
            payload["context"] = {k: extra[k] for k in ["path", "method", "view", "user"]}
        logger.error("Unhandled API exception", extra=extra, exc_info=exc)
        return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        data = response.data
        data = data if isinstance(data, dict) else {"detail": data}
        data.update({"error_id": error_id, "exception_type": exc.__class__.__name__})
        if settings.DEBUG:
            data["trace"] = traceback.format_exc()
        logger.warning("Handled API exception", extra=extra, exc_info=exc)
        response.data = data
        return response