@echo off
echo Setting up Eye Clinic Database...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install required dependencies if not present
if not exist node_modules (
    echo Installing dependencies...
    npm install
)

REM Run database initialization
echo Initializing database...
node init-database.js

echo.
echo Database setup completed!
echo You can now run the application.
echo.
pause