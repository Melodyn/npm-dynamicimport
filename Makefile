LOCAL_CONTAINER_NAME=autoloader_app
LOCAL_IMAGE_NAME=autoloader:app

# expand app first time
expand: app_build app_expand

up: app_up app_start # run app
down: app_down # stop app

# container for local development
app_build:
	docker build -t $(LOCAL_IMAGE_NAME) - < Dockerfile

# insall actual dependencies from package-lock.json
app_expand:
	docker run --rm \
		-it \
		-v $(CURDIR):/usr/src/app \
		$(LOCAL_IMAGE_NAME) npm ci

# open bash in container
app_open:
	docker exec -it $(LOCAL_CONTAINER_NAME) /bin/bash

# тесты
test:
	docker exec -it $(LOCAL_CONTAINER_NAME) /bin/bash -c "npm run test"
