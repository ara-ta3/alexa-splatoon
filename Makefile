NPM=npm
AWS=aws
TSC=./node_modules/.bin/tsc

DIST=lambda.zip

all: install compile zip deploy

install:
	$(NPM) install

compile:
	$(NPM) run compile

zip:
	zip -r $(DIST) node_modules src

deploy: zip
	$(AWS) lambda update-function-code --function-name alexa-splatoon --zip-file fileb://./$(DIST)

