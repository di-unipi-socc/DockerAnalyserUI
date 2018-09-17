# DockerAnalyserUI

User interface for DockerAnalyser.

## Backend Setup

Create and activate virtualenv:
```sh
virtualenv -p python3 backend
cd backend
source bin/activate
```

Install dependecies:
```sh
pip install --upgrade pip
pip install -r requirements.txt
```

Setup Django:
```sh
cd dockeranalyser
python manage.py migrate
```

Start Django:
```sh
python manage.py runserver
```

## Frontend Setup
Just open index.html, dist folder already contains compiled files.
If backend is running, go to http://localhost:8000

To edit, first install dependecies:
```sh
cd frontend
npm install
```

Edit files, then:
```sh
npm run build
```
Or, to auto-build after each save:
```sh
npm run watch
```

Generate documentation with:
```sh
jsdoc -r -c jsdoc-conf.json -d docs
```