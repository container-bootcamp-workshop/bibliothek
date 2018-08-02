.PHONY: image

# The binary to build (just the basename).
APP := crest

VERSION ?= "latest"

image:
	docker build -t quay.io/containerbootcamp/$(APP):$(VERSION) .
	docker push quay.io/containerbootcamp/$(APP):$(VERSION)