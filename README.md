# UAA-Course-Evaluation-System

.env template
```
DJANGO_SECRET_KEY=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```

reinit migrations
```
(delete all migrations files)
cd backend
python3 manage.py makemigrations
```

run django
```
cd backend
python3 -m venv venv
source myenv/bin/activate
pip3 install -r requirements.txt
python3 manage.py runserver
```