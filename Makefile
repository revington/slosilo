DOCS = docs/*.md
REPORTER = dot
default: @ 

test:
	@NODE_ENV=test ./node_modules/.bin/mocha -b \
		--reporter $(REPORTER)

test-cov: lib-cov
	@BSS_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@jscoverage lib $@

docs: 
	rm -rf docs
	mkdir docs
	$(MAKE) test REPORTER=markdown > docs/docs.md

docclean:
	rm -f docs/*.{1,html}

.PHONY: test docs docclean
