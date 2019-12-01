LOCAL_CONTAINER_NAME=autoloader_app
LOCAL_IMAGE_NAME=autoloader:app

# expand app first time
expand: app_build app_expand

# container for local development
app_build:
	docker build -t $(LOCAL_IMAGE_NAME) - < Dockerfile

# insall actual dependencies from package-lock.json
app_expand:
	docker run --rm -it \
		--name $(LOCAL_CONTAINER_NAME) \
		-v $(CURDIR):/usr/src/app \
		$(LOCAL_IMAGE_NAME) npm ci

# open bash in container
app_open:
	docker run --rm -it \
		--name $(LOCAL_CONTAINER_NAME) \
		-v $(CURDIR):/usr/src/app \
		$(LOCAL_IMAGE_NAME) /bin/bash

# тесты
test:
	docker run --rm -it \
		--name $(LOCAL_CONTAINER_NAME) \
		-v $(CURDIR):/usr/src/app \
		$(LOCAL_IMAGE_NAME) npm run test
