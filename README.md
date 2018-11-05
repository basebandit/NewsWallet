# NewsWallet

> A restful api for news wallet client mobile app

## Requirements

Install nodejs in your system

```bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
bash install_nvm.sh
source ~/.bashrc
```

or

```bash
sudo apt-get update
sudo apt-get install build-essential libssl-dev
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
bash install_nvm.sh
source ~/.bashrc
```

## Verify nvm installation

```bash
command -v nvm
```

The above command should output `nvm` if the installation was successful. Please note that
`which nvm` will not work, since nvm is a sourced shell function, not an executable binary.

If you are having issues installing nvm you can check out the instructions at [creationix/nvm](https://github.com/creationix/nvm)

## Node installlation

If all went well.You should now be able to install nodejs.Note its preferable to use nodejs >=v8.0.

```bash
nvm ls-remote
nvm use v8.11.2
```

Please use the latest LTS version.

## Verify your node installation

```bash
node -v
```

Should output `v8.11.2`

## Usage

Just clone this repository, install dependencies and start application:

```bash
git clone https://github.com/basebandit/NewsWallet.git
cd NewsWallet
npm install
npm start # with nodemon to monitor changes
```

## Configuration

For the api to work you have to set the following environment variables

- DATABASE_USER
- DATABASE_PASS
- DATABASE_PORT
- DATABASE_NAME
- DATABASE_HOST
- JWT_SECRET

## What's inside?

- [express.js](http://expressjs.com) framework
- [mongoose](https://github.com/Automattic/mongoose) Object Document Modelling middleware
- [mongodb](https://www.mongodb.com/) Flexible document storage software
- app configuration by [config](https://github.com/basebandit/NewsWallet/tree/staging/config)
- endpoints schema validation by [hapijs/joi](https://github.com/hapijs/joi)
- all code is written ES5/ES6 supported features
- [npm scripts](https://github.com/basebandit/NewsWallet/blob/staging/package.json#L9) for task automation

## Play with the api

To test the api you can use `curl` or `postman` to make queries.

### Registration

```bash
curl -d '{"username":"user","email":"user@newswallet.org" ,"password":"iamanewswalletuser"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/v1/auth/register
```

output

```bash
{"message":"Registration successful","user":{"username":"user"}}
```

### Login

```bash
curl -d '{"username":"user","password":"iamanewswalletuser"}' -H "Content-Type: application/json" -X POST http://localhost:8080/api/v1/auth/login
```

output

```bash
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZTAwODk0N2YzZTNjMjZlYTI3Mjc3YiIsInVzZXJuYW1lIjoidXNlciIsImlhdCI6MTU0MTQwOTAyNywiZXhwIjoxNTQxNDA5Mzg3fQ.ZxQoCiWu208T9uhJf3i7nL_HEzmn-YypvywDEcgq3kE","expiresIn":360}
```

## Create new article

```bash
curl -d "title=Reverse Engineering Android Applications&description=Breaking The Complexity Beyond The Compilerauthor=Basebandit&origin=NsyncLabs&originUrl=https://nsynclabs.org/security/mobile/reversing-android-applications&category=Android" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZDM4NmIyNjZkYzZkMjcyYTZkNDBmNSIsInVzZXJuYW1lIjoicGFwYSIsImlhdCI6MTU0MTQwOTU4NiwiZXhwIjoxNTQxNDA5OTQ2fQ.Ep5F4cqc8WFj6wgcuyfaYn36DCD8emTIrseqK7_6SOY -H Content-Type: application/x-www-form-urlencoded" -X POST http://localhost:8080/api/v1/articles/
```

output

```bash
{"message":"Saved article successful","article":{"category":["5bdff688af7c921b795abb78"],"views":0,"favoritesCount":0,"_id":"5be00b867f3e3c26ea27277d","title":"Reverse Engineering Android Applications","description":"Breaking The Complexity Beyond The Compilerauthor=Basebandit","author":"","articleImage":"","origin":"NsyncLabs","originUrl":"https://nsynclabs.org/security/mobile/reversing-android-applications","slug":"reverse-engineering-android-applications","createdAt":"2018-11-05T09:21:10.993Z","updatedAt":"2018-11-05T09:21:10.993Z","__v":0}}
```

##Fetch articles

```bash
curl localhost:8080/api/v1/articles/reverse-engineering-android-applications
```

output

```bash
{"article":{"category":[{"_id":"5bdff688af7c921b795abb78","title":"android","slug":"android","__v":0}],"views":0,"favoritesCount":0,"_id":"5be00b867f3e3c26ea27277d","title":"Reverse Engineering Android Applications","description":"Breaking The Complexity Beyond The Compilerauthor=Basebandit","author":"","articleImage":"","origin":"NsyncLabs","originUrl":"https://nsynclabs.org/security/mobile/reversing-android-applications","slug":"reverse-engineering-android-applications","createdAt":"2018-11-05T09:21:10.993Z","updatedAt":"2018-11-05T09:21:10.993Z","__v":0}}
```

##Fetch articles by category

```bash
curl localhost:8080/api/v1/articles/category/android
```

output

```bash
[{"category":[{"_id":"5bdff688af7c921b795abb78","title":"android","slug":"android","__v":0}],"views":0,"favoritesCount":0,"_id":"5bdff688af7c921b795abb79","title":"Reverse Engineering Baseband","description":"Exploiting Android's Baseband Processor With RCE","author":"Basebandit","articleImage":"","origin":"NsyncLab","originUrl":"https://nsynclabs.org/security/web/breaking-the-baseband","slug":"reverse-engineering-baseband","createdAt":"2018-11-05T07:51:36.985Z","updatedAt":"2018-11-05T07:51:36.985Z","__v":0},{"category":[{"_id":"5bdff688af7c921b795abb78","title":"android","slug":"android","__v":0}],"views":0,"favoritesCount":0,"_id":"5bdffae937631f1d70d6ff4a","title":"Reverse Engineering Android Trojan","description":"Banking Trojan The Evil Within","author":"Basebandit","articleImage":"","origin":"NsyncLab","originUrl":"https://nsynclabs.org/security/web/reversing-android-trojans","slug":"reverse-engineering-android-trojan","createdAt":"2018-11-05T08:10:17.866Z","updatedAt":"2018-11-05T08:10:17.866Z","__v":0},{"category":[{"_id":"5bdff688af7c921b795abb78","title":"android","slug":"android","__v":0}],"views":0,"favoritesCount":0,"_id":"5bdffb4d37631f1d70d6ff4b","title":"Reverse Engineering Kotlin Applications","description":"Breaking The Complexity Beyond The Object","author":"Basebandit","articleImage":"","origin":"NsyncLab","originUrl":"https://nsynclabs.org/security/web/reversing-kotlin-applications","slug":"reverse-engineering-kotlin-applications","createdAt":"2018-11-05T08:11:57.524Z","updatedAt":"2018-11-05T08:11:57.524Z","__v":0},{"category":[{"_id":"5bdff688af7c921b795abb78","title":"android","slug":"android","__v":0}],"views":0,"favoritesCount":0,"_id":"5be00b867f3e3c26ea27277d","title":"Reverse Engineering Android Applications","description":"Breaking The Complexity Beyond The Compilerauthor=Basebandit","author":"","articleImage":"","origin":"NsyncLabs","originUrl":"https://nsynclabs.org/security/mobile/reversing-android-applications","slug":"reverse-engineering-android-applications","createdAt":"2018-11-05T09:21:10.993Z","updatedAt":"2018-11-05T09:21:10.993Z","__v":0}]
```
