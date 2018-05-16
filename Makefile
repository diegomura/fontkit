SOURCES = $(shell find src)

SHELL := /bin/bash
PATH := ./node_modules/.bin:$(PATH)

all: index.js base.js

src/opentype/shapers/dataTrie.json:
	babel-node src/opentype/shapers/generate-data.js

src/opentype/shapers/useTrie.json:
	babel-node src/opentype/shapers/gen-use.js

src/opentype/shapers/indicTrie.json:
	babel-node src/opentype/shapers/gen-indic.js

dataTrie.json: src/opentype/shapers/dataTrie.json
	cp src/opentype/shapers/dataTrie.json dataTrie.json

useTrie.json: src/opentype/shapers/useTrie.json
	cp src/opentype/shapers/useTrie.json useTrie.json

indicTrie.json: src/opentype/shapers/indicTrie.json
	cp src/opentype/shapers/indicTrie.json indicTrie.json

index.js: $(SOURCES) dataTrie.json useTrie.json indicTrie.json
	rollup -c -m -i src/index.js -o index.js

base.js: $(SOURCES) dataTrie.json useTrie.json indicTrie.json
	rollup -c -m -i src/base.js -o base.js

clean:
	rm -f index.js base.js dataTrie.json indicTrie.json useTrie.json src/opentype/shapers/dataTrie.json src/opentype/shapers/useTrie.json src/opentype/shapers/use.json src/opentype/shapers/indicTrie.json src/opentype/shapers/indic.json
