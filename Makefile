NPM=npm
AWS=aws
TSC=./node_modules/.bin/tsc

DIST=lambda.zip

.PHONY: test

all: install compile zip deploy

install:
	$(NPM) install

test: compile
	$(NPM) run test

compile:
	$(NPM) run compile

zip:
	zip -r $(DIST) node_modules src

deploy: zip
	$(AWS) lambda update-function-code --function-name alexa-splatoon --zip-file fileb://./$(DIST)

