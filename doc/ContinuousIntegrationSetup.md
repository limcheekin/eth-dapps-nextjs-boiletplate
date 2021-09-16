# Continuous Integration(CI) Setup

## Overview
The CI build pipeline is setup with GitHub Actions by referring to the excellent article: [Solidity and Truffle Continuous Integration Setup](https://ethereum.org/en/developers/tutorials/solidity-and-truffle-continuous-integration-setup/). In general, the execution of the following build processes will be triggered by `git push`:

 - Unit Testing with `truffle test`
 - ETH Gas Reporting with `codechecks` and `eth-gas-reporter`
 - Test Coverage with `solidity-coverage` and `coveralls`
 - Secure Code Analysis with `smartbugs` ([11 tools supported](https://github.com/smartbugs/smartbugs#supported-tools))

 Please refer to the full GitHub workflow file at [.github/workflows/truffle.yml](../.github/workflows/truffle.yml). I will further elaborate each build process below.



## Build Processes

### Check out the source code
First, check out the source code from GitHub repository.
```yaml
- uses: actions/checkout@v2
```    

### Setup NodeJS
Setup NodeJS environment required by Truffle.
```yaml
- name: Setup NodeJS 14
  uses: actions/setup-node@v2
  with:
    node-version: '14'
- name: Show NodeJS version    
  run: npm --version
```

### Create .env file (Optional)
This step is optional. It is for generate .env file with environment variables defined in `DOT_ENV` secret. These environment variables are used in unit testing.
```yaml    
- name: Create .env file
  run: echo "${{ secrets.DOT_ENV }}" > .env
```
Please refer to [the GitHub documentation](https://docs.github.com/en/actions/reference/encrypted-secrets) on how to create Encrypted Secrets.

### Install Truffle
Install truffle globally.
```yaml
- name: Install Truffle
  run: npm install truffle -g
```

### Install Dependencies
Install dependencies that used in build process such as `@codechecks/client`, `coveralls`, `eth-gas-reporter`, `solidity-coverage` or functional/testing code such as `@openzeppelin/contracts`, `@openzeppelin/test-helpers`, etc.
```yaml
- name: Install Truffle Dependencies
  run: npm install      
```

### Run Truffle Test
The `CI=true` flag is required for the creation of the `gasReporterOutput.json` file to be consumed by `eth-gas-reporter/codechecks`.
```yaml
- name: Run Truffle Test with CI=true for Codechecks  
  run: CI=true truffle test
```
Expected output:

![Test Report](https://github.com/limcheekin/eth-dapps-nextjs-boiletplate/raw/master/doc/images/test.png "Test Report")

### Run Codechecks
This step will generate ETH gas report for smart contracts.
```yaml
- name: Run Codechecks
  run: npx codechecks
  env:
    CC_SECRET: ${{ secrets.CC_SECRET }}  
```
Expected output:

![ETH Gas Report](https://github.com/limcheekin/eth-dapps-nextjs-boiletplate/raw/master/doc/images/eth-gas-report.png "ETH Gas Report")

You need to request the `CC_SECRET` from https://app.codechecks.io/ for CI build.

### Run Test Coverage
```yaml
- name: Run Test Coverage
  run: truffle run coverage
```
Expected output:

![Coverage](https://github.com/limcheekin/eth-dapps-nextjs-boiletplate/raw/master/doc/images/coverage.png "Coverage")

### Send Coverage Data To Coveralls (Optional)
This step is optional. First, it generates `.coveralls.yml` file with `repo_token` defined in `DOT_COVERALLS_YML` secret. Then, it sends the coverage data to `coveralls`.
```yaml    
- name: Generate .coveralls.yml file
  run: echo "${{ secrets.DOT_COVERALLS_YML }}" > .coveralls.yml
- name: Send Coverage Info to CoverAlls
  run: cat coverage/lcov.info | npx coveralls
```

You need to request the `repo_token` from https://coveralls.io/.

### Setup Python
Setup Python environment required by SmartBugs.
```yaml
- name: Setup Python 3.8  
  uses: actions/setup-python@v2
  with:
    python-version: 3.8 # Version range or exact version of a Python version to use, using SemVer's version range syntax
    architecture: 'x64' # optional x64 or x86. Defaults to x64 if not specified
- name: Show Python version
  run: python --version
```

### SmartBugs
#### Setup SmartBugs
Clone SmartBugs from GitHub repo and install dependencies.
```yaml
- name: Clone SmartBugs Repo
  run: git clone https://github.com/smartbugs/smartbugs.git
- name: Remove SmartBugs Results and Install SmartBugs Dependencies
  run: cd smartbugs;rm -r results;pip install -r requirements.txt
``` 

#### Run SmartBugs Analysis
Run analysis by iterating over all solidity files except `Migrations.sol` and store the outcome to the `results` directory.
```yaml
- name: Run SmartBugs Analysis
  run: |
    solidityFiles=($(ls -I Migrations.sol contracts))
    DIR=$(pwd);cd smartbugs
    for sol in "${solidityFiles[@]}"
    do
        echo "Analysing $sol..."
        python smartBugs.py --tool all --file $DIR/contracts/$sol
    done
 ```

 #### Store The Results
 Move the `results` directory out of `smartbugs` directory and store it in current GitHub repo.
 ```yaml         
- name: Move SmartBugs Results to Parent Directory
   run: |
    [[ -d results ]] && rm -r results
    cd smartbugs
    mv results ../
- name: Commit SmartBugs Results
   uses: EndBug/add-and-commit@v7
   with:
     author_name: github-actions
     author_email: action@github.com
     message: 'chore: added smartbugs results'
     add: 'results'
```

## Known Issues
- The __Run Codechecks__ step above generates the expected output locally but not in GitHub Actions.