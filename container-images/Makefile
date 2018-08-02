
REPO=quay.io
GROUP=containerbootcamp

URI=$(REPO)/$(GROUP)/

DIRS = sbt-project-builder github-webhook-handler postgres-simple opentracing-nginx postgrespool postgres cors-nginx zookeeper kafka alpine-varnish crest postgres-init

images: 
	for i in $(DIRS); do \
		docker build -t $(URI)$$i:latest --rm=true --pull=false --no-cache=true --force-rm=true ./$$i; \
		docker push $(URI)$$i:latest; \
	done


