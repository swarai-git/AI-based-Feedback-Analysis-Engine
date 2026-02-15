@echo off
echo Setting up AI Feedback Analysis System...

cd backend
npm install
copy .env.example .env

cd ..\frontend
npm install
copy .env.example .env

cd ..\ml-server
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm

cd ..
echo Setup complete!
pause