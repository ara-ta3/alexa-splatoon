NPM=npm
AWS=aws
TSC=./node_modules/.bin/tsc

LAMBDA_DIST=lambda.zip
SOURCE_DIST=__dist

.PHONY: test

all: install compile zip deploy

install:
	$(NPM) install

test: clean
	$(NPM) run test

compile:
	$(NPM) run compile

zip:
	zip -r $(LAMBDA_DIST) node_modules $(SOURCE_DIST)

deploy: zip
	$(AWS) lambda update-function-code --function-name alexa-splatoon --zip-file fileb://./$(LAMBDA_DIST)

