import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "src")))

import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from users import get_current_user


async def override_get_current_user():
    return 1


async def override_session_dependency():
    yield None


app.dependency_overrides[get_current_user] = override_get_current_user


@pytest.mark.anyio
async def test_create_aquarium_validation_error():
    """
    ТЕСТ 1: Обробка помилкових вхідних даних.
    Відправляємо рядок замість числа у поле volume.
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        invalid_payload = {
            "name": "Мій Акваріум",
            "volume": "дуже багато літрів",
            "type": "Freshwater",
            "image_id": 1,
        }
        response = await ac.post("/aquariums/", json=invalid_payload)

        assert response.status_code == 422
        assert "msg" in response.json()["detail"][0]


@pytest.mark.asyncio
async def test_get_docs_availability():
    """
    ТЕСТ 2: Доступність документації API (OpenAPI).
    """
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/docs")
        assert response.status_code == 200
        assert "swagger-ui" in response.text.lower()


@pytest.mark.asyncio
async def test_protected_route_without_token():
    """
    ТЕСТ 3: Помилкова дія користувача (доступ без авторизації).
    Тут ми тимчасово приберемо оверрайд, щоб перевірити реальний захист.
    """
    app.dependency_overrides = {}

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.get("/aquariums/my-aquariums/")
        # Очікуємо 401, бо ми не передали заголовок Authorization
        assert response.status_code == 401

    app.dependency_overrides[get_current_user] = override_get_current_user
