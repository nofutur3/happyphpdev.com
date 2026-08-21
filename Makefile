.PHONY: lint test

lint:
	npx prettier --check "src/**/*.{js,jsx,ts,tsx}" "gatsby-*.js"

test:
	@echo "No test suite configured yet (see 'npm test' stub in package.json)."
