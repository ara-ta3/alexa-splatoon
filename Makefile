NPM=npm
AWS=aws
TSC=./node_modules/.bin/tsc

DIST=lambda.zip

install:
	$(NPM) install

compile:
	$(TSC) index.ts

zip: install compile
	zip -r $(DIST) index.js node_modules src

deploy: zip
	$(AWS) lambda update-function-code --function-name alexa-splatoon --zip-file fileb://./$(DIST)

