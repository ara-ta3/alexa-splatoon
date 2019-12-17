NPM=npm
AWS=aws

DIST=lambda.zip

install:
	$(NPM) install

zip: install
	zip -r $(DIST) index.js node_modules 

deploy: zip
	$(AWS) lambda update-function-code --function-name alexa-splatoon --zip-file fileb://./$(DIST)

