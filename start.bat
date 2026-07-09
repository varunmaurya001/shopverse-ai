@echo off
set NODE_OPTIONS=--no-warnings
echo ========================================
echo   ShopVerse AI - Backend Setup ^& Start
echo ========================================
echo.

if not exist .env (
  echo [ERROR] .env file not found.
  echo Copy .env.example to .env and fill in DATABASE_URL and REDIS_URL first.
  pause
  exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo.
echo [2/4] Setting up database tables...
call npm run db:setup
if errorlevel 1 goto :error

echo.
echo [2b/4] Loading demo catalog data...
call npm run seed
if errorlevel 1 goto :error

echo.
echo [3/4] Building the app...
call npm run build
if errorlevel 1 goto :error

echo.
echo [4/4] Starting the server...
echo Backend will run at http://localhost:3000/api/v1
echo Swagger docs at http://localhost:3000/api/docs
echo Press Ctrl+C to stop.
echo.
call npm run start
goto :eof

:error
echo.
echo Something went wrong above. Scroll up to see the error message.
pause
