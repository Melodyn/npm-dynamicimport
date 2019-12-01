LOCAL_CONTAINER_NAME=autoloader_app
LOCAL_IMAGE_NAME=autoloader:app

# развернуть приложение первый раз
expand: app_build app_expand up

up: app_up app_start # запустить приложение
down: app_down # остановить приложение

# обновить версию приложения
version_change:
	docker run --rm \
		-it \
		-v $(CURDIR):/usr/src/app \
		$(LOCAL_IMAGE_NAME) npm run --silent version:change

# собрать контейнер для локальной разработки
app_build:
	docker build -t $(LOCAL_IMAGE_NAME) - < Dockerfile

# запустить приложение только для установки актуальных пакетов из package-lock.json
app_expand:
	docker run --rm \
		-it \
		-v $(CURDIR):/usr/src/app \
		$(LOCAL_IMAGE_NAME) npm ci

# запустить приложение как демон
app_up:
	docker run --rm -it \
		--name $(LOCAL_CONTAINER_NAME) \
		-v $(CURDIR):/usr/src/app \
		-d $(LOCAL_IMAGE_NAME) || true

# открыть запущенный контейнер с приложением
app_open:
	docker exec -it $(LOCAL_CONTAINER_NAME) /bin/bash

# запустить приложение в контейнере
app_start:
	docker exec -it $(LOCAL_CONTAINER_NAME) /bin/bash -c "npm start"

# остановить приложение, даже если остановлено
app_down:
	docker stop $(LOCAL_CONTAINER_NAME) || true

# тесты
test:
	docker exec -it $(LOCAL_CONTAINER_NAME) /bin/bash -c "npm run test"
